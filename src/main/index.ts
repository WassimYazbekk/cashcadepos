import { app, shell, BrowserWindow } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Worker } from 'worker_threads'
import { CLOSE_SERVER, SERVER_CLOSED, START_SERVER, START_SERVER_FAILED } from './lib/constants'

let server: Worker

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1100,
    minHeight: 700,
    height: 700,
    width: 1100,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  server = new Worker(resolve(__dirname, './worker.js'))

  server.on('message', (message) => {
    console.log(message)

    if (message === START_SERVER_FAILED) {
      console.log('initialization failed')
      app.quit()
    }
    if (message === SERVER_CLOSED) {
      console.log('terminating server')
      server.terminate()
    }
  })
  server.once('error', (error) => {
    console.log('worker error: ' + error)
    app.quit()
  })

  server.postMessage({
    action: START_SERVER,
    userDataPath: './userData/',
    databaseName: 'test.db'
  })

  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('before-quit', () => {
  if (server) {
    server.postMessage(CLOSE_SERVER)
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

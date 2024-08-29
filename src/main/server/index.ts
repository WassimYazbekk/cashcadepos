import { parentPort } from 'worker_threads'
import { closeDatabase, db } from './src/database'
import { createServer } from './create-server'
import {
  CLOSE_SERVER,
  SERVER_CLOSED,
  SERVER_STARTED,
  START_SERVER,
  START_SERVER_FAILED
} from '@main/lib/constants'
if (parentPort) {
  parentPort.on('message', (message) => {
    try {
      if (message.action === START_SERVER) {
        const userDataPath = message.userDataPath
        const databaseName = message.databaseName
        const app = createServer(userDataPath, databaseName)
        console.log(import.meta.env.MAIN_VITE_LOCAL_SERVER_URL)

        app.listen(import.meta.env.MAIN_VITE_EXPRESS_SERVER_PORT, () =>
          parentPort!.postMessage(SERVER_STARTED)
        )
      }
      if (message.action === CLOSE_SERVER) {
        if (db) closeDatabase()
        console.log('db-closed')
        parentPort!.postMessage(SERVER_CLOSED)
      }
    } catch (error) {
      console.log(error)
      parentPort!.postMessage(START_SERVER_FAILED)
    }
  })
} else {
  console.error("Worker thread doesn't have access to parent port.")
}

import { initializeDatabase } from './src/database'
import express, { Request, Response } from 'express'
import cors from 'cors'
import multer from 'multer'
import { router as customerRouter } from './src/routes/customer.router'
import { router as supplierRouter } from './src/routes/supplier.router'
import { router as productRouter } from './src/routes/product.router'
import { router as categoryRouter } from './src/routes/category.router'
import { router as stockRouter } from './src/routes/stock.router'
import { router as billRouter } from './src/routes/bill.router'
import { router as orderRouter } from './src/routes/order.router'
import { join } from 'path'
import { NULL_DATABASE_ERROR } from './src/lib/throwable'
import * as fs from 'fs'
import { INTERNAL_SERVER_ERROR, NOT_FOUND_ERROR } from './src/lib/error-response'

type FileNameCallback = (error: Error | null, filename: string) => void

export function createServer(userDataPath: string, databaseName: string) {
  const app = express()
  const fileStorage: multer.StorageEngine = multer.diskStorage({
    destination: join(userDataPath, 'public', 'uploads'),
    //@ts-ignore
    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
      callback(null, Date.now() + '_' + file.originalname)
    }
  })
  const upload = multer({ storage: fileStorage })
  app.use(express.static(userDataPath + '/public'))
  app.use('/uploads', express.static('uploads'))

  //don't move
  if (!initializeDatabase(userDataPath, databaseName)) throw NULL_DATABASE_ERROR

  app.use(cors())
  app.use(express.json())
  app.use('/api/customer/', customerRouter)
  app.use('/api/supplier/', supplierRouter)
  app.use('/api/product/', productRouter)
  app.use('/api/category/', categoryRouter)
  app.use('/api/stock/', stockRouter)
  app.use('/api/bill/', billRouter)
  app.use('/api/order/', orderRouter)

  app.post('/api/upload', upload.single('file'), function (req, res) {
    if (req.file) {
      return res.status(201).json({ image: join('uploads', req.file.filename) })
    }
    return res.status(500).json({
      error: INTERNAL_SERVER_ERROR
    })
  })

  app.get('/api/locales/:lng/:ns', async (req: Request, res: Response) => {
    const { lng, ns } = req.params
    const filePath = join(__dirname, '../../resources/locales', lng, `${ns}.json`)
    try {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.log(err)

          res.status(404).json({ error: NOT_FOUND_ERROR })
        } else res.json(JSON.parse(data))
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error: INTERNAL_SERVER_ERROR
      })
    }
  })
  return app
}

import * as express from 'express'
import * as stockController from '../controllers/stock.controller'
import {
  validateCreateStock,
  validateGetAllStocks,
  validateGetPaginatedStocks,
  validateUpdateStock
} from '../middleware/stock.middleware'
export const router = express.Router()

router.get('/all', validateGetAllStocks)
router.get('/all', stockController.all)
router.get('/', validateGetPaginatedStocks)
router.get('/', stockController.index)
router.get('/:id', stockController.show)
router.post('/', validateCreateStock)
router.post('/', stockController.store)
router.put('/', validateUpdateStock)
router.put('/', stockController.update)

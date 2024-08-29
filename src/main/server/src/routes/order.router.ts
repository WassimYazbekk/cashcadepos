import * as express from 'express'
import * as orderController from '../controllers/order.controller'
import {
  validateCreateOrder,
  validateGetAllOrders,
  validateGetPaginatedOrders,
  validateUpdateOrder
} from '../middleware/order.middleware'
export const router = express.Router()

router.get('/all', validateGetAllOrders)
router.get('/all', orderController.all)
router.get('/', validateGetPaginatedOrders)
router.get('/', orderController.index)
router.get('/:id', orderController.show)
router.post('/', validateCreateOrder)
router.post('/', orderController.store)
router.put('/', validateUpdateOrder)
router.put('/', orderController.update)

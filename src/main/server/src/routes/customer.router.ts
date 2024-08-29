import * as express from 'express'
import * as customerController from '../controllers/customer.controller'
import {
  validateCreateCustomer,
  validateGetPaginatedCustomers,
  validateUpdateCustomer
} from '../middleware/customer.middleware'
export const router = express.Router()

router.get('/all', customerController.all)
router.get('/', validateGetPaginatedCustomers)
router.get('/', customerController.index)
router.get('/:id', customerController.show)
router.post('/', validateCreateCustomer)
router.post('/', customerController.store)
router.put('/', validateUpdateCustomer)
router.put('/', customerController.update)

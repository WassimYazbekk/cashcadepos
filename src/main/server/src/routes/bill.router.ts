import * as express from 'express'
import * as billController from '../controllers/bill.controller'
import {
  validateCreateBill,
  validateGetAllBills,
  validateGetPaginatedBills,
  validateUpdateBill
} from '../middleware/bill.middleware'
export const router = express.Router()

router.get('/all', validateGetAllBills)
router.get('/all', billController.all)
router.get('/', validateGetPaginatedBills)
router.get('/', billController.index)
router.get('/:id', billController.show)
router.post('/', validateCreateBill)
router.post('/', billController.store)
router.put('/', validateUpdateBill)
router.put('/', billController.update)

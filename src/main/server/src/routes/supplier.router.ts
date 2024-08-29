import * as express from 'express'
import * as supplierController from '../controllers/supplier.controller'
import {
  validateCreateSupplier,
  validateGetPaginatedSuppliers,
  validateUpdateSupplier
} from '../middleware/supplier.middleware'
export const router = express.Router()

router.get('/all', supplierController.all)
router.get('/', validateGetPaginatedSuppliers)
router.get('/', supplierController.index)
router.get('/:id', supplierController.show)
router.post('/', validateCreateSupplier)
router.post('/', supplierController.store)
router.put('/', validateUpdateSupplier)
router.put('/', supplierController.update)

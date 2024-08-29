import * as express from 'express'
import * as productController from '../controllers/product.controller'
import {
  validateCreateProduct,
  validateGetAllProducts,
  validateGetPaginatedProducts,
  validateUpdateProduct
} from '../middleware/product.middleware'
export const router = express.Router()

router.get('/all', validateGetAllProducts)
router.get('/all', productController.all)
router.get('/', validateGetPaginatedProducts)
router.get('/', productController.index)
router.get('/:id', productController.show)
router.post('/', validateCreateProduct)
router.post('/', productController.store)
router.put('/', validateUpdateProduct)
router.put('/', productController.update)

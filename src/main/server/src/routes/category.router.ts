import * as express from 'express'
import * as categoryController from '../controllers/category.controller'
import {
  validateCreateCategory,
  validateGetAllCategories,
  validateGetPaginatedCategories,
  validateUpdateCategory
} from '../middleware/category.middleware'
export const router = express.Router()

router.get('/all', validateGetAllCategories)
router.get('/all', categoryController.all)
router.get('/', validateGetPaginatedCategories)
router.get('/', categoryController.index)
router.get('/:id', categoryController.show)
router.post('/', validateCreateCategory)
router.post('/', categoryController.store)
router.put('/', validateUpdateCategory)
router.put('/', categoryController.update)

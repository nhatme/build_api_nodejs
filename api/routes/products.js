import express from 'express'
import upload from '../method/uploadImage.js'
import checkAuth from '../middleware/check-auth.js'
import { productMethod } from '../controller/products.js'
const router = express.Router()

router.get('/', checkAuth, productMethod.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), productMethod.products_create_one)

router.get('/:productId', checkAuth, productMethod.products_getOne_by_id)

router.patch('/:productId', checkAuth, productMethod.products_update_one)

router.delete('/:productId', checkAuth, productMethod.products_delete_one)

export default router
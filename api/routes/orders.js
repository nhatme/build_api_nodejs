import express from 'express'
import checkAuth from '../middleware/check-auth.js'
import { orderMethod } from '../controller/orders.js'
const router = express.Router()

router.get('/', checkAuth, orderMethod.orders_get_all)

router.post('/', checkAuth, orderMethod.orders_create_order)

router.get('/:orderId', checkAuth, orderMethod.orders_getOne_by_id)

router.delete('/:orderId', checkAuth, orderMethod.orders_delete_one)

export default router
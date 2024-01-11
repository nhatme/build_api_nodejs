import Order from "../model/order.js"
import checkAuth from '../middleware/check-auth.js'

const order_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        id: doc._id,
                        productId: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3002/orders/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({ err: err })
        })
}

export const orderMethod = { order_get_all }
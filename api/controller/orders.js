import Order from "../model/order.js"
import Product from '../model/product.js'
import mongoose from 'mongoose'

const orders_get_all = (req, res, next) => {
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

const orders_create_order = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: qty
            })
            return order.save()
        })
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    id: result._id,
                    productId: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:3002/orders/${result._id}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

    let qty = null
    if (req.body.quantity == "") {
        qty = 1
    } else {
        qty = req.body.quantity
    }

    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: qty
    })

    order
        .save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    id: result._id,
                    productId: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:3002/orders/${result._id}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
}

const orders_getOne_by_id = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: `http://localhost:3002/orders`
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const orders_delete_one = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: `http://localhost:3002/orders`,
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(404).json({
                message: " not found any order with id: " + req.params.orderId,
                error: err
            })
        })
}

export const orderMethod = {
    orders_get_all,
    orders_create_order,
    orders_getOne_by_id,
    orders_delete_one
}
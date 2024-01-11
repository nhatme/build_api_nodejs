import express from 'express'
import Product from '../model/product.js'
import mongoose from 'mongoose'
import multer from 'multer'
import checkAuth from '../middleware/check-auth.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/[-T:]/g, '-').slice(0, -5)
        cb(null, `${timestamp}${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

router.get('/', checkAuth, (req, res, next) => {
    Product.find()
        // .select('name price _id imageProduct')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        imageProduct: {
                            source: doc.imageProduct,
                            demo: `http://localhost:3002/${doc.imageProduct}`
                        },
                        id: doc._id,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3002/products/${doc._id}`
                        }
                    }
                })
            }

            res.status(200).json(response)

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        imageProduct: req.file.path
    })

    product
        .save()
        .then(result => {
            res.status(200).json({
                message: "Created a product",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3002/products/${result._id}`
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: err
            })
        })
})

router.get('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        // .select('name price _id imageProduct')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: {
                        name: doc.name,
                        price: doc.price,
                        imageProduct: {
                            source: doc.imageProduct,
                            demo: `http://localhost:3002/${doc.imageProduct}`
                        },
                    },
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3002/products/'
                    }
                })
            } else {
                res.status(404).json({ message: `Not found for this id: ${id}` })
            }
        })
        .catch(err => {
            res.status(404).json({ message: err })
            console.log(err)
        })
})

router.patch('/:productId', checkAuth, (req, res, next) => {

    Product.findByIdAndUpdate({ _id: req.params.productId }, { $set: { name: req.body.newName, price: req.body.newPrice } }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product updated",
                result: {
                    type: 'GET',
                    url: `http://localhost:3002/products/${req.params.productId}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "failed", result: err })
        })
})

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({ message: "deleted", result: result })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: `no product with id: ${id}`,
                error: err
            })
        })
})

export default router
import Product from '../model/product.js'
import mongoose from 'mongoose'

const products_get_all = async (req, res, next) => {
    Product.find()
        // .select('name price _id imageProduct')
        .exec()
        .then(docs => {
            const response = {
                message: "success",
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
}

const products_create_one = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        imageProduct: req.file.path,
        description: req.body.description,
        review: req.body.review,
        isFavorite: req.body.isFavorite
    })
    console.log(req.file.path);

    product
        .save()
        .then(result => {
            res.status(200).json({
                message: "Created a product",
                createdProduct: {
                    id: result._id,
                    name: result.name,
                    price: result.price,
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
}

const products_get_one_followed_id = (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
        // .select('name price _id imageProduct')
        .exec()
        .then(doc => {
            res.status(200).json({
                status: true,
                message: "success",
                product: {
                    name: doc.name,
                    price: doc.price,
                    imageProduct: {
                        source: doc.imageProduct,
                        demo: `http://localhost:3002/${doc.imageProduct}`
                    },
                    description: doc.description,
                    review: doc.review,
                    isFavorite: doc.isFavorite
                }
            })
        })
        .catch(err => {
            res.status(404).json({
                status: false,
                message: err
            })
        })
}

const products_update_one = (req, res, next) => {

    Product.findByIdAndUpdate({ _id: req.params.productId }, { $set: { name: req.body.newName, price: req.body.newPrice } }, { new: true })
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "Product updated",
                result: {
                    type: 'GET',
                    url: `http://localhost:3002/products/${req.params.productId}`
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: false,
                message: "failed",
                result: err
            })
        })
}

const products_delete_one = (req, res, next) => {
    const id = req.params.productId
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "deleted",
                result: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: false,
                message: `no product with id: ${id}`,
                error: err
            })
        })
}

export const productMethod = {
    products_get_all,
    products_create_one,
    products_get_one_followed_id,
    products_update_one,
    products_delete_one
}
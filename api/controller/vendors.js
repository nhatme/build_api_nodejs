import mongoose from "mongoose"
import Vendor from "../model/vendor.js"

function timestamp() {
    const timestamp = new Date().toISOString().replace(/[-T:]/g, '-').slice(0, -5)
    return timestamp
}

const vendors_get_all = (req, res, next) => {
    Vendor.find()
        .exec()
        .then(result => {
            const response = {
                status: true,
                message: "success",
                count: result.length,
                vendors: result.map(doc => {
                    return {
                        createdAt: doc.createdAt,
                        id: doc._id,
                        name: doc.name,
                        review: doc.review,
                        imageVendor: {
                            source: doc.imageVendor,
                            demo: `http://localhost:3002/${doc.imageVendor}`
                        },
                        request: {
                            type: 'GET',
                            url: `http://localhost:3002/vendors/${doc._id}`
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: err
            })
        })
}

const vendors_create_one = (req, res, next) => {
    const path = req.file.path
    const pathOk = path.replace("\\", "/")

    const vendor = new Vendor({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        imageVendor: pathOk,
        review: req.body.review,
        createdAt: timestamp()
    })
    vendor
        .save()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "Created an vendor",
                createdVendor: {
                    id: result._id,
                    name: result.name,
                    createdAt: result.createdAt,
                    request: {
                        type: "GET",
                        url: `http://localhost:3002/vendors/${result._id}`
                    }
                }
            })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: err
            })
        })
}

const vendors_getOne_by_id = (req, res, next) => {
    const id = req.params.vendorId
    Vendor.findById(id)
        .exec()
        .then(doc => {
            const vendors = {
                status: true,
                message: "success",
                id: id,
                vendor: {
                    name: doc.name,
                    imageSource: doc.imageVendor,
                    demo: `http://localhost:3002/${doc.imageVendor}`,
                    createdAt: doc.createdAt
                }
            }
            res.status(200).json(vendors)
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: `failed. No vendor with id: ${id}`,
                result: err
            })
        })
}

const vendors_update_one = (req, res, next) => {
    Vendor.findByIdAndUpdate(
        { _id: req.params.vendorId },
        {
            $set:
            {
                name: req.body.name,
            }
        },
        { new: true }
    )
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "Vendor updated",
                result: {
                    type: 'GET',
                    url: `http://localhost:3002/vendors/${req.params.vendorId}`
                }
            })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: "failed",
                result: err
            })
        })
}

const vendors_delete_one = (req, res, next) => {
    const id = req.params.vendorId
    Vendor.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "deleted",
                result: result
            })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: `no vendor with id: ${id}`,
                error: err
            })
        })
}

export const vendorMethod = {
    vendors_get_all,
    vendors_create_one,
    vendors_getOne_by_id,
    vendors_update_one,
    vendors_delete_one
}
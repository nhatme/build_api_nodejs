import mongoose from 'mongoose'
import Author from '../model/author.js'

function timestamp() {
    const timestamp = new Date().toISOString().replace(/[-T:]/g, '-').slice(0, -5)
    return timestamp
}

const authors_get_all = (req, res, next) => {
    Author.find()
        .exec()
        .then(result => {
            const response = {
                status: true,
                message: "success",
                count: result.length,
                authors: result.map(doc => {
                    return {
                        createdAt: doc.createdAt,
                        id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        imageAuthor: {
                            source: doc.imageAuthor,
                            demo: `http://localhost:3002/${doc.imageAuthor}`
                        },
                        request: {
                            type: 'GET',
                            url: `http://localhost:3002/authors/${doc._id}`
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

const authors_create_one = (req, res, next) => {
    const path = req.file.path
    const pathOk = path.replace("\\", "/")

    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        imageAuthor: pathOk,
        description: req.body.description,
        review: req.body.review,
        createdAt: timestamp()
    })

    author
        .save()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "Created an author",
                createdAuthor: {
                    id: result._id,
                    name: result.name,
                    createdAt: result.createdAt,
                    request: {
                        type: "GET",
                        url: `http://localhost:3002/authors/${result._id}`
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
const authors_getOne_by_id = (req, res, next) => {
    const id = req.params.authorsId
    Author.findById(id)
        .exec()
        .then(doc => {
            const authors = {
                status: true,
                message: "success",
                id: id,
                author: {
                    name: doc.name,
                    imageSource: doc.imageAuthor,
                    description: doc.description,
                    createdAt: doc.createdAt
                }
            }
            res.status(200).json(authors)
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                status: false,
                message: `failed. No author with id: ${id}`,
                result: err
            })
        })
}

const authors_update_one = (req, res, next) => {
    Author.findByIdAndUpdate(
        { _id: req.params.authorsId },
        {
            $set:
            {
                name: req.body.name,
                description: req.body.description
            }
        },
        { new: true }
    )
        .exec()
        .then(result => {
            res.status(200).json({
                status: true,
                message: "Author updated",
                result: {
                    type: 'GET',
                    url: `http://localhost:3002/authors/${req.params.authorsId}`
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

const authors_delete_one = (req, res, next) => {
    const id = req.params.authorsId
    Author.deleteOne({ _id: id })
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
                message: `no author with id: ${id}`,
                error: err
            })
        })

}


export const authorMethod = {
    authors_get_all,
    authors_create_one,
    authors_getOne_by_id,
    authors_update_one,
    authors_delete_one
}
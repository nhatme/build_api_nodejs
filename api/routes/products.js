import express from 'express'
import multer from 'multer'
import checkAuth from '../middleware/check-auth.js'
import { productMethod } from '../controller/products.js'

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

router.get('/', checkAuth, productMethod.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), productMethod.products_create_one)

router.get('/:productId', checkAuth, productMethod.products_get_one_followed_id)

router.patch('/:productId', checkAuth, productMethod.products_update_one)

router.delete('/:productId', checkAuth, productMethod.products_delete_one)

export default router
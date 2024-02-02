import express from 'express'
import { authorMethod } from '../controller/authors.js'
import checkAuth from '../middleware/check-auth.js'
import upload from '../method/uploadImage.js'

const router = express.Router()

router.get('/', checkAuth, authorMethod.authors_get_all)
router.post('/', checkAuth, upload.single('authorImage'), authorMethod.authors_create_one)
router.get('/:authorsId', checkAuth, authorMethod.authors_getOne_by_id)
router.patch('/:authorsId', checkAuth, authorMethod.authors_update_one)
router.delete('/:authorsId', checkAuth, authorMethod.authors_delete_one)

export default router
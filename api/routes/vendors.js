import express from 'express'
import { vendorMethod } from '../controller/vendors.js'
import checkAuth from '../middleware/check-auth.js'
import upload from '../method/uploadImage.js'

const router = express.Router()

router.get('/', vendorMethod.vendors_get_all)
router.post('/', upload.single('imageVendor'), vendorMethod.vendors_create_one)
router.get('/:vendorId', vendorMethod.vendors_getOne_by_id)
router.patch('/:vendorId', vendorMethod.vendors_update_one)
router.delete('/:vendorId', vendorMethod.vendors_delete_one)

export default router
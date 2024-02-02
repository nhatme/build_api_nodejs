import mongoose from "mongoose"

const vendorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    imageVendor: { type: String, required: true },
    review: { type: Number, required: null },
    createdAt: { type: String, required: true }
}, {
    collection: 'Vendor',
    versionKey: false //here
})

export default mongoose.model('Vendor', vendorSchema)
import mongoose from "mongoose"

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageProduct: { type: String, required: true },
    description: { type: String, default: "This is description" },
    review: { type: Number, required: null },
    isFavorite: { type: Number, required: null }
}, {
    collection: 'Product',
    versionKey: false //here
})

export default mongoose.model('Product', productSchema)
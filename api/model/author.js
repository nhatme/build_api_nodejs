import mongoose from "mongoose"

const authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    imageAuthor: { type: String, required: true },
    description: { type: String, default: "This is description" },
    review: { type: Number, required: null },
    createdAt: {type: String, required: true}
}, {
    collection: 'Author',
    versionKey: false //here
})

export default mongoose.model('Author', authorSchema)


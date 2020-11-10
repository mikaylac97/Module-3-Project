const { Schema, model } = require('mongoose')

const reviewSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        numOfStars: { type: Number },
        content: { type: String },
        book: { type: Schema.Types.ObjectId, ref: 'Book' }
    },
    {
        timestamps: true
    }
)

module.exports = model('Review', reviewSchema)
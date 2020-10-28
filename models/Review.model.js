const { Schema, model } = require('mongoose')

const reviewSchema = new Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        numOfStars: { type: Number },
        content: { type: String }
    },
    {
        timestamps: true
    }
)

module.exports = model('Review', reviewSchema)
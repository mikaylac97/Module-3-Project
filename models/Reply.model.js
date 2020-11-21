const { Schema, model } = require('mongoose')

const replySchema = new Schema(
    {
        replyContent: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true
    }
)

module.exports = model('Reply', replySchema)
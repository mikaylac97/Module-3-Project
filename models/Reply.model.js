const { Schema, model } = require('mongoose')

const replySchema = new Schema(
    {
        content: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: true
    }
)

module.exports = model('Reply', replySchema)
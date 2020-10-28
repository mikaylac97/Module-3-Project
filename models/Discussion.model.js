const { Schema, model } = require('mongoose');

const discussionSchema = new Schema(
    {
        title: { type: String },
        content: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
    },
    {
        timestamps: true
    }
)

module.exports = model('Discussion', discussionSchema)
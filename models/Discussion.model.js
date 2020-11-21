const { Schema, model } = require('mongoose');

const discussionSchema = new Schema(
    {
        title: { type: String },
        discussionContent: { type: String },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
        book: { type: Schema.Types.ObjectId, ref: 'Book' }
    },
    {
        timestamps: true
    }
)

module.exports = model('Discussion', discussionSchema)
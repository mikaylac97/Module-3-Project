const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true; });
const Schema   = mongoose.Schema;


const bookSchema = new Schema({
    google_books_id: {
        type: String
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    authors: [{
        type: String
    }],
    description: {
        type: String
    },
    pageCount: {
        type: Number
    },
    image_url: {
        type: String
    },
    publishedDate: {
        type: String
    },
    publisher: {
        type: String
    },
    language: {
        type: String
    },
    genres: [{
        type: String
    }],
    reviews: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
    },
    discussions: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Discussion' }]
    }
},
    {
        timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})


const BookModel = mongoose.model('Book', bookSchema);
module.exports = BookModel;


const mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true; });
const Schema   = mongoose.Schema;



const authorSchema = new Schema({
    name: {
        type: String
    },
    books: {
        type: [{type: Schema.Types.ObjectId, ref: 'Book'}]
    }
},
{
    timestamps: true
}
)

const AuthorModel = mongoose.model('Author', authorSchema);
module.exports = AuthorModel;
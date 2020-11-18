const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    firstName: {
      type: String,
      // required: [true, 'First name is required.']
    },
    lastName: {
      type: String,
      // required: [true, 'Last name is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    photo: {
      type: String,
      default: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png'
    },
    location: {
      type: String
    },
    bio: {
      type: String
    },
    followers: [{
      type: Schema.Types.ObjectId, ref: 'User'
    }],
    following: [{
      type: Schema.Types.ObjectId, ref: 'User'
    }],
    reviews: [{
      type: Schema.Types.ObjectId, ref: 'Review'
    }],
    discussions: [{
      type: Schema.Types.ObjectId, ref: 'Discussion'
    }],
    favoriteGenres: [{
      type: String
    }],
    wantToRead: [{
      type: Schema.Types.ObjectId, ref: 'Book'
    }],
    hasRead: [{
      type: Schema.Types.ObjectId, ref: 'Book'
    }]

  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);

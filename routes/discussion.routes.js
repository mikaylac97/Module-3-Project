const express = require('express');
// const { default: Bookshelves } = require('../../client-side/src/components/Bookshelves');
const router = express.Router();
const Discussion = require('../models/Discussion.model');
const Reply = require('../models/Reply.model');
const User = require('../models/User.model');
const Book = require('../models/Book.model');


// Routes to create a new Discussion

router.get('/start-discussion/:bookId', (req, res) => res.json({ message: 'create discussion page' }))

router.post('/start-discussion/:bookId', (req, res, next) => {
    Discussion.create({
        author: req.user._id,
        book: req.params.bookId,
        title: req.body.title,
        discussion: req.body.discussion
    })
    .then(newDiscussion => { 
        User.findByIdAndUpdate(req.user._id, {$push: {discussions: newDiscussion._id}}, { new: true })
        .then(updatedUserWithDiscussion => {
            Book.findByIdAndUpdate(req.params.bookId, {$push: {discussions: newDiscussion._id}}, { new: true })
            .then(() => {
                res.status(200);
            })
        })
        .catch(err => console.log(`Error updating book with new discussion: ${err}`))
    })
    .catch(err => console.log(`Error while updating user with new discussion: ${err}`))
})


// Route to view a specific Discussion

router.get('/discuss/:discussionId', (req, res, next) => {
    Discussion.findById(req.params.discussionId)
    .then(discussionFromDB => {
        res.json({
            singleDiscussion: discussionFromDB
        })
    })
    .catch(err => console.log(err))
})

// Route to delete specific Discussion

router.post('/delete-discuss/:discussionId', (req, res, next) => {
    User.findById(req.session.passport.user)
    .then(user => {
        let index = user.discussions.indexOf(req.params.discussionId.toString())
        user.discussions.splice(index, 1);
            user.save()
            .then(updatedUser => console.log(`The updated user with the deleted collection: ${updatedUser}`))
            .catch(err => console.log(`Error deleting collection from user data: ${err}`))
    })
    .catch(err => console.log(`Error finding user in database: ${err}`))

    Discussion.findByIdAndDelete(req.params.discussionId)
    .then(deletedDiscussion => {
        console.log(`This is the deleted collection: ${deletedDiscussion}`)
    })
    .catch(err => console.log(`Error deleting collection: ${err}`))
})


module.exports = router;
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
    console.log({
        user: req.user,
        book: req.params.bookId,
        req: req.body
    })
    Discussion.create({
        author: req.user._id,
        book: req.params.bookId,
        title: req.body.title,
        content: req.body.content
    })
    .then(newDiscussion => { 
        User.findByIdAndUpdate(req.user._id, {$push: {discussions: newDiscussion._id}}, { new: true })
        .then(updatedUserWithDiscussion => {
            Book.findByIdAndUpdate(req.params.bookId, {$push: {discussions: newDiscussion._id}}, { new: true })
            .then(updatedBook => res.json({
                bookWithNewDiscussion: updatedBook
            }))
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

// Route to edit discussion

router.post('/discuss/edit/:discussionId', (req, res, next) => {
    Discussion.findByIdAndUpdate(req.params.discussionId, req.body, { new: true })
        .then(updatedDiscussion => {
            res.status(200).json({updatedDiscussion})
        })
        .catch(err => console.log(`Error updating discussion: ${err}`))
})

// Route to delete specific Discussion

router.post('/delete-discuss/:discussionId', (req, res, next) => {
    User.findById(req.session.passport.user)
    .then(user => {
        let index = user.discussions.indexOf(req.params.discussionId.toString())
        user.discussions.splice(index, 1);
            user.save()
            .then(updatedUser => console.log(`The updated user with the deleted discussion: ${updatedUser}`))
            .catch(err => console.log(`Error deleting discussion from user data: ${err}`))
    })
    .catch(err => console.log(`Error finding user in database: ${err}`))

    Discussion.findByIdAndDelete(req.params.discussionId)
    .then(deletedDiscussion => {
        console.log(`This is the deleted discussion: ${deletedDiscussion}`)
    })
    .catch(err => console.log(`Error deleting discussion: ${err}`))
})


module.exports = router;
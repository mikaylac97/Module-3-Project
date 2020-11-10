const express = require('express');
const router = express.Router();
const passport = require('passport');

const Review = require('../models/Review.model.js');
const Book = require('../models/Book.model.js');
const User = require('../models/User.model');



// GET User's reviews

router.get('/api/reviews/:userId', (req, res, next) => {
    User.findById(req.params.userId)
    .populate('reviews')
        .then(foundUser => {
            foundUser
                res.json({
                    reviews: foundUser.reviews
                })
        })
        .catch(err => console.log(`Error finding user's reviews: ${err}`))
})


// POST review to book

router.post('/api/review/:bookId', (req, res, next) => {
    Review.create({
        author: req.session.passport.user,
        numOfStars: req.body.numOfStars,
        content: req.body.content,
        book: req.params.bookId
    })
    .then(newReviewFromDB => {
        User.findByIdAndUpdate(req.session.passport.user, {$push: {reviews: newReviewFromDB._id}})
            .then(reviewWithUpdatedUser => {
                Book.findByIdAndUpdate(req.params.bookId, {$push: {reviews: reviewWithUpdatedUser}})
                .then(updatedBook => res.json({
                    bookWithNewReview: updatedBook
                }))
                .catch(err => console.log(`Error updating book with new commment in DB: ${err}`))
            })
            .catch(err => console.log(`Error updating user with review: ${err}`))
    })
    .catch(err => console.log(`Error finding book in DB: ${err}`))
})





module.exports = router;
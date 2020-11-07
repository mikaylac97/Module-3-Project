const express = require('express');
const router = express.Router();
const passport = require('passport');

const Review = require('../models/Review.model.js');
const Book = require('../models/Book.model.js')




// POST review to book

router.post('/api/review/:bookId', (req, res, next) => {
    Review.create({
        author: req.session.passport.user,
        numOfStars: req.body.numOfStars,
        content: req.body.content
    })
    .then(newReviewFromDB => {
        Book.findByIdAndUpdate(req.params.bookId, {$push: {reviews: newReviewFromDB._id}})
            .then(updatedBook => res.json({
                bookWithNewReview: updatedBook
            }))
            .catch(err => console.log(`Error updating book with new commment in DB: ${err}`))
    })
    .catch(err => console.log(`Error finding book in DB: ${err}`))
})





module.exports = router;
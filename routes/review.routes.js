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
    .populate({ 
        path: 'reviews',
        populate: {
          path: 'book',
          model: 'Book'
        } 
     })
        .then(foundUser => {
            console.log(foundUser)
            // const authorized = req.user._id.toString() === foundUser._id.toString()
            foundUser
                res.json({
                    // authorized,
                    reviews: foundUser.reviews
                })
        })
        .catch(err => console.log(`Error finding user's reviews: ${err}`))
})


// POST review to book

router.post('/api/review/:bookId', (req, res, next) => {
    Review.create({
        author: req.user._id,
        numOfStars: req.body.numOfStars,
        content: req.body.content,
        book: req.params.bookId
    })
    .then(newReviewFromDB => {
        User.findByIdAndUpdate(req.user._id, {$push: {reviews: newReviewFromDB._id}})
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

// Route to view a specific Review

router.get('/api/review/:reviewId', (req, res, next) => {
    Review.findById(req.params.reviewId)
    .then(reviewFromDB => {
        res.json({
            singleReview: reviewFromDB
        })
    })  
    .catch(err => console.log(err))
})

// Route to update review

router.post('/api/review/edit/:reviewId', (req, res, next) => {
    Review.findByIdAndUpdate(req.params.reviewId, req.body, { new: true })
        .then(updatedReview => {
            res.status(200).json({updatedReview})
        })
        .catch(err => console.log(`Error updating review: ${err}`))
})


// Route to delete review

router.post('/api/review/delete/:reviewId', (req, res, next) => {
    User.findById(req.user._id)
    .then(user => {
        let index = user.reviews.indexOf(req.params.reviewId.toString())
        user.reviews.splice(index, 1);
            user.save()
            .then(updatedUser => console.log(`The updated user with the deleted review: ${updatedUser}`))
            .catch(err => console.log(`Error deleting review from user data: ${err}`))
    })
    .catch(err => console.log(`Error finding user in database: ${err}`))

    Review.findByIdAndDelete(req.params.reviewId)
    .then(deletedReview => {
        console.log(`This is the deleted review: ${deletedReview}`)
    })
    .catch(err => console.log(`Error deleting review: ${err}`))
})



module.exports = router;
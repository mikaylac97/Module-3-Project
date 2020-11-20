const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const passport = require('passport');
const routeGuard = require('../configs/route-guard.config');
const User = require('../models/User.model');
const Discussion = require('../models/Discussion.model');
const Review = require('../models/Review.model');



// GET posts from users that logged in user follows

router.get('/api/posts',  (req, res, next) => {
    
    User.findById(req.user._id)
        .then(loggedInUser => {
            const usersWithPosts = loggedInUser.following.map(userTheyFollow => 
               User.findById(userTheyFollow)
                    .populate('discussions')
                    .populate('reviews')
                    .populate({ 
                        path: 'reviews',
                        populate: {
                          path: 'book',
                          model: 'Book'
                        } 
                     }) 
                     .populate({ 
                        path: 'discussions',
                        populate: {
                          path: 'book',
                          model: 'Book'
                        } 
                     }) 
                )
                return Promise.all(usersWithPosts).then(timelinePosts => res.json({timelinePosts}))
            }).catch(err => console.log(`Error retrieving logged in user: ${err}`))
        })









module.exports = router;

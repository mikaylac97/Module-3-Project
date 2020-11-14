const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const passport = require('passport');
const routeGuard = require('../configs/route-guard.config');
const User = require('../models/User.model');
const Discussion = require('../models/Discussion.model');
const Review = require('../models/Review.model');



// GET posts from users that logged in user follows

router.get('/api/posts', (req, res, next) => {
    User.findById(req.session.passport.user)
        .then(loggedInUser => {
            loggedInUser.following.map(userTheyFollow => {
                User.findById(userTheyFollow)
                    .populate('discussions')
                    .populate('reviews')
                    .then(usersTheyFollowAndPosts => {
                        res.status(200).json(usersTheyFollowAndPosts)
                    }).catch(err => console.log(`Error retrieving all posts from users they follow: ${err}`))
                })
            }).catch(err => console.log(`Error retrieving logged in user: ${err}`))
        })









module.exports = router;

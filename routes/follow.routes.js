const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');



// POST route to follow user

router.post('/api/follow/:userToFollowId', (req, res, next) => {
    User.findById(req.params.userToFollowId)
        .then(userToFollow => {
            userToFollow.followers.includes(req.session.passport.user)
            ? userToFollow.followers.pull(req.session.passport.user)
            : userToFollow.followers.push(req.session.passport.user);
        userToFollow.save()
            .then(updatedUserToFollow => {
                User.findById(req.session.passport.user)
                    .then(currentUser => {
                        currentUser.following.includes(req.params.userToFollowId)
                        ? currentUser.following.pull(req.params.userToFollowId)
                        : currentUser.following.push(req.params.userToFollowId);
                    req.session.passport.user = currentUser;
                    currentUser
                        .save()
                        .then(updatedCurrentUser => {
                            console.log(`Updated current user: ${updatedCurrentUser}`)
                        })
                        .catch(err => next(err))
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
})

module.exports = router;
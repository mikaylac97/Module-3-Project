const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');



// POST route to follow user

router.post('/api/follow/:userToFollowId', (req, res, next) => {
    User.findById(req.params.userToFollowId)
        .then(userToFollow => {
            userToFollow.followers.includes(req.user._id)
            ? userToFollow.followers.pull(req.user._id)
            : userToFollow.followers.push(req.user._id);
        userToFollow.save()
            .then(updatedUserToFollow => {
                User.findById(req.user._id)
                    .then(currentUser => {
                        currentUser.following.includes(req.params.userToFollowId)
                        ? currentUser.following.pull(req.params.userToFollowId)
                        : currentUser.following.push(req.params.userToFollowId);
                    req.user._id = currentUser;
                    currentUser
                        .save()
                        .then(updatedCurrentUser => {
                            res.status(200).json({
                                updatedCurrentUser
                            })
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
const express = require('express');
const router = express.Router();

const Discussion = require('../models/Discussion.model')
const Reply = require('../models/Reply.model')
const User = require('../models/User.model')


router.post('/api/discuss/:discussionId/reply', (req, res, next) => {
    const { discussionId } = req.params;
    const { replyContent } = req.body;

    console.log({
        body: req.body
    })
    Discussion.findById(discussionId)
        .then(discussionFromDB => {
            Reply.create({ 
                replyContent,
                author: req.user._id
            })
            .then(newComment => {
                discussionFromDB.replies.push(newComment)
                discussionFromDB
                    .save()
                    .then(updatedDiscussion => {
                        updatedDiscussion
                        .populate({
                            path: 'replies',
                            populate: {
                                path: 'author',
                                model: 'User'
                            }
                        })
                        res.json({ updatedDiscussion })
                    })
                    .catch(err => console.log(`Error while saving a reply to a discussion: ${err}`))
            })
            .catch(err => console.log(`Error while creating a reply to a discussion: ${err}`))
        })
    .catch(err => console.log(`Error while getting a single discussion when creating a reply: ${err}`))
})



module.exports = router;
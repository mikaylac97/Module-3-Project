const express = require('express');
const router = express.Router();

const Discussion = require('../models/Discussion.model')
const Reply = require('../models/Reply.model')


router.post('/api/discuss/:discussionId/reply', (req, res, next) => {
    const { discussionId } = req.params;
    const { content } = req.body;

    Discussion.findById(discussionId)
        .then(discussionFromDB => {
            console.log(discussionFromDB)
            Reply.create({ 
                content,
                author: req.session.passport.user
            })
            .then(newComment => {
                discussionFromDB.replies.push(newComment)
                discussionFromDB
                    .save()
                    .then(updatedDiscussion => console.log(updatedDiscussion))
                    .catch(err => console.log(`Error while saving a reply to a discussion: ${err}`))
            })
            .catch(err => console.log(`Error while creating a reply to a discussion: ${err}`))
        })
    .catch(err => console.log(`Error while getting a single discussion when creating a reply: ${err}`))
})



module.exports = router;
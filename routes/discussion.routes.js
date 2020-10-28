const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion.model');
const Reply = require('../models/Reply.model');
const User = require('../models/User.model');


router.get('/start-discussion', (req, res) => res.json({ message: 'create discussion page' }))

router.post('/start-discussion', (req, res, next) => {
    const { title, content, author } = req.body;

    Discussion.create({
        author: req.session.loggedInUser._id,
        title,
        content
    })
    .then(discussionFromDB => {
        User.findByIdAndUpdate(req.session.loggedInUser._id, {$push: {discussions: discussionFromDB._id}}, { new: true })
    })
    .catch(err => console.log(`Error while creating new discussion: ${err}`))
})




module.exports = router;
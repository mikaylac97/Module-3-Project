const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion.model');
const Reply = require('../models/Reply.model');
const User = require('../models/User.model');


// Routes to create a new Discussion

router.get('/start-discussion', (req, res) => res.json({ message: 'create discussion page' }))

router.post('/start-discussion', (req, res, next) => {
    const { title, content, author } = req.body;
    // console.log(req.session)
    Discussion.create({
        author: req.session.passport.user,
        title,
        content
    })
    .then(discussionFromDB => { 
        console.log(discussionFromDB)
        User.findByIdAndUpdate(req.session.passport.user, {$push: {discussions: discussionFromDB}}, { new: true })
        .then(updatedUser => console.log(updatedUser))
    })
    .catch(err => console.log(`Error while creating new discussion: ${err}`))
})

// Route to view a specific Discussion

router.get('/discuss/:discussionId', (req, res, next) => {
    Discussion.findById(req.params.discussionId)
    .then(discussionFromDB => {
        res.json({
            singleDiscussion: discussionFromDB
        })
    })
    .catch(err => console.log(err))
})

// Route to delete specific Discussion

router.post('/delete-discuss/:discussionId', (req, res, next) => {
    User.findById(req.session.passport.user)
    .then(user => {
        let index = user.discussions.indexOf(req.params.discussionId.toString())
        user.discussions.splice(index, 1);
            user.save()
            .then(updatedUser => console.log(`The updated user with the deleted collection: ${updatedUser}`))
            .catch(err => console.log(`Error deleting collection from user data: ${err}`))
    })
    .catch(err => console.log(`Error finding user in database: ${err}`))

    Discussion.findByIdAndDelete(req.params.discussionId)
    .then(deletedCollection => {
        console.log(`This is the deleted collection: ${deletedCollection}`)
    })
    .catch(err => console.log(`Error deleting collection: ${err}`))
})


module.exports = router;
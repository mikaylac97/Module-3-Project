const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport')
const User = require('../models/User.model');
const Book = require('../models/Book.model');



// GET user's bookshelves

router.get('/api/shelves/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .populate('wantToRead')
        .populate('hasRead')
        .then(usersShelvesFromDB => {
            res.json({
                bookshelves: usersShelvesFromDB
            })
        })
        .catch(err => console.log(`Error finding user's bookshelves`))
})

// GET user's Has Read shelf

router.get('/api/has-read/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .populate('hasRead')
        .then(usersHasReadShelf => {
            res.json({
                booksUserHasRead: usersHasReadShelf.hasRead
            })
        })
        .catch(err => console.log(`Error finding user's Has Read shelf: ${err}`))
})

// GET user's Want to Read shelf 

router.get('/api/want-to-read/:userId', (req, res, next) => {
    User.findById(req.params.userId)
    // .populate('wantToRead')
        .then(usersWantToReadShelf => {
            res.json({
                booksUserWantToRead: usersWantToReadShelf.wantToRead
            })
        })
        .catch(err => console.log(`Error finding user's Want to Read shelf: ${err}`))
})

// POST new book to Has Read

router.post('/api/add-to-has-read/:bookId', (req, res, next) => {
    const bookId = req.params.bookId;
    console.log(bookId)
    User.findByIdAndUpdate(req.user._id)
        .then(user => {
            if(user.hasRead.includes(bookId)){
                console.log(`Book already exists in user's 'want to read' list`)
            } else if (user.wantToRead.includes(bookId)) {
                let index = user.wantToRead.indexOf(req.params.bookId.toString())
                user.wantToRead.splice(index, 1)
                user.save()
                    .then(updatedUser => {
                        updatedUser.hasRead.push(bookId)
                        updatedUser.save()
                    })
                    .catch(err => console.log(`Error deleting book from want to read and adding to has read: ${err}`))
            } else {
                user.hasRead.push(bookId)
                user.save()
            }
        })
        .catch(err => console.log(`Error finding user in database: ${err}`))
})

// POST new book to Want to Read

router.post('/api/add-to-want-to-read/:bookId', (req, res, next) => {
    const bookId = req.params.bookId;
    User.findByIdAndUpdate(req.user._id)
        .then(user => {
            if(user.wantToRead.includes(bookId)){
                console.log(`Book already exists in user's 'want to read' list`)
            } else if (user.hasRead.includes(bookId)) {
                let index = user.hasRead.indexOf(req.params.bookId.toString())
                user.hasRead.splice(index, 1)
                user.save()
                    .then(updatedUser => {
                        updatedUser.wantToRead.push(bookId)
                        updatedUser.save()
                    })
                    .catch(err => console.log(`Error deleting book from has read and adding to want to read: ${err}`))
            } else {
                user.wantToRead.push(bookId)
                user.save()
            }
        })
        .catch(err => console.log(`Error finding user in database: ${err}`))
})

// DELETE book from Want to Read

router.post('/api/remove-want-book/:bookId', (req, res, next) => {
    User.findById(req.session.passport.user)
        .then(user => {
            let index = user.wantToRead.indexOf(req.params.bookId.toString())
            user.wantToRead.splice(index, 1)
                user.save()
                    .then(updatedUser => {
                        res.json({
                            userWithRemovedWantToRead: updatedUser
                        })
                    })
                    .catch(err => console.log(`Error deleting book from user's Want to Read: ${err}`))
        })
        .catch(err => console.log(`Error finding user in database: ${err}`))
})

// DELETE book from Has Read

router.post('/api/remove-has-book/:bookId', (req, res, next) => {
    User.findById(req.session.passport.user)
    .then(user => {
        let index = user.hasRead.indexOf(req.params.bookId.toString())
        user.hasRead.splice(index, 1)
            user.save()
                .then(updatedUser => {
                    res.json({
                        userWithRemovedHasRead: updatedUser
                    })
                })
                .catch(err => console.log(`Error deleting book from user's Has Read: ${err}`))
    })
    .catch(err => console.log(`Error finding user in database: ${err}`))
})


module.exports = router;
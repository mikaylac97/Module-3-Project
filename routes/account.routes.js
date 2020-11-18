const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');
const fileUploader = require('../configs/cloudinary.config');


// GET account details page

router.get('/api/account/:accountId', (req, res, next) => {
    // console.log(req.session.passport, req.user)
    User.findById(req.params.accountId)
        .populate('reviews')
        .populate('hasRead')
        .populate('wantToRead')
        .populate({ 
            path: 'discussions',
            populate: {
              path: 'book',
              model: 'Book'
            } 
         })
         .populate('followers')
         .populate('following')
        .then(user => {
            // const authorized = req.session.passport.user.toString() === user._id.toString()
            res.json({
                user,
                // authorized
            })
        })
        .catch(err => console.log(`Error finding user in database ${err}`))
})

// POST route to edit account details

router.post('/api/account/edit', fileUploader.single('image'), (req, res, next) => {
    
    // const { username, email, password } = req.

    console.log(req.body)

    const { firstname, lastname, username, email, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            const editedUser = {
                username,
                email, 
                passwordHash: hashedPassword,
                // firstName,
                // lastName,
                // bio
            }
            if(req.file) {
                editedUser.photo = req.file.path
            } else {
                return User.findByIdAndUpdate(req.user._id, editedUser)
            }
        })
        .then(userFromDB => {
            console.log(`Edited user is: ${userFromDB}`)
        })
        .catch(err => {
            if(err instanceof mongoose.Error.ValidationError){
                res.status(500).json({
                    errorMessage: err.message
                })
            } else if (err.code === 11000) {
                res.status(500).json({
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                })
            } else {
                next(err)
            }
        })


})

// POST route to delete account

router.post('/api/delete-account', (req, res, next) => {
    User.find()
        .then(usersInDB => {
            usersInDB.forEach(user => {
                let indexToDelete = user.followers.indexOf(req.session.passport.user.toString())
                user.followers.splice(indexToDelete,1)
                user.save()
                    .then(updatedUsers => {
                        console.log(`Updated followers list: ${updatedUsers.followers}`)
                    })
                    .catch(err => console.log(`Error saving the updated user: ${err}`))
            })
            User.findByIdAndDelete(req.session.passport.user)
                .then(deletedUser => {
                    console.log(`Deleted user: ${deletedUser}`)
                    req.session.destroy();
                })
                .catch(err => console.log(`Error deleting user: ${err}`))
        })
        .catch(err => console.log(`Error deleting the user from the other users followers array: ${err}`))
})

module.exports = router;
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/User.model');
const routeGuard = require('../configs/route-guard.config');
const fileUploader = require('../configs/cloudinary.config');


// GET account details page

router.get('/account/:accountId', (req, res, next) => {
    User.findById(req.params.accountId)
        .then(user => {
            const authorized = req.session.passport.user.toString() === user._id.toString()
            res.json({
                user,
                authorized
            })
        })
        .catch(err => console.log(`Error finding user in database ${err}`))
})

// POST route to edit account details

router.post('/account/edit', fileUploader.single('image'), (req, res, next) => {
    
    const { firstname, lastname, username, email, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            const editedUser = {
                username,
                email, 
                passwordHash: hashedPassword,
                firstName,
                lastName
            }
        })
})
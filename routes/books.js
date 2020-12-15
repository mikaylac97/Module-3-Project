const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book.model');
const Discussion = require('../models/Discussion.model');
const Reviews = require('../models/Review.model');
const Reply = require('../models/Reply.model');
const User = require('../models/User.model');
const apiKey = process.env.GB_API_KEY;




// GET all books

router.get('/api/books', (req, res, next) => {
    axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=%27%27`)
        .then(booksFromApi => res.json(booksFromApi.data.items))
        .catch(err => console.log(`Error retrieving all books: ${err}`))
})


// GET Book details page

router.get('/api/details/:bookId', (req, res, next) => {


    Book.findOne({ google_books_id: req.params.bookId })
    .populate('discussions')
    .populate('reviews')
    .then(bookFromDB => {
        if(!bookFromDB) {
            axios
                .get(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`)
                .then(bookFromAPI => {
                    Book.create({
                        google_books_id: bookFromAPI.data.id,
                        title: bookFromAPI.data.volumeInfo.title,
                        subtitle: bookFromAPI.data.volumeInfo.subtitle,
                        authors: bookFromAPI.data.volumeInfo.authors,
                        description: bookFromAPI.data.volumeInfo.description,
                        pageCount: bookFromAPI.data.volumeInfo.pageCount,
                        image_url: bookFromAPI.data.volumeInfo.imageLinks.thumbnail,
                        publishedDate: bookFromAPI.data.publishedDate,
                        publisher: bookFromAPI.data.publisher,
                        language: bookFromAPI.data.volumeInfo.language,
                        genres: bookFromAPI.data.volumeInfo.categories,
                        // reviews: bookReviews,
                        // discussions: bookDiscussions
                    })
                    .then(newBook => {
                        res.json(newBook)
                        return;
                    })
                    .catch(err => console.log(`Error finding newly created book: ${err}`))
                })
                // .then(newBookInDB => console.log(`Created new book in DB: ${newBookInDB}`))
                .catch(err => console.log(`Error creating new book in database from API: ${err}`))
        } else {    
            res.json(bookFromDB)
            return;
        }
    })
    .catch(err => console.log(`Error finding book in DB`))

    

})

module.exports = router;
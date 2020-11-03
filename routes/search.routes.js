require('dotenv').config()

const express = require('express');
const router = express.Router();
const axios = require('axios');

const baseURL = `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process.env.GB_API_KEY}`

router.get('/api/book-search', (req, res, next) => {
    axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.q}&key=${process.env.GB_API_KEY}`)
        .then(data => res.json({ searchResults : data.body }))
        .catch(err => console.log(err))
})





module.exports = router;
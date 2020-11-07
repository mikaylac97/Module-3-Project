require('dotenv').config()

const express = require('express');
const router = express.Router();
const axios = require('axios');



// POST the search results

router.post('/api/book-search', (req, res, next) => {
    console.log(req.query)
    axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.q}&key=${process.env.GB_API_KEY}`)
        .then(searchResults => {
            res.json({
                searchOutput: searchResults.data.items
            })
        })
        .catch(err => console.log(err))
})





module.exports = router;
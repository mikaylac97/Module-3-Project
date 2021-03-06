require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const createError = require('http-errors');
const cors = require('cors');

const app = express();

// Middleware Setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// require database configuration
require('./configs/db.config');


require('./configs/session.config')(app);

require('./configs/passport/passport.config.js')(app);

// require CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://modest-davinci-9f8ec6.netlify.app'],
    // allowedHeaders: '*',
    credentials: true,
    // 'Access-Control-Allow-Origin': '*'
  })
);

// routes middleware
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/authentication.routes'));
app.use('/', require('./routes/account.routes'));
app.use('/', require('./routes/reply.routes'));
app.use('/', require('./routes/follow.routes'));
app.use('/', require('./routes/books'));
app.use('/', require('./routes/search.routes'));
app.use('/', require('./routes/review.routes'));
app.use('/', require('./routes/bookshelf.routes'));
app.use('/', require('./routes/timeline.routes'));
app.use('/api', require('./routes/discussion.routes'));

// Catch missing routes and forward to error handler

// Catch all error handler
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({ type: 'error', error: { message: error.message } });
// });

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;

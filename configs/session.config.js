
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 24 * 15 * 1000, // 15 days - by default, no maximum age is set.
        sameSite: 'lax' // https://www.npmjs.com/package/express-session#cookiesamesite
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 1 day
      })
    })
  );
};

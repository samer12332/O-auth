const express = require('express');
const app = express();
const authRouter = require('./routes/auth-routes');
const profileRouter = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
//const cookieSession = require('cookie-session');
const session = require('express-session');
const passport = require('passport');

// Setting the view engine to ejs
app.set('view engine', 'ejs');



// Setting up cookie-session
app.use(session({ 
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours 
}));

// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     keys: [keys.session.cookieKey]
// }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connecting to MongoDB
mongoose.connect(keys.mongodb.dbURI)
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('App listening on port 3000');
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Setting up routes
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

// Home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

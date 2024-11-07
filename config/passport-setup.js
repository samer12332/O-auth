const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        const currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
            done(null, currentUser);
        } else {
            const newUser = new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.picture
            });
            await newUser.save();
            console.log('new user created:', newUser);
            done(null, newUser);
        }
    } catch (error) {
        console.error('Error during Google authentication:', error);
        done(error, null);
    }
}));

const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout((err) =>
        {
            if (err) {
                return res.send(err); 
            } 
            res.redirect('/'); 
        });
    });

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//callback route from google to redirect to
router.get('/google/redirect', passport.authenticate('google'),
(req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});


module.exports = router;
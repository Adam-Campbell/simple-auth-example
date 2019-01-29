const express = require('express');

const router = express.Router();
const passport = require('passport');

// route to display the signIn page
router.get('/', (req, res, next) => {
    res.render('signIn');
});

// route to submit the signIn form for local authentication
router.post('/',
    passport.authenticate('local', { failureRedirect: '/signin' }),
    (req, res, next) => {
        res.redirect('/');
    }
);

module.exports = router;

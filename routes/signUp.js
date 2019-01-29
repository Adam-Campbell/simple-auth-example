const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/userModel');

// route to render the signUp page
router.get('/', (req, res, next) => {
    res.render('signUp');
});

// route to submit the signUp form for standard username and password signup
router.post('/', async (req, res, next) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).send('You need to supply a username, email address and password.');
    }
    try {
        const newUser = await User.create({
            username,
            password,
            email
        });
        
        next();
    } catch (err) {
        next(err);
    }
}, 
passport.authenticate('local', { failureRedirect: '/signin' }),
(req, res, next) => {
    res.redirect('/');
});

module.exports = router;
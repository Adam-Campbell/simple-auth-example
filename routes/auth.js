const express = require('express');
const router = express.Router();
const passport = require('passport');

// route to begin Facebook authentication.
router.get('/facebook', passport.authenticate('facebook'));

// route that Facebook authentication sends the user back to upon success.
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect('/');
  }
);

// route to begin Google authentication.
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// route that Google authentication sends the user back to upon success.
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;

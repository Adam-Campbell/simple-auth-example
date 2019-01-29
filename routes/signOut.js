const express = require('express');
const router = express.Router();

// route to sign out, by destroying the current session.
router.post('/', (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Will only render if a user is logged in, else will send 401
router.get('/', (req, res, next) => {
    if (!req.user) {
        return res.status(401).send();
    }
    res.render('protected', { currentUser: req.user });
});

module.exports = router;
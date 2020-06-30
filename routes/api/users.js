const { Router } = require('express');
const passport = require('passport');

const User = require('./../../models/User');


const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

router.post('/register', (req, res) => {
    const { email, password, password2 } = req.body;
    User
        .createUser(email, password, password2)
        .then(user => user.save())
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User
        .validateLogin(email, password)
        .then(token => res.json(token))
        .catch(err => res.status(400).json(err));
})

module.exports = router;
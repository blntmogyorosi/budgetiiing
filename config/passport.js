const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./../models/User');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
};

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (payload, done) => {
        User
            .findById(payload.id)
            .then(user => done(null, user || false))
            .catch(err => done(err));
    }));
}
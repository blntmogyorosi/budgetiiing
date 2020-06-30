const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postgres = require('./../config/postgres');


class User {

    /**
     * @description The password must be hashed, otherwise leave it empty
     * @param {Integer} id
     * @param {String} email 
     * @param {String} hashedPassword 
     */
    constructor(id, email, hashedPassword) {
        this.id = id;
        this.email = email;
        this.password = hashedPassword;
    }

    /**
     * @description Hash the password and set it on the User
     * @param {String} password
     * @returns {User}
     */
    setPassword(password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        this.password = hash;
        return this;
    }

    /**
     * @description Persist current User to database
     * @returns {Promise<User>} Promise
     */
    save() {
        return postgres
            .query(
                'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
                [this.email, this.password]
            )
            .then(res => res.rows[0]);
    }

    /**
     * @description Validates the new user with the given parameters and creates a new user object if they are valid
     * @param {String} email 
     * @param {String} password 
     * @param {String} password2 
     * @returns {Promise<User>}
     */
    static createUser(email, password, password2) {
        return postgres
            .query(
                'SELECT email FROM users WHERE email = $1',
                [email]
            )
            .then(res => {
                const errors = {};

                // Email Validation - Exists & Uniqueness & Validity
                if (!email || email.trim() === "") errors.email = "The email is required!";
                if (res.rows.length > 0) errors.email = "This email is already in use! Please provide another one!";

                // Password Validation - Exists & Difficulty & Match
                if (!password || password.trim() === "") errors.password = "The password is required!";
                if (password2 !== password) errors.password2 = 'The two password must match!';

                if (Object.keys(errors).length > 0) throw errors;

                return new User(undefined, email).setPassword(password);
            });
    }

    /**
     * @description Validates login
     * @param {String} email 
     * @param {String} password 
     * @returns {String} jsonwebtoken
     */
    static validateLogin(email, password) {
        return User
            .findByEmail(email)
            .then(user => {
                if (!user || !bcrypt.compareSync(password || '', user.password || ''))
                    throw { message: 'Invalid credentials! Please enter them again!' };

                return 'Bearer ' + jwt.sign(
                    { id: user.id, email: user.email, registered: user.registered },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: 3600 }
                );
            });
    }

    static findAll() {
        return postgres
            .query('SELECT id, username, email, registered FROM users', [])
            .then(res => res.rows);
    }

    static findById(id) {
        return postgres
            .query(
                'SELECT id, email, registered FROM users WHERE id = $1',
                [id]
            )
            .then(res => res.rows[0]);
    }

    static findByEmail(email) {
        return postgres
            .query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            )
            .then(res => res.rows[0]);
    }

}

module.exports = User;
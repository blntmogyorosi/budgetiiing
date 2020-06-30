// Load config files
require('./config/config');

// Load npm packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

// Load custom routes
const usersRoutes = require('./routes/api/users');


// Initialize app
const app = express();
// Use npm middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// Initialize passport and use middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Use loaded custom routes
app.use('/api/users', usersRoutes);

// Start app
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
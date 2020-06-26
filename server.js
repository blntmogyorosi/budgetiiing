// Load config files
require('./config/config');

// Load npm packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Initialize app
const app = express();
// Use npm middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Start app
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
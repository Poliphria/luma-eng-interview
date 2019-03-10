const express = require('express');
const app = express();
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = 3000;
const { dbConnect } = require('./helpers/db');

app.disable('x-powered-by');

dbConnect();

/**
 * Middleware used for parsing request body and for logging
 */
app.use(logger('dev'));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.json({msg: "hello world"});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


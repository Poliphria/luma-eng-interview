const express = require('express');
const app = express();
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = 3000;
const { dbConnect } = require('./api/helpers/db');

const doctorRoutes = require('./api/routes/doctors')

app.disable('x-powered-by');

dbConnect();

/**
 * Middleware used for parsing request body and for logging
 */
app.use(logger('dev'));
app.use(bodyParser.json()); 

app.use('/doctors', doctorRoutes)

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({error: err});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


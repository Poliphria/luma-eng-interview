const express = require('express');
const app = express();
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = 3000;
const { dbConnect } = require('./api/helpers/db');


// require routes
const doctorRoutes = require('./api/routes/doctors');
const patientRoutes = require('./api/routes/patients');
const appointmentRoutes = require('./api/routes/appointments');

app.disable('x-powered-by');

// Connect to the cloud database
dbConnect();

// Middleware used for parsing request body and for logging
app.use(bodyParser.json()); 

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(logger('combined'));
}

// routes
app.use('/doctors', doctorRoutes)
app.use('/patients', patientRoutes)
app.use('/appointments', appointmentRoutes)

// error handler
app.use((err, req, res, next) => {
    //console.log(err.stack);
    res.send(err);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = app;


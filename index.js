const express = require('express');
const app = express();
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const port = 3000;

app.disable('x-powered-by');

/**
 * Connect to the MongoDB db called luma-health
 */
mongoose.connect("mongodb://localhost/luma-health", { useNewUrlParser: true })
    .then(() => { console.log('Connection to MongoDB successful.')} )
    .catch((err) => { console.error(err) });


app.use(logger('dev'));
app.use(bodyParser('json'));

if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
}

app.get('/', (req, res) => {
    res.json({msg: "hello world"});
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


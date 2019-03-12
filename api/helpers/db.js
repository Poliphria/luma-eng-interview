require('dotenv').config();
const mongoose = require('mongoose');
/**
 * Connect to the MongoDB db called luma-health
 * .env file is usually git ignored but for the case of this coding challenge
 * it will be in the pull request for testing purposes. 
 */
module.exports.dbConnect = () => {
    let uri = process.env.MATLAS_URI;
    mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => { console.log('Connection to MongoDB successful.')} )
        .catch((err) => { console.error(err) });
}
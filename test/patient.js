//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config();
let mongoose = require('mongoose');
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

before((done) => {
    mockgoose.prepareStorage()
        .then(() => {
            let uri = process.env.MATLAS_URI;
            mongoose.connect(uri, {useNewUrlParser: true}, (err) => {
                done(err);
            });
            mockgoose.helper.reset()
        })
        .then(() => {
            console.log('Resetted the db');
        })
});

describe('Patients', () => {
    /**
    * Test the GET route
    */
    describe('GET /patients', () => {
        it('it should GET all the patients', (done) => {
            chai.request(server)
                .get('/patients')
                .end((err, res) => {
                    if (err) console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                })
                done();
        })
    })
})


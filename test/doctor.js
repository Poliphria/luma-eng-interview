//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config();
let mongoose = require('mongoose');
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
let Doctor = require('../api/models/DoctorModel');

// require dev dependencies and server
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

// Connect to the mock database
before((done) => {
    mockgoose.prepareStorage()
        .then(() => {
            let uri = process.env.MATLAS_URI;
            mongoose.connect(uri, { useNewUrlParser: true }, (err) => {
                if (err) return console.error(err);
                done();
            });
        })

});

// Tests for doctor functions
describe('Doctors', () => {
    beforeEach((done) => {
        mockgoose.helper.reset()
            .then(() => {
                done();
            })
    })

    /**
     * Test the POST route
     */
    describe('POST /doctors', () => {
        it('it should POST a doctor', (done) => {
            let newDoctor = {
                firstName: "Doctor",
                lastName: "Doctor",
                phoneNumber: "988",
                workingHoursByDay: [{
                    day: "Monday",
                    hours: {
                        startTime: "9:00",
                        endTime: "17:00"
                    }
                },
                {
                    day: "Wednesday",
                    hours: {
                        startTime: "9:00",
                        endTime: "17:00"
                    }
                },
                {
                    day: "Friday",
                    hours: {
                        startTime: "9:00",
                        endTime: "17:00"
                    }
                }]
            };
            chai.request(server)
                .post('/doctors')
                .send(newDoctor)
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('phoneNumber');
                    res.body.should.have.property('workingHoursByDay');
                })
            done();

        })
    })
})
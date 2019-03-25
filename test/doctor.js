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
let chaid = require('chaid');

chai.use(chaiHttp);
chai.use(chaid);

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
            });
    });

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

        });
        it('it should not POST a doctor without a last name', (done) => {
            let newDoctor = {
                firstName: "Daniel",
                phoneNumber: "45543",
            }
            chai.request(server)
                .post('/doctors')
                .send(newDoctor)
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('lastName');
                    res.body.errors.lastName.should.have.property('kind').eql('required');
                })
            done();
        });
    });

    /**
     * Test the GET route for list of all doctors
     */
    describe('GET /doctors', () => {
        it('it should GET all the doctors', (done) => {
            chai.request(server)
                .get('/doctors')
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                });
            done();
        });
    });

    /**
     * Test GET route for doctor with the provided id
     */
    describe('GET /doctors/:id', () => {
        it('it should GET a doctor by the given id', (done) => {
            let doctor = new Doctor({
                firstName: "christian",
                lastName: "moronta",
                phoneNumber: "909090"
            })
            doctor._id = new mongoose.Types.ObjectId();
            doctor.save((err, doctor) => {
                if (err) return console.error(err);
                chai.request(server)
                    .get('/doctors/' + doctor._id)
                    .end((err, res) => {
                        if (err) return console.error(err);
                        res.should.have.status(200);
                        res.body.should.have.property('firstName');
                        res.body.should.have.property('lastName');
                        res.body.should.have.property('phoneNumber');
                        res.body.should.have.property('_id');
                        res.body.should.have.id(doctor._id);
                    });
                done();
            })
        });
        it('it should not GET a doctor with a non existent resource id', (done) => {
            let id = '424324fdsf';
            chai.request(server)
                .get('/doctors/' + id)
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(404);
                    res.body.should.have.property('name').eql("CastError");
                })
            done();
        });
    });

    /**
     * Test PUT route for doctor with the provided id
     */
    describe('PUT /patients/:id', () => {
        it('it should update a doctor by the given id', (done) => {
            // create doctor to update
            let doctor = new Doctor({firstName: 'test', lastName: 'doctor', phoneNumber: '454545'});
            doctor._id = new mongoose.Types.ObjectId();
            doctor.save((err, doctor) => {
                if (err) return console.error(err);
                chai.request(server)
                .put('/doctors/' + doctor._id)
                .send({firstName: 'update test'})
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg');
                    res.body.should.have.property('response');
                    res.body.response.should.be.a('object');
                });
                done();
            });
        });
    });

    /**
     * Test the DELETE '/doctors/:id' route
     */
    describe('DELETE /doctors/:id', () => {
        it('it should delete a doctor by the given id', (done) => {
            let newDoctor = new Doctor({
                firstName: "Donnie",
                lastName: "Darko",
                phoneNumber: "34343"
            })

            newDoctor._id = new mongoose.Types.ObjectId();
            newDoctor.save((err, res) => {
                if (err) return console.error(err);
                chai.request(server)
                    .delete('/doctors/' + newDoctor._id)
                    .end((err, res) => {
                        if (err) console.error(err);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').eql('doctor and associated appointments have been deleted');
                    });
                done();
            });
        });

        it('it should not delete a patient because id does not exist', (done) => {
            chai.request(server)
                .delete('/doctors/e321325feds')
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(404);
                    res.body.should.have.property('name').eql("CastError");
                })
                done();
        })
    });
});
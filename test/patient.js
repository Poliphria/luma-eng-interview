//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config();
let mongoose = require('mongoose');
let Mockgoose = require('mockgoose').Mockgoose;
let mockgoose = new Mockgoose(mongoose);
let Patient = require('../api/models/PatientModel');

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

// Tests for patient functions
describe('Patients', () => {
    // Reset the db before every test
    beforeEach((done) => {
        mockgoose.helper.reset()
            .then(() => {
                done();
            })
    })

    /**
     * Test the POST route
     */
    describe('POST /patients', () => {
        it('it should not POST a patient without ssn field', (done) => {
            let newPatient = {
                firstName: "Christian",
                lastName: "Moronta",
                phoneNumber: "6784691088"
            };
            chai.request(server)
                .post('/patients')
                .send(newPatient)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('ssn');
                    res.body.errors.ssn.should.have.property('kind').eql('required');
                });
            done();
        });

        it('it should POST a patient', (done) => {
            let newPatient = {
                firstName: "Christian",
                lastName: "Moronta",
                ssn: "323231",
                phoneNumber: "6784691088"
            }
            chai.request(server)
                .post('/patients')
                .send(newPatient)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('new patient created');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('ssn');
                    res.body.should.have.property('phoneNumber');
                })
            done();
        });

        it('it should not POST a patient with same ssn', (done) => {
            let newPatient = {
                firstName: "Christian",
                lastName: "Moronta",
                ssn: "323231",
                phoneNumber: "6784691088"
            }
            chai.request(server)
                .post('/patients')
                .send(newPatient)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql('User already exists');
                });
            done();
        })
    });

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

    /**
     * Test the GET /patients/:id route
     */
    describe('GET /patients/:id', () => {
        it('it should GET a patient by the given Id', (done) => {
            let patient = new Patient({ firstName: "Test", lastName: "Patient", ssn: "4578", phoneNumber: "6784669088" });
            patient._id = new mongoose.Types.ObjectId();
            patient.save((err, patient) => {
                if (err) return console.error(err);
                chai.request(server)
                    .get('/patients/' + patient._id)
                    .send(patient)
                    .end((err, res) => {
                        if (err) console.error(err);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('firstName');
                        res.body.should.have.property('lastName');
                        res.body.should.have.property('ssn');
                        res.body.should.have.property('phoneNumber');
                        res.body.should.have.property('_id')
                    });
                done();
            });
        });
    });

    /**
     * Test the PUT '/patients/:id' route
     */
    describe('PUT /patients/:id', () => {
        it('it should update a patient by the given id', (done) => {
            // create patient to update 
            let patient = new Patient({ firstName: "Tyler", lastName: "Steincamp", ssn: "789456", phoneNumber: "6784691088" });
            patient._id = new mongoose.Types.ObjectId();
            patient.save((err, patient) => {
                if (err) return console.error(err);
                chai.request(server)
                    .put('/patients/' + patient._id)
                    .send({ firstName: "George" }) // send a property to be changed
                    .end((err, res) => {
                        if (err) return console.error(err);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg');
                        res.body.should.have.property('response');
                        res.body.should.be.a('object');
                    });
                done();
            });
        });
    });

    /**
     * Test the DELETE '/patients/:id' route
     */
    describe('DELETE /patients/:id', () => {
        it('it should delete a patient by the given id', (done) => {
            let newPatient = new Patient({
                firstName: "Donnie",
                lastName: "Darko",
                ssn: "67856",
                phoneNumber: "34343"
            })

            newPatient._id = new mongoose.Types.ObjectId();
            newPatient.save((err, res) => {
                if (err) return console.error(err);
                chai.request(server)
                    .delete('/patients/' + newPatient._id)
                    .end((err, res) => {
                        if (err) console.error(err);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').eql('patient and associated appointments have been deleted');
                    });
                done();
            });
        });

        it('it should not delete a patient because id does not exist', (done) => {
            chai.request(server)
                .delete('/patients/e321325feds')
                .end((err, res) => {
                    if (err) return console.error(err);
                    res.should.have.status(404);
                    res.body.should.have.property('name').eql("CastError");
                })
                done();
        })
    });
})


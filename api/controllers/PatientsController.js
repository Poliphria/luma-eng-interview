const Patient = require('../models/PatientModel');
const Appointment = require('../models/AppointmentsModel');
const mongoose = require('mongoose');

// Creates a new user
module.exports.createPatient = (req, res, next) => {
    const newPatient = new Patient(req.body);
    newPatient._id = new mongoose.Types.ObjectId();

    Patient.find({ ssn: newPatient.ssn }).exec()
    .then(response => {
        if (response.length > 0) return res.status(200).json({msg: 'User already exists'})
        newPatient.save((err, doc) => {
            if (err) {
                //console.error(err);
                next(err);
            } else {
                // console.log('New patient created:\n', doc);
                res.send({msg: 'new patient created', ...doc._doc });
            }
        })
    })
}

// Returns all the users from the database
module.exports.getPatients = (req, res, next) => {
    Patient.find({}).exec()
    .then(doc => {
        res.json(doc);
    })
    .catch(err => next(err))
}

// Returns one user by its unique id
module.exports.findPatientById = (req, res, next) => {
    Patient.findById(req.params.id).exec()
    .then(doc => {
        res.json(doc);
    })
    .catch(err => next(err));
};

// Removes a user from the database and removes that user's appointments
module.exports.removePatient = (req, res, next) => {
    const patientID = req.params.id;
    
    // remove all appointments where this patient shows up 
    Appointment.deleteMany({ patient: patientID }).exec()
    .then(response => {
        console.log(response);
    })
    .catch(err => next(err));

    // remove all instances of patient in db
    Patient.findByIdAndDelete(patientID).exec()
    .then(response => {
        console.log(response);
        return res.status(204).json({msg: "patient and associated appointments have been deleted"});
    })
    .catch(err => next(err));
};

// Updates user info in db
module.exports.updatePatient = (req, res, next) => {
    Patient.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {runValidators: true, new: true, useFindAndModify: false}).exec()
    .then(response => {
      //  console.log('Patient updated', response);
        res.send({msg: 'Patient successfully update', response});
    })
    .catch(err => next(err));
};
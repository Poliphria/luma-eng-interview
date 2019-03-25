const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentsModel')
const mongoose = require('mongoose');

module.exports.createDoctor = (req, res, next) => {
        const newDoctor = new Doctor(req.body);
        newDoctor._id = new mongoose.Types.ObjectId();

        // make call to db to add doctor
        newDoctor.save((err, doc) => {
                if (err) {
                        // return console.error(err);
                        next(err);
                } 
                // console.log("New doctor saved", doc);
                res.json(doc);
        })
}

module.exports.getAllDoctors = (req, res, next) => {
        Doctor.find({}, (err, docs) => {
                if (err) {
                        console.error(err);
                        next(err);
                }
                res.json(docs);
        })
}

module.exports.findDoctorById = (req, res, next) => {
        Doctor.findById(req.params.id)
        .then(doc => {
                if (!doc) return res.status(404).end();
                res.status(200).json(doc);
        })
        .catch(err => next(err));
}


module.exports.deleteDoctor = (req, res, next) => {
        const doctorId = req.params.id;

        Appointment.deleteMany({ _id: doctorId })
        .then((err) => {
                if (err) return console.error(err);
                console.log('Appointments deleted');
        })
        .catch(err => next(err));

        Doctor.findOneAndDelete({_id: doctorId})
                .then(result => {
                        res.status(200).json(result);
                })
                .catch(err => next(err));
}

module.exports.updateDoctor = (req, res, next) => {
        Doctor.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {runValidators: true, new: true, useFindAndModify: false}).exec()
        .then(response => {
                res.send({msg: 'Doctor successfully updated', response});  
        })
        .catch(err => next(err));
}


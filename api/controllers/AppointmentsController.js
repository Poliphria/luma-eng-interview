const Appointment = require('../models/AppointmentsModel');
const mongoose = require('mongoose')

module.exports.createAppointment = (req, res, next) => {
    const reqBody = req.body;
    // check in db if any appointments have been made already by the slot 
    Appointment.find({ slotTime: reqBody.slotTime, slotDate: req.body.slotDate }).exec()
        .then(response => {
            // if the response isn't 0 then that slot has already been taken
            if (response.length > 0) return res.status(200).json({ msg: 'The slot for this appointment day has already been taken' });

            let newAppointment = new Appointment(req.body);
            newAppointment._id = new mongoose.Types.ObjectId()

            newAppointment.save((err, result) => {
                if (err) {
                    console.error(err);
                    next(err);
                }

                console.log("New appointment created \n", result);
                res.status(200).send(result);
            });
        })
        .catch(err => next(err));
};

module.exports.getAppointments = (req, res, next) => {
    Appointment.find({})
        .populate("doctor")
        .populate("patient")
        .exec()
        .then(docs => {
            if (docs.length === 0) return res.json({ msg: 'No appointments found' })
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => next(err));
};

module.exports.findAppointmentById = (req, res, next) => {
    Appointment.findById(req.params.id).exec()
        .then(doc => {
            if (!doc) return res.json({ msg: "Appointment does not exist" })
            console.log(doc);
            res.json(doc);
        })
        .catch(err => next(err));
};


module.exports.deleteAppointment = (req, res, next) => {
    Appointment.findOneAndDelete({ _id: req.params.id }).exec()
        .then(result => {
            console.log("Appointment deleted\n", result);
            return res.status(200).json({ msg: "Appointment deleted" });
        })
        .catch(err => next(err));
};

module.exports.updateAppointment = (req, res, next) => {
    // in the case that the user is updating appointment time, need to check if slot has been taken
    const reqBody = req.body;
    const keys = Object.keys(req.body);

    if (keys.includes('slotTime') && keys.includes('slotDate')) {
        Appointment.find({ slotTime: reqBody.slotTime, slotDate: reqBody.slotDate }).exec()
            .then(docs => {
                if (docs.length > 0) return res.json({ msg: "Appointment is already taken" });
                return Appointment.update({ _id: req.params.id }, req.body, { runValidators: true, new: true }).exec()
            })
            .then(result => {
                console.log("Appointment has been updated \n", result);
                res.json({ msg: "Appointment has been updated." });
            })
            .catch(err => next(err));
    }
}


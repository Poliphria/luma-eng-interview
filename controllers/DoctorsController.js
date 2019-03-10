const Doctor = require('../models/DoctorModel');
const mongoose = require('mongoose');

module.exports.createDoctor = (req, res) => {
        const newDoctor = new Doctor(req.body);
        newDoctor._id = new mongoose.Types.ObjectId();

        // make call to db to add doctor
        
}
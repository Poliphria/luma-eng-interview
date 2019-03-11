const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/DoctorsController');

// DOCTOR ROUTES
// main route: '.../doctors/'

// GET request for list of all Doctors
router.get('/', doctorController.getAllDoctors);

// POST request for creating Doctor
router.post('/', doctorController.createDoctor);

// GET request for one Doctor
router.get('/:id', doctorController.findDoctorById);

// POST request to delete a Doctor
router.post('/:id/delete', doctorController.deleteDoctor);

// PUT request to update a Doctor
router.put('/:id/update', doctorController.updateDoctor);

module.exports = router;

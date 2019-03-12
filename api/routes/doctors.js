const express = require('express');
const router = express.Router();

//require controller modules
const doctorController = require('../controllers/DoctorsController');

// DOCTOR ROUTES // 

// GET list of all doctors
router.get('/', doctorController.getAllDoctors);

// GET one doctor by id
router.get('/:id', doctorController.findDoctorById);

// POST request for creating a Doctor
router.post('/create', doctorController.createDoctor);

// POST request for deleting a Doctor
router.post('/:id/delete', doctorController.deleteDoctor);

// PUT request for updating a Doctor
router.put('/:id/update', doctorController.updateDoctor);

module.exports = router;
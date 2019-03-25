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
router.post('/', doctorController.createDoctor);

// DELETE request for deleting a Doctor
router.delete('/:id', doctorController.deleteDoctor);

// PUT request for updating a Doctor
router.put('/:id', doctorController.updateDoctor);

module.exports = router;
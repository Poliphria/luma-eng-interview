const express = require('express');
const router = express.Router();

const patientController = require('../controllers/PatientsController');

// GET request for list of all patients
router.get('/', patientController.getPatients);

// POST requst to create a new patient
router.post('/', patientController.createPatient);

//PUT request to update a patient's information
router.put('/:id/update', patientController.updatePatient);

// POST request to remove a patient
router.post('/:id/delete', patientController.removePatient);

// GET request to get one patient
router.get('/:id', patientController.findPatientById);

module.exports = router;
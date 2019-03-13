const express = require('express');
const router = express.Router();

// controller
const appointmentsController = require('../controllers/AppointmentsController');

// GET request for list of all appointments
router.get('/', appointmentsController.getAppointments);

// POST request to create a new appointment
router.post('/', appointmentsController.createAppointment);

// GET request for a specific appointment
router.get('/:id', appointmentsController.findAppointmentById);

// POST request to delete an appointment
router.post('/:id/delete', appointmentsController.deleteAppointment);

// PUT reqeust to update an appointment
router.put('/:id/update', appointmentsController.updateAppointment);

module.exports = router; 

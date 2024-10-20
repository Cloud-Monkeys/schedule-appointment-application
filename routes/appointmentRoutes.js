const express = require('express');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getAppointmentsByUserId, deleteAppointmentsByUserId, getAppointmentsByScheduleId } = require('../controllers/appointmentController');
const router = express.Router();

// Define routes for Appointment resource
router.get('', getAppointments);
router.get('/:id', getAppointmentById);
router.post('', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/users/:userId', getAppointmentsByUserId);
router.delete('/users/:userId', deleteAppointmentsByUserId);
router.get('/schedules/:scheduleId', getAppointmentsByScheduleId);

module.exports = router;
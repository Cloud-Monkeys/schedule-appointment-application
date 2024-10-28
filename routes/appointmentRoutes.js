const express = require('express');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getAppointmentsByUserId, deleteAppointmentsByUserId, getAppointmentsByScheduleId } = require('../controllers/appointmentController');
const router = express.Router();

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Get all appointments with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *         default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *         default: startTime
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Sort order (ASC or DESC)
 *         default: DESC
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('', getAppointments);
router.get('/:id', getAppointmentById);
router.post('', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/users/:userId', getAppointmentsByUserId);
router.delete('/users/:userId', deleteAppointmentsByUserId);
router.get('/schedules/:scheduleId', getAppointmentsByScheduleId);

module.exports = router;
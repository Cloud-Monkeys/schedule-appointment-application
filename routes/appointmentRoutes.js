const express = require('express');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getAppointmentsByUserId, deleteAppointmentsByUserId, getAppointmentsByScheduleId } = require('../controllers/appointmentController');
const router = express.Router();

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: Get all appointments with pagination
 *     description: Retrieves a paginated list of appointments. Supports filtering by date range and sorting.
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [startTime, endTime, userId]
 *           default: startTime
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter appointments after this date (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter appointments before this date (ISO 8601 format)
 *     responses:
 *       200:
 *         description: Successfully retrieved appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 _links:
 *                   $ref: '#/components/schemas/Links'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new appointment
 *     description: Creates a new appointment with the provided details
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user making the appointment
 *               scheduleId:
 *                 type: integer
 *                 description: ID of the schedule slot
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the appointment
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the appointment
 *               description:
 *                 type: string
 *                 description: Purpose of the appointment
 *             required:
 *               - userId
 *               - scheduleId
 *               - startTime
 *               - endTime
 *               - description
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL of the newly created appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict with existing appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
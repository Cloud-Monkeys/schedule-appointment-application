const express = require('express');
const { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment, getAppointmentsByScheduleId } = require('../controllers/appointmentController');
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
 *
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     description: Retrieves a specific appointment by its ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Successfully retrieved appointment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update an appointment
 *     description: Updates an existing appointment with the provided details
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       200:
 *         description: Appointment updated successfully
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
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete an appointment
 *     description: Deletes an appointment by its ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Appointment deleted"
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /appointments/schedules/{scheduleId}:
 *   get:
 *     summary: Get appointments by schedule ID
 *     description: Retrieves all appointments for a specific schedule
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Successfully retrieved appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: No appointments found for this schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * @swagger
 * /appointments/{id}/async:
 *   put:
 *     summary: Asynchronously update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               userId:
 *                 type: string
 *               scheduleId:
 *                 type: string
 *     responses:
 *       202:
 *         description: Update request accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update request accepted
 *                 statusUrl:
 *                   type: string
 *                   example: /operations/123e4567-e89b-12d3-a456-426614174000
 *                 operationId:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *       404:
 *         description: Appointment not found
 *       400:
 *         description: Invalid input
 *
 * /operations/{operationId}:
 *   get:
 *     summary: Get the status of an async operation
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Operation ID
 *     responses:
 *       200:
 *         description: Operation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [completed, processing, failed]
 *                 resourceType:
 *                   type: string
 *                   example: appointment
 *                 resourceId:
 *                   type: string
 *                 operation:
 *                   type: string
 *                   example: update
 *                 result:
 *                   type: object
 *                   description: The updated resource (when status is completed)
 *                 error:
 *                   type: string
 *                   description: Error message (when status is failed)
 *       202:
 *         description: Operation still processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: processing
 *       404:
 *         description: Operation not found
 */
router.get('', getAppointments);
router.post('', createAppointment);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/schedules/:scheduleId', getAppointmentsByScheduleId);

module.exports = router;
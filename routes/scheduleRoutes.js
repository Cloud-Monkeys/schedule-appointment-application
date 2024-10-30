const express = require('express');
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule, getSchedulesByUserId, deleteSchedulesByUserId, getSchedulesBySectionId, updateScheduleAsync, getOperationStatus } = require('../controllers/scheduleController');
const router = express.Router();

/**
 * @openapi
 * /schedules:
 *   get:
 *     summary: Get all schedules with pagination
 *     description: Retrieves a paginated list of schedules
 *     tags: [Schedules]
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
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 _links:
 *                   type: object
 *   post:
 *     summary: Create a new schedule
 *     description: Creates a new schedule with the provided details
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user creating the schedule
 *               sectionId:
 *                 type: integer
 *                 description: ID of the section this schedule belongs to
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the schedule (ISO 8601 format)
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the schedule (ISO 8601 format)
 *               location:
 *                 type: string
 *                 description: Location where the schedule takes place
 *             required:
 *               - userId
 *               - sectionId
 *               - startTime
 *               - endTime
 *               - location
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL of the newly created schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict with existing schedule
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
 */

/**
 * @openapi
 * /schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     description: Retrieves a specific schedule by its ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Successfully retrieved schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a schedule
 *     description: Updates an existing schedule with the provided details
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The schedule ID
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
 *                 description: Start time of the schedule
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the schedule
 *               location:
 *                 type: string
 *                 description: Location where the schedule takes place
 *             required:
 *               - startTime
 *               - endTime
 *               - location
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a schedule
 *     description: Deletes a schedule by its ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule deleted"
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /schedules/users/{userId}:
 *   get:
 *     summary: Get schedules by user ID
 *     description: Retrieves all schedules for a specific user
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       404:
 *         description: No schedules found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete all schedules for a user
 *     description: Deletes all schedules associated with a specific user ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Schedules deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All schedules for user deleted"
 *       404:
 *         description: No schedules found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * /schedules/sections/{sectionId}:
 *   get:
 *     summary: Get schedules by section ID
 *     description: Retrieves all schedules for a specific section
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The section ID
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
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 _links:
 *                   $ref: '#/components/schemas/Links'
 *       404:
 *         description: No schedules found for this section
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @openapi
 * /schedules/{id}/async:
 *   put:
 *     summary: Asynchronously update a schedule
 *     description: Starts an asynchronous update operation for a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       202:
 *         description: Update request accepted
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: URL to check the status of the operation
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
 *                   example: http://api.example.com/operations/123e4567-e89b-12d3-a456-426614174000
 *                 operationId:
 *                   type: string
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 * 
 * /operations/{operationId}:
 *   get:
 *     summary: Get operation status
 *     description: Check the status of an asynchronous operation
 *     tags: [Operations]
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The operation ID
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
 *                   enum: [completed, failed]
 *                 result:
 *                   $ref: '#/components/schemas/Schedule'
 *       202:
 *         description: Operation still processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [processing]
 *       404:
 *         description: Operation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Define routes for Schedule resource
router.get('', getSchedules);
router.get('/:id', getScheduleById);
router.post('', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.get('/users/:userId', getSchedulesByUserId);
router.delete('/users/:userId', deleteSchedulesByUserId);
router.get('/sections/:sectionId', getSchedulesBySectionId);
router.put('/:id/async', updateScheduleAsync);
router.get('/operations/:operationId', getOperationStatus);

module.exports = router;
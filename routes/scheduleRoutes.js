const express = require('express');
const router = express.Router();
const { 
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByUserId,
    deleteSchedulesByUserId,
    getSchedulesBySectionId,
    updateScheduleAsync,
    getOperationStatus
} = require('../controllers/scheduleController');

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules with pagination
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of schedules
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
 */
router.get('/', getSchedules);

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 */
router.post('/', createSchedule);

/**
 * @swagger
 * /schedules/users/{userId}:
 *   get:
 *     summary: Get schedules by user ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of schedules for the user
 */
router.get('/users/:userId', getSchedulesByUserId);

/**
 * @swagger
 * /schedules/users/{userId}:
 *   delete:
 *     summary: Delete all schedules for a user
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedules deleted successfully
 */
router.delete('/users/:userId', deleteSchedulesByUserId);

/**
 * @swagger
 * /schedules/sections/{sectionId}:
 *   get:
 *     summary: Get schedules by section ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of schedules for the section
 */
router.get('/sections/:sectionId', getSchedulesBySectionId);

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule details
 *       404:
 *         description: Schedule not found
 */
router.get('/:id', getScheduleById);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Schedule not found
 */
router.put('/:id', updateSchedule);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete('/:id', deleteSchedule);

/**
 * @swagger
 * /schedules/{id}/async:
 *   put:
 *     summary: Update a schedule asynchronously
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       202:
 *         description: Update request accepted
 *       404:
 *         description: Schedule not found
 */
router.put('/:id/async', updateScheduleAsync);

/**
 * @swagger
 * /schedules/operations/{operationId}:
 *   get:
 *     summary: Get operation status
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: operationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operation completed
 *       202:
 *         description: Operation in progress
 *       404:
 *         description: Operation not found
 */
router.get('/operations/:operationId', getOperationStatus);

module.exports = router;
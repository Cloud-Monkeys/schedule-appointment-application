const express = require('express');
const { getSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule, getSchedulesByUserId, deleteSchedulesByUserId, getSchedulesBySectionId } = require('../controllers/scheduleController');
const router = express.Router();

// Define routes for Schedule resource
router.get('', getSchedules);
router.get('/:id', getScheduleById);
router.post('', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
router.get('/users/:userId', getSchedulesByUserId);
router.delete('/users/:userId', deleteSchedulesByUserId);
router.get('/sections/:sectionId', getSchedulesBySectionId);

module.exports = router;
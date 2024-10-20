const Schedule = require('../models/schedule');

// Get all schedules
const getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a schedule by its id
const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    try {
        const newSchedule = await Schedule.create(req.body);
        res.status(201).json(newSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update schedule details
const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.update(req.body);
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.destroy();
            res.json({ message: 'Schedule deleted' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all schedules for a professor
const getSchedulesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const schedules = await Schedule.findAll({
            where: { userId }
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all schedules for a professor (e.g., professor account deleted or resigned/retired)
const deleteSchedulesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await Schedule.destroy({
            where: { userId }
        });
        res.json({ message: `${result} schedules created by professor ${userId} deleted.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all schedules for a section
const getSchedulesBySectionId = async (req, res) => {
    const { sectionId } = req.params;
    try {
        const schedules = await Schedule.findAll({
            where: { sectionId }
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByUserId,
    deleteSchedulesByUserId,
    getSchedulesBySectionId
};
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all schedules
router.get('', (req, res) => {
    db.query("SELECT * FROM schedules", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Create a new schedule
router.post('', (req, res) => {
    const { professorId, courseId, startTime, endTime, location } = req.body;
    const query = 'INSERT INTO schedules (professor_id, course_id, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [professorId, courseId, startTime, endTime, location], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, professorId, courseId, startTime, endTime, location });
    });
});

// Get a schedule by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM schedules WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Update a schedule
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, location } = req.body;
    const query = 'UPDATE schedules SET start_time = ?, end_time = ?, location = ? WHERE id = ?';

    db.query(query, [startTime, endTime, location, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Schedule updated successfully' });
    });
});

// Delete a schedule
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM schedules WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Schedule deleted successfully' });
    });
});

// Get all schedules for a professor
router.get('/professors/:professorId', (req, res) => {
    const { professorId } = req.params;
    const query = 'SELECT * FROM schedules WHERE professor_id = ?';

    db.query(query, [professorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get all schedules for a course
router.get('/courses/:courseId', (req, res) => {
    const { courseId } = req.params;
    const query = 'SELECT * FROM schedules WHERE course_id = ?';

    db.query(query, [courseId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
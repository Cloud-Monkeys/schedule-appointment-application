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
    const { professor_id, course_id, start_time, end_time, location } = req.body;
    const query = 'INSERT INTO schedules (professor_id, course_id, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [professor_id, course_id, start_time, end_time, location], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, professor_id, course_id, start_time, end_time, location });
    });
});

// Get a schedule by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM schedules WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Update a schedule
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { start_time, end_time, location } = req.body;
    const query = 'UPDATE schedules SET start_time = ?, end_time = ?, location = ? WHERE id = ?';

    db.query(query, [start_time, end_time, location, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} schedule found. ${results.changedRows} schedule updated successfully.` });
    });
});

// Delete a schedule
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM schedules WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} schedule deleted successfully.` });
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

// Delete all schedules for a professor (e.g., professor account deleted or resigned/retired)
router.delete('/professors/:professorId', (req, res) => {
    const { professorId } = req.params;
    const query = 'DELETE FROM schedules WHERE professor_id = ?';

    db.query(query, [professorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} schedules created by professor ${professorId} deleted successfully.` });
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
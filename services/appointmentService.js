const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all appointments
router.get('', (req, res) => {
    db.query("SELECT * FROM appointments", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Create an appointment
router.post('', (req, res) => {
    const { studentId, scheduleId, startTime, endTime } = req.body;
    const query = 'INSERT INTO appointments (student_id, schedule_id, start_time, end_time) VALUES (?, ?, ?, ?)';

    db.query(query, [studentId, scheduleId, startTime, endTime], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, studentId, scheduleId, startTime, endTime });
    });
});

// Get an appointment by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM appointments WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Update an appointment
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const query = 'UPDATE appointments SET start_time = ?, end_time = ? WHERE id = ?';

    db.query(query, [startTime, endTime, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment updated successfully' });
    });
});

// Delete an appointment
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM appointments WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment canceled successfully' });
    });
});

// Get all appointments for a student
router.get('/:studentId', (req, res) => {
    const { studentId } = req.params;
    const query = 'SELECT * FROM appointments WHERE student_id = ?';

    db.query(query, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get all appointments for a schedule
router.get('/:scheduleId', (req, res) => {
    const { scheduleId } = req.params;
    const query = 'SELECT * FROM appointments WHERE schedule_id = ?';

    db.query(query, [scheduleId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
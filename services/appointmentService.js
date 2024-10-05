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
    const { student_id, schedule_id, start_time, end_time } = req.body;
    const query = 'INSERT INTO appointments (student_id, schedule_id, start_time, end_time) VALUES (?, ?, ?, ?)';

    db.query(query, [student_id, schedule_id, start_time, end_time], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, student_id, schedule_id, start_time, end_time });
    });
});

// Get an appointment by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM appointments WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Update an appointment
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;
    const query = 'UPDATE appointments SET start_time = ?, end_time = ? WHERE id = ?';

    db.query(query, [start_time, end_time, id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} appointment found. ${results.changedRows} appointment updated successfully.` });
    });
});

// Delete an appointment
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM appointments WHERE id = ?';

    db.query(query, [id], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} appointment canceled successfully.` });
    });
});

// Get all appointments for a student
router.get('/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    const query = 'SELECT * FROM appointments WHERE student_id = ?';

    db.query(query, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Delete all appointments for a student (e.g., student account deleted or transferred/graduated)
router.delete('/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    const query = 'DELETE FROM appointments WHERE student_id = ?';

    db.query(query, [studentId], (err, results) => {

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} appointments made by student ${studentId} canceled successfully.` });
    });
});

// Get all appointments for a schedule
router.get('/schedules/:scheduleId', (req, res) => {
    const { scheduleId } = req.params;
    const query = 'SELECT * FROM appointments WHERE schedule_id = ?';

    db.query(query, [scheduleId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
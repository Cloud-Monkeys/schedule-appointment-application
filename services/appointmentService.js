const express = require('express');
const router = express.Router();
const db = require('../config/db');


async function getAllAppointments(res) {
    try {
        const [results] = await db.query("SELECT * FROM appointments");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } 
}

router.get('', async (req, res) => {
    getAllAppointments(res);
});



// Create an appointment
router.post('', async (req, res) => {
    const { student_id, schedule_id, start_time, end_time } = req.body;
    const query = 'INSERT INTO appointments (student_id, schedule_id, start_time, end_time) VALUES (?, ?, ?, ?)';
    try {
        const [results] = await db.query(query, [student_id, schedule_id, start_time, end_time]);
        res.status(201).json({ id: results.insertId, student_id, schedule_id, start_time, end_time });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get an appointment by its id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM appointments WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an appointment
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { start_time, end_time } = req.body;
    const query = 'UPDATE appointments SET start_time = ?, end_time = ? WHERE id = ?';
    try {
        const [results] = await db.query(query, [start_time, end_time, id]);
        res.json({ message: `${results.affectedRows} appointment found. ${results.changedRows} appointment updated successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Force update an appointment
router.post('', async (req, res) => {
    const { student_id, schedule_id, start_time, end_time } = req.body;
    const query = 'INSERT INTO appointments (student_id, schedule_id, start_time, end_time) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE appointments SET student_id=?, start_time=?, end_time=?';
    try {
        const [results] = await db.query(query, [student_id, schedule_id, start_time, end_time, student_id, start_time, end_time]);
        res.status(201).json({ id: results.insertId, student_id, schedule_id, start_time, end_time });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM appointments WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json({ message: `${results.affectedRows} appointment canceled successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all appointments for a student
router.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const query = 'SELECT * FROM appointments WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [studentId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete all appointments for a student (e.g., student account deleted or transferred/graduated)
router.delete('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const query = 'DELETE FROM appointments WHERE student_id = ?';
    try {
        const [results] = await db.query(query, [studentId]);
        res.json({ message: `${results.affectedRows} appointments made by student ${studentId} canceled successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all appointments for a schedule
router.get('/schedules/:scheduleId', async (req, res) => {
    const { scheduleId } = req.params;
    const query = 'SELECT * FROM appointments WHERE schedule_id = ?';
    try {
        const [results] = await db.query(query, [scheduleId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
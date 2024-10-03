const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dbuserdbuser',
    database: 'schedule_appointment_database'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Create an appointment
app.post('/appointments', (req, res) => {
    const { studentId, scheduleId, startTime, endTime } = req.body;
    const query = 'INSERT INTO appointments (student_id, schedule_id, start_time, end_time) VALUES (?, ?, ?, ?)';

    db.query(query, [studentId, scheduleId, startTime, endTime], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, studentId, scheduleId, startTime, endTime });
    });
});

// Update an appointment
app.put('/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const query = 'UPDATE appointments SET start_time = ?, end_time = ? WHERE id = ?';

    db.query(query, [startTime, endTime, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment updated successfully' });
    });
});

// Delete an appointment
app.delete('/appointments/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM appointments WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment canceled successfully' });
    });
});

// Get appointments for a student
app.get('/appointments/:studentId', (req, res) => {
    const { studentId } = req.params;
    const query = 'SELECT * FROM appointments WHERE student_id = ?';

    db.query(query, [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Appointment Management Service running on port ${PORT}`);
});

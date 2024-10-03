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

// Create a new schedule
app.post('/schedules', (req, res) => {
    const { professorId, courseId, startTime, endTime, location } = req.body;
    const query = 'INSERT INTO schedules (professor_id, course_id, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [professorId, courseId, startTime, endTime, location], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, professorId, courseId, startTime, endTime, location });
    });
});

// Update a schedule
app.put('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, location } = req.body;
    const query = 'UPDATE schedules SET start_time = ?, end_time = ?, location = ? WHERE id = ?';

    db.query(query, [startTime, endTime, location, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Schedule updated successfully' });
    });
});

// Delete a schedule
app.delete('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM schedules WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Schedule deleted successfully' });
    });
});

// Get all schedules for a professor
app.get('/schedules/:professorId', (req, res) => {
    const { professorId } = req.params;
    const query = 'SELECT * FROM schedules WHERE professor_id = ?';

    db.query(query, [professorId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Schedule Management Service running on port ${PORT}`);
});

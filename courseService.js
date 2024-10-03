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

// Create a new course
app.post('/courses', (req, res) => {
    const { courseName } = req.body;
    const query = 'INSERT INTO courses (course_name) VALUES (?)';

    db.query(query, [courseName], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, courseName });
    });
});

// Update a course
app.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { courseName } = req.body;
    const query = 'UPDATE courses SET course_name = ? WHERE id = ?';

    db.query(query, [courseName, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course updated successfully' });
    });
});

// Delete a course
app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM courses WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course deleted successfully' });
    });
});

// Get all courses
app.get('/courses', (req, res) => {
    const query = 'SELECT * FROM courses';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Course Management Service running on port ${PORT}`);
});

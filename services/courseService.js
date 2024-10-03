const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new course
router.post('', (req, res) => {
    const { courseName } = req.body;
    const query = 'INSERT INTO courses (course_name) VALUES (?)';

    db.query(query, [courseName], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, courseName });
    });
});

// Update a course
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { courseName } = req.body;
    const query = 'UPDATE courses SET course_name = ? WHERE id = ?';

    db.query(query, [courseName, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course updated successfully' });
    });
});

// Delete a course
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM courses WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Course deleted successfully' });
    });
});

// Get all courses
router.get('', (req, res) => {
    const query = 'SELECT * FROM courses';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a course by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM courses WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
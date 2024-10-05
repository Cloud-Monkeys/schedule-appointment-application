const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new course
router.post('', (req, res) => {
    const { course_name } = req.body;
    const query = 'INSERT INTO courses (course_name) VALUES (?)';

    db.query(query, [course_name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, course_name });
    });
});

// Update a course
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { course_name } = req.body;
    const query = 'UPDATE courses SET course_name = ? WHERE id = ?';

    db.query(query, [course_name, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} course found. ${results.changedRows} course updated successfully.` });
    });
});

// Delete a course
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM courses WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} course deleted successfully.` });
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

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
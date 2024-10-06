const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new course
router.post('', async (req, res) => {
    const { course_code, course_name } = req.body;
    const query = 'INSERT INTO courses (course_code, course_name) VALUES (?, ?)';
    try {
        const [results] = await db.query(query, [course_code, course_name]);
        res.status(201).json({ id: results.insertId, course_code, course_name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a course
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { course_code, course_name } = req.body;
    const query = 'UPDATE courses SET course_code = ?, course_name = ? WHERE id = ?';
    try {
        const [results] = await db.query(query, [course_code, course_name, id]);
        res.json({ message: `${results.affectedRows} course found. ${results.changedRows} course updated successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM courses WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json({ message: `${results.affectedRows} course deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all courses
router.get('', async (req, res) => {
    const query = 'SELECT * FROM courses';
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a course by its id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM courses WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
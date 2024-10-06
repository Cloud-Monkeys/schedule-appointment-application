const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new course membership (student registers or professor is assigned)
router.post('', async (req, res) => {
    const { user_id, course_id } = req.body;
    const query = 'INSERT INTO course_memberships (user_id, course_id) VALUES (?, ?)';
    try {
        const [results] = await db.query(query, [user_id, course_id]);
        res.status(201).json({ id: results.insertId, user_id, course_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a course membership
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { user_id, course_id } = req.body;
    const query = 'UPDATE course_memberships SET user_id = ?, course_id = ? WHERE id = ?';
    try {
        const [results] = await db.query(query, [user_id, course_id, id]);
        res.json({ message: `${results.affectedRows} course membership found. ${results.changedRows} course membership updated successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a course membership
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM course_memberships WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json({ message: `${results.affectedRows} course membership deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all course memberships
router.get('', async (req, res) => {
    const query = 'SELECT * FROM course_memberships';
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a course membership by its id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM course_memberships WHERE id = ?';
    try {
        const [results] = await db.query(query, [id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all course memberships for a user
router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM course_memberships WHERE user_id = ?';
    try {
        const [results] = await db.query(query, [userId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete all course memberships for a user (e.g., user account deletion)
router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const query = 'DELETE FROM course_memberships WHERE user_id = ?';
    try {
        const [results] = await db.query(query, [userId]);
        res.json({ message: `${results.affectedRows} course memberships associated with user ${userId} deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
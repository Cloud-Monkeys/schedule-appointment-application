const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new course membership (student registers or professor is assigned)
router.post('', (req, res) => {
    const { user_id, course_id } = req.body;
    const query = 'INSERT INTO course_memberships (user_id, course_id) VALUES (?, ?)';

    db.query(query, [user_id, course_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, user_id, course_id });
    });
});

// Update a course membership
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, course_id } = req.body;
    const query = 'UPDATE course_memberships SET user_id = ?, course_id = ? WHERE id = ?';

    db.query(query, [user_id, course_id, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} course membership found. ${results.changedRows} course membership updated successfully.` });
    });
});

// Delete a course membership
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM course_memberships WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} course membership deleted successfully.` });
    });
});

// Get all course memberships
router.get('', (req, res) => {
    const query = 'SELECT * FROM course_memberships';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get a course membership by its id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM course_memberships WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get all course memberships for a user
router.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM course_memberships WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Delete all course memberships for a user (e.g., user account deletion)
router.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'DELETE FROM course_memberships WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `${results.affectedRows} course memberships associated with user ${userId} deleted successfully.` });
    });
});

module.exports = router;
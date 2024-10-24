// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
//
// // Get all schedules
// router.get('', async (req, res) => {
//     try {
//         const [results] = await db.query("SELECT * FROM schedules");
//         res.json(results);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Create a new schedule
// router.post('', async (req, res) => {
//     const { professor_id, course_id, start_time, end_time, location } = req.body;
//     const query = 'INSERT INTO schedules (professor_id, course_id, start_time, end_time, location) VALUES (?, ?, ?, ?, ?)';
//     try {
//         const [results] = await db.query(query, [professor_id, course_id, start_time, end_time, location]);
//         res.status(201).json({ id: results.insertId, professor_id, course_id, start_time, end_time, location });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Get a schedule by its id
// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = 'SELECT * FROM schedules WHERE id = ?';
//     try {
//         const [results] = await db.query(query, [id]);
//         res.json(results);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Update a schedule
// router.put('/:id', async (req, res) => {
//     const id = req.params.id;
//     const { start_time, end_time, location } = req.body;
//     const query = 'UPDATE schedules SET start_time = ?, end_time = ?, location = ? WHERE id = ?';
//     try {
//         const [results] = await db.query(query, [start_time, end_time, location, id]);
//         res.json({ message: `${results.affectedRows} schedule found. ${results.changedRows} schedule updated successfully.` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Delete a schedule
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = 'DELETE FROM schedules WHERE id = ?';
//     try {
//         const [results] = await db.query(query, [id]);
//         res.json({ message: `${results.affectedRows} schedule deleted successfully.` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Get all schedules for a professor
// router.get('/users/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const query = 'SELECT * FROM schedules WHERE user_id = ?';
//     try {
//         const [results] = await db.query(query, [userId]);
//         res.json(results);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Delete all schedules for a professor (e.g., professor account deleted or resigned/retired)
// router.delete('/users/:userId', async (req, res) => {
//     const { userId } = req.params;
//     const query = 'DELETE FROM schedules WHERE user_id = ?';
//     try {
//         const [results] = await db.query(query, [userId]);
//         res.json({ message: `${results.affectedRows} schedules created by professor ${userId} deleted successfully.` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// // Get all schedules for a section
// router.get('/sections/:sectionId', async (req, res) => {
//     const { sectionId } = req.params;
//     const query = 'SELECT * FROM schedules WHERE section_id = ?';
//     try {
//         const [results] = await db.query(query, [sectionId]);
//         res.json(results);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
//
// module.exports = router;
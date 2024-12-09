const express = require('express');
const router = express.Router();
const subscriptionService = require('../services/subscriptionService');

/**
 * @swagger
 * /subscriptions/email:
 *   post:
 *     summary: Subscribe an email to appointment notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully subscribed
 */
router.post('/email', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const result = await subscriptionService.subscribeEmail(email);
        res.json({ message: 'Successfully subscribed to notifications', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /subscriptions/sms:
 *   post:
 *     summary: Subscribe a phone number to SMS notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully subscribed
 */
router.post('/sms', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        
        const result = await subscriptionService.subscribeSMS(phoneNumber);
        res.json({ message: 'Successfully subscribed to SMS notifications', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /subscriptions/https:
 *   post:
 *     summary: Subscribe an HTTPS endpoint to notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully subscribed
 */
router.post('/https', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        const result = await subscriptionService.subscribeHTTPS(url);
        res.json({ message: 'Successfully subscribed endpoint to notifications', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 
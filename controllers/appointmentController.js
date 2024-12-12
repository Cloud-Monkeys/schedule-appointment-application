const Appointment = require('../models/appointment');
const { Op } = require('sequelize');
const crypto = require('crypto');
const cache = require('../utils/cache');
const snsService = require('../services/snsService');
const { getAppointmentEmailTemplate } = require('../services/emailTemplateService');

// SNS Topic ARN - you'll need to create this topic in AWS SNS and put the ARN here
const APPOINTMENT_TOPIC_ARN = process.env.APPOINTMENT_TOPIC_ARN;

// Helper function to send SNS notifications
const sendAppointmentNotification = async (action, appointment) => {
    try {
        if (!APPOINTMENT_TOPIC_ARN) {
            console.warn('APPOINTMENT_TOPIC_ARN not set. Skipping notification.');
            return;
        }

        const template = getAppointmentEmailTemplate(action, appointment);
        
        const message = {
            default: JSON.stringify({
                action,
                appointmentId: appointment.id,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                status: appointment.status,
                timestamp: new Date().toISOString()
            }),
            email: template.message,
            sms: `Your appointment on ${new Date(appointment.startTime).toLocaleDateString()} has been ${action.toLowerCase().replace('APPOINTMENT_', '')}`
        };

        await snsService.publishMessage(APPOINTMENT_TOPIC_ARN, message, template.subject);
    } catch (error) {
        console.error('Failed to send SNS notification:', error);
    }
};

// Get all appointments with pagination
const getAppointments = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'startTime',
            order = 'DESC',
            startDate,
            endDate
        } = req.query;

        const where = {};
        if (startDate) {
            where.startTime = {
                [Op.gte]: new Date(startDate)
            };
        }
        if (endDate) {
            where.endTime = {
                [Op.lte]: new Date(endDate)
            };
        }

        const { count, rows: appointments } = await Appointment.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [[sortBy, order]]
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);
        
        // Generate pagination links only if there's data
        const baseUrl = `${req.protocol}://${req.get('host')}/appointments`;
        const links = {
            self: `${baseUrl}?page=${page}&limit=${limit}`
        };
        
        if (totalPages > 0) {
            links.first = `${baseUrl}?page=1&limit=${limit}`;
            links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
            
            if (page > 1) {
                links.prev = `${baseUrl}?page=${page-1}&limit=${limit}`;
            }
            if (page < totalPages) {
                links.next = `${baseUrl}?page=${page+1}&limit=${limit}`;
            }
        }

        // Set Link header
        res.links(links);

        // Send response
        res.json({
            data: appointments,
            pagination: {
                total: count,
                page,
                limit,
                totalPages
            },
            _links: links
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get an appointment by its id
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        if (appointment) {
            // Add _links section using our utility
            appointment.dataValues._links = {
                self: {
                    href: `${baseUrl}/appointments/${appointment.id}`,
                    method: 'GET'
                },
                collection: {
                    href: `${baseUrl}/appointments`,
                    method: 'GET'
                },
                update: {
                    href: `${baseUrl}/appointments/${appointment.id}`,
                    method: 'PUT'
                },
                delete: {
                    href: `${baseUrl}/appointments/${appointment.id}`,
                    method: 'DELETE'
                },
                // Related resources
                schedule: {
                    href: `${baseUrl}/schedules/${appointment.scheduleId}`,
                    method: 'GET'
                }
            };
            
            res.json(appointment);
        } else {
            res.status(404).json({ 
                message: 'Appointment not found',
                _links: {
                    collection: {
                        href: `${baseUrl}/appointments`,
                        method: 'GET'
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        
        // Send notification for new appointment
        await sendAppointmentNotification('APPOINTMENT_CREATED', appointment);
        
        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update an appointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        await appointment.update(req.body);
        
        // Send notification for updated appointment
        await sendAppointmentNotification('APPOINTMENT_UPDATED', appointment);

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        await appointment.update({ status: 'cancelled' });
        
        // Send notification for cancelled appointment
        await sendAppointmentNotification('APPOINTMENT_CANCELLED', appointment);

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment) {
            await appointment.destroy();
            res.json({ message: 'Appointment deleted' });
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all appointments for a schedule
const getAppointmentsByScheduleId = async (req, res) => {
    const { scheduleId } = req.params;
    try {
        const appointments = await Appointment.findAll({
            where: { scheduleId }
        });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const bulkUpdateAppointments = async (req, res) => {
    const { appointments } = req.body;
    const jobId = Date.now().toString();
    
    // Send immediate response
    res.status(202).json({
        message: 'Update job accepted',
        statusUrl: `/appointments/jobs/${jobId}`
    });

    // Process updates asynchronously
    process.nextTick(async () => {
        try {
            // Perform bulk updates
            for (const appt of appointments) {
                await Appointment.update(appt, {
                    where: { id: appt.id }
                });
            }
            // Store job result
            await cache.set(jobId, { status: 'completed' });
        } catch (error) {
            await cache.set(jobId, { 
                status: 'failed', 
                error: error.message 
            });
        }
    });
};

const errorHandler = (err, req, res, next) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = {
        collection: {
            href: `${baseUrl}/appointments`,
            method: 'GET'
        }
    };

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            })),
            _links: links
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 'error',
            code: 'CONFLICT',
            message: 'Resource already exists',
            _links: links
        });
    }

    // Default error
    res.status(500).json({
        status: 'error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        _links: links
    });
};

const updateAppointmentAsync = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findByPk(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Generate a unique operation ID
        const operationId = crypto.randomUUID();
        
        // Create status URL where client can check progress
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const statusUrl = `${baseUrl}/operations/${operationId}`;

        // Store the operation details in cache
        await cache.set(operationId, {
            status: 'processing',
            resourceType: 'appointment',
            resourceId: appointmentId,
            operation: 'update',
            data: req.body
        });

        // Process the update asynchronously
        processAppointmentUpdate(operationId, appointment, req.body).catch(console.error);

        // Return 202 with the status URL
        res.status(202)
           .setHeader('Location', statusUrl)
           .json({
               message: 'Update request accepted',
               statusUrl: statusUrl,
               operationId: operationId
           });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Async processing function
async function processAppointmentUpdate(operationId, appointment, updateData) {
    try {
        // Simulate long-running task
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Perform the update
        await appointment.update(updateData);

        // Update operation status to complete
        await cache.set(operationId, {
            status: 'completed',
            resourceType: 'appointment',
            resourceId: appointment.id,
            operation: 'update',
            result: appointment
        });
    } catch (error) {
        // Update operation status to failed
        await cache.set(operationId, {
            status: 'failed',
            resourceType: 'appointment',
            resourceId: appointment.id,
            operation: 'update',
            error: error.message
        });
    }
}

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByScheduleId
};

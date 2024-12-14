const Schedule = require('../models/schedule');
const crypto = require('crypto');
const cache = require('../utils/cache');

// Get all schedules with pagination
const getSchedules = async (req, res) => {
    try {
        // Get pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get paginated data and total count
        const { count, rows: schedules } = await Schedule.findAndCountAll({
            limit,
            offset,
            order: [['startTime', 'DESC']]
        });

        // Calculate total pages
        const totalPages = Math.ceil(count / limit);
        
        // Generate pagination links
        const baseUrl = `${req.protocol}://${req.get('host')}/schedules`;
        const links = {
            self: `${baseUrl}?page=${page}&limit=${limit}`,
            first: `${baseUrl}?page=1&limit=${limit}`,
            last: `${baseUrl}?page=${totalPages}&limit=${limit}`
        };
        
        if (page > 1) links.prev = `${baseUrl}?page=${page-1}&limit=${limit}`;
        if (page < totalPages) links.next = `${baseUrl}?page=${page+1}&limit=${limit}`;

        // Set Link header
        res.links(links);

        // Send response
        res.json({
            data: schedules,
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

// Create a new schedule
const createSchedule = async (req, res) => {
    try {
        const newSchedule = await Schedule.create(req.body);
        
        // Generate the URL for the newly created resource
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resourceUrl = `${baseUrl}/schedules/${newSchedule.id}`;
        
        // Set the Location header
        res.setHeader('Location', resourceUrl);
        
        // Return 201 status with the created resource
        res.status(201).json(newSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update schedule details
const updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.update(req.body);
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            await schedule.destroy();
            res.json({ message: 'Schedule deleted' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all schedules for a professor
const getSchedulesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const schedules = await Schedule.findAll({
            where: { userId }
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all schedules for a professor (e.g., professor account deleted or resigned/retired)
const deleteSchedulesByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await Schedule.destroy({
            where: { userId }
        });
        res.json({ message: `${result} schedules created by professor ${userId} deleted.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all schedules for a section
const getSchedulesBySectionId = async (req, res) => {
    const { sectionId } = req.params;
    try {
        const schedules = await Schedule.findAll({
            where: { sectionId }
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        // Add links to each schedule
        const schedulesWithLinks = schedules.map(schedule => ({
            ...schedule.toJSON(),
            _links: {
                self: {
                    href: `${baseUrl}/schedules/${schedule.id}`,
                    method: 'GET'
                },
                update: {
                    href: `${baseUrl}/schedules/${schedule.id}`,
                    method: 'PUT'
                },
                delete: {
                    href: `${baseUrl}/schedules/${schedule.id}`,
                    method: 'DELETE'
                },
                // Related resources
                section: {
                    href: `${baseUrl}/sections/${schedule.sectionId}`,
                    method: 'GET'
                },
                appointments: {
                    href: `${baseUrl}/schedules/${schedule.id}/appointments`,
                    method: 'GET'
                }
            }
        }));

        // Add collection-level links
        res.json(schedulesWithLinks);
    } catch (err) {
        res.status(500).json({ 
            error: err.message,
            _links: {
                self: {
                    href: `${req.protocol}://${req.get('host')}/sections/${sectionId}/schedules`,
                    method: 'GET'
                }
            }
        });
    }
};

// Update schedule details asynchronously
const updateScheduleAsync = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const schedule = await Schedule.findByPk(scheduleId);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        if (!schedule) {
            return res.status(404).json({ 
                message: 'Schedule not found',
                _links: {
                    collection: {
                        href: `${baseUrl}/schedules`,
                        method: 'GET'
                    }
                }
            });
        }

        const operationId = crypto.randomUUID();
        const statusUrl = `${baseUrl}/operations/${operationId}`;

        await cache.set(operationId, {
            status: 'processing',
            resourceType: 'schedule',
            resourceId: scheduleId,
            operation: 'update',
            data: req.body
        });

        processScheduleUpdate(operationId, schedule, req.body).catch(console.error);

        res.status(202)
           .setHeader('Location', statusUrl)
           .json({
               message: 'Update request accepted',
               statusUrl: statusUrl,
               operationId: operationId,
               _links: {
                   status: {
                       href: statusUrl,
                       method: 'GET'
                   },
                   schedule: {
                       href: `${baseUrl}/schedules/${scheduleId}`,
                       method: 'GET'
                   },
                   cancel: {
                       href: `${baseUrl}/operations/${operationId}`,
                       method: 'DELETE'
                   }
               }
           });

    } catch (err) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.status(400).json({ 
            error: err.message,
            _links: {
                collection: {
                    href: `${baseUrl}/schedules`,
                    method: 'GET'
                }
            }
        });
    }
};

// Async processing function
async function processScheduleUpdate(operationId, schedule, updateData) {
    try {
        // Simulate long-running task
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Perform the update
        await schedule.update(updateData);

        // Update operation status to complete
        await cache.set(operationId, {
            status: 'completed',
            resourceType: 'schedule',
            resourceId: schedule.id,
            operation: 'update',
            result: schedule
        });
    } catch (error) {
        // Update operation status to failed
        await cache.set(operationId, {
            status: 'failed',
            resourceType: 'schedule',
            resourceId: schedule.id,
            operation: 'update',
            error: error.message
        });
    }
}

// Endpoint to check operation status
const getOperationStatus = async (req, res) => {
    const operationId = req.params.operationId;
    const operation = await cache.get(operationId);

    if (!operation) {
        return res.status(404).json({ message: 'Operation not found' });
    }

    // If operation is complete, return 200, otherwise return 202
    const status = operation.status === 'completed' ? 200 : 202;
    res.status(status).json(operation);
};

// Add a new method to get a single schedule by ID
const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        
        if (schedule) {
            const response = {
                ...schedule.toJSON(),
                _links: {
                    self: {
                        href: `${baseUrl}/schedules/${schedule.id}`,
                        method: 'GET'
                    },
                    collection: {
                        href: `${baseUrl}/schedules`,
                        method: 'GET'
                    },
                    update: {
                        href: `${baseUrl}/schedules/${schedule.id}`,
                        method: 'PUT'
                    },
                    delete: {
                        href: `${baseUrl}/schedules/${schedule.id}`,
                        method: 'DELETE'
                    },
                    // Related resources
                    section: {
                        href: `${baseUrl}/sections/${schedule.sectionId}`,
                        method: 'GET'
                    },
                    user: {
                        href: `${baseUrl}/users/${schedule.userId}`,
                        method: 'GET'
                    },
                    appointments: {
                        href: `${baseUrl}/schedules/${schedule.id}/appointments`,
                        method: 'GET'
                    }
                }
            };
            
            res.json(response);
        } else {
            res.status(404).json({ 
                message: 'Schedule not found',
                _links: {
                    collection: {
                        href: `${baseUrl}/schedules`,
                        method: 'GET'
                    }
                }
            });
        }
    } catch (err) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.status(500).json({ 
            error: err.message,
            _links: {
                collection: {
                    href: `${baseUrl}/schedules`,
                    method: 'GET'
                }
            }
        });
    }
};

module.exports = {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedulesByUserId,
    deleteSchedulesByUserId,
    getSchedulesBySectionId,
    updateScheduleAsync,
    getOperationStatus
};

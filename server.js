require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import routes
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// First middleware setup
app.use(express.json());
app.use(cors());

// Setup OpenAPI documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Schedule Appointment API',
            version: '1.0.0',
            description: 'API for managing schedules and appointments'
        },
        tags: [
            {
                name: 'Subscription',
                description: 'Subscription management endpoints'
            }
        ],
        components: {
            schemas: {
                Schedule: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        userId: { type: 'string' },
                        sectionId: { type: 'integer' },
                        startTime: { type: 'string', format: 'date-time' },
                        endTime: { type: 'string', format: 'date-time' },
                        location: { type: 'string' }
                    }
                },
                Appointment: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        userId: { type: 'string' },
                        scheduleId: { type: 'integer' },
                        startTime: { type: 'string', format: 'date-time' },
                        endTime: { type: 'string', format: 'date-time' },
                        description: { type: 'string' }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'integer',
                            description: 'Total number of items'
                        },
                        page: {
                            type: 'integer',
                            description: 'Current page number'
                        },
                        limit: {
                            type: 'integer',
                            description: 'Number of items per page'
                        },
                        totalPages: {
                            type: 'integer',
                            description: 'Total number of pages'
                        }
                    }
                },
                Links: {
                    type: 'object',
                    properties: {
                        self: {
                            type: 'string',
                            description: 'URL of the current page'
                        },
                        first: {
                            type: 'string',
                            description: 'URL of the first page'
                        },
                        prev: {
                            type: 'string',
                            description: 'URL of the previous page'
                        },
                        next: {
                            type: 'string',
                            description: 'URL of the next page'
                        },
                        last: {
                            type: 'string',
                            description: 'URL of the last page'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        code: {
                            type: 'string',
                            description: 'Error code'
                        },
                        details: {
                            type: 'object',
                            description: 'Additional error details'
                        }
                    },
                    required: ['message']
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Schedule Appointment API',
        endpoints: {
            schedules: '/schedules',
            appointments: '/appointments',
            subscriptions: '/subscriptions',
            docs: '/api-docs'
        }
    });
});

app.use('/schedules', scheduleRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/subscriptions', subscriptionRoutes);

// Database sync and server start
db.sync({ force: false })
    .then(() => {
        console.log('Database synchronized');
        app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

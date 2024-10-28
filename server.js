require('dotenv').config();
const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const app = express();
const db = require('./config/db');

// First middleware setup
app.use(express.json());
app.use(cors());

// Setup OpenAPI documentation
expressOasGenerator.handleResponses(app, {
    swaggerUiServePath: 'api-docs',
    specOutputPath: './swagger.json',
    predefinedSpec: {
        info: {
            title: 'Schedule Appointment API',
            version: '1.0.0',
            description: 'API for managing schedules and appointments'
        }
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Schedule Appointment API',
        endpoints: {
            schedules: '/schedules',
            appointments: '/appointments',
            docs: '/api-docs'
        }
    });
});

const scheduleRoutes = require('./routes/scheduleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use('/schedules', scheduleRoutes);
app.use('/appointments', appointmentRoutes);

// Initialize request handling for OpenAPI
expressOasGenerator.handleRequests();

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

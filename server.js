const express = require('express');
const app = express();
const scheduleService = require('./services/scheduleService');
const appointmentService = require('./services/appointmentService');
const courseService = require('./services/courseService');

app.use(express.json());

// Define specific base routes for each service
app.use('/schedules', scheduleService);
app.use('/appointments', appointmentService);
app.use('/courses', courseService);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
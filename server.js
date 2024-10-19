require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const scheduleService = require('./services/scheduleService');
const appointmentService = require('./services/appointmentService');
const courseService = require('./services/courseService');
const courseMembershipService = require('./services/courseMembershipService');

app.use(express.json());
app.use(cors());

// Define specific base routes for each service
app.use('/schedules', scheduleService);
app.use('/appointments', appointmentService);
app.use('/courses', courseService);
app.use('/course-memberships', courseMembershipService);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

require('dotenv').config();
const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const app = express();
expressOasGenerator.init(app);
const scheduleService = require('./services/scheduleService');
const appointmentService = require('./services/appointmentService');
// const courseMembershipService = require('./services/courseMembershipService');

app.use(express.json());
app.use(cors());

// Define specific base routes for each service
app.use('/schedules', scheduleService);
app.use('/appointments', appointmentService);
// app.use('/course-memberships', courseMembershipService);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

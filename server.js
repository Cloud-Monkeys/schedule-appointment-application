require('dotenv').config();
const express = require('express');
const expressOasGenerator = require('express-oas-generator');
const cors = require('cors');
const app = express();
expressOasGenerator.init(app);
const scheduleRoutes = require('./routes/scheduleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use(express.json());
app.use(cors());

// Define specific base routes for each service
app.use('/schedules', scheduleRoutes);
app.use('/appointments', appointmentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

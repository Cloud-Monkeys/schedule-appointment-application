const express = require('express');
const axios = require('axios');
const router = express.Router();

// Composite Service to Aggregate Appointment Information



// Get detailed appointment information for a student
router.get('/appointments/details/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Fetch appointment details
        const appointmentResponse = await axios.get(`http://localhost:3000/appointments/${appointmentId}`);
        const appointment = appointmentResponse.data[0];

        // Fetch schedule details for the appointment
        const scheduleResponse = await axios.get(`http://localhost:3000/schedules/${appointment.schedule_id}`);
        const schedule = scheduleResponse.data[0];

        // Fetch course details for the appointment
        const courseResponse = await axios.get(`http://localhost:3000/courses/${schedule.course_id}`);
        const course = courseResponse.data[0];

        // Fetch course membership details for the student
        const membershipResponse = await axios.get(`http://localhost:3000/course-memberships/users/${appointment.student_id}`);
        const membership = membershipResponse.data;

        // Combine all data into a single response
        const detailedAppointment = {
            appointment: {
                id: appointment.id,
                student_id: appointment.student_id,
                schedule_id: appointment.schedule_id,
                start_time: appointment.start_time,
                end_time: appointment.end_time,
            },
            schedule: {
                id: schedule.id,
                professor_id: schedule.professor_id,
                course_id: schedule.course_id,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                location: schedule.location,
            },
            course: {
                id: course.id,
                course_code: course.course_code,
                course_name: course.course_name,
            },
            membership: membership,
        };

        // Send the combined response
        res.json(detailedAppointment);

    } catch (err) {
        console.error('Error fetching appointment details:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get a student's complete schedule with all appointment details
router.get('/students/:studentId/schedule', async (req, res) => {
    const { studentId } = req.params;

    try {
        // Fetch all appointments for the student
        const appointmentsResponse = await axios.get(`http://localhost:3000/appointments/students/${studentId}`);
        const appointments = appointmentsResponse.data;

        // Prepare to fetch schedule and course details for each appointment
        const detailedAppointments = await Promise.all(appointments.map(async (appointment) => {
            const scheduleResponse = await axios.get(`http://localhost:3000/schedules/${appointment.schedule_id}`);
            const schedule = scheduleResponse.data[0];

            const courseResponse = await axios.get(`http://localhost:3000/courses/${schedule.course_id}`);
            const course = courseResponse.data[0];

            return {
                appointment,
                schedule,
                course
            };
        }));

        // Send the combined schedule response
        res.json(detailedAppointments);

    } catch (err) {
        console.error('Error fetching student schedule:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

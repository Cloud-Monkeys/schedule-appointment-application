const getAppointmentEmailTemplate = (action, appointment) => {
    const templates = {
        APPOINTMENT_CREATED: {
            subject: 'New Appointment Scheduled',
            message: `
Dear User,

Your appointment has been successfully scheduled:

Date: ${new Date(appointment.startTime).toLocaleDateString()}
Time: ${new Date(appointment.startTime).toLocaleTimeString()} - ${new Date(appointment.endTime).toLocaleTimeString()}
Description: ${appointment.description}

You can view your appointment details by logging into your account.

Best regards,
Your Scheduling Team
            `
        },
        APPOINTMENT_UPDATED: {
            subject: 'Appointment Updated',
            message: `
Dear User,

Your appointment has been updated:

Date: ${new Date(appointment.startTime).toLocaleDateString()}
Time: ${new Date(appointment.startTime).toLocaleTimeString()} - ${new Date(appointment.endTime).toLocaleTimeString()}
Description: ${appointment.description}

You can view the updated details by logging into your account.

Best regards,
Your Scheduling Team
            `
        },
        APPOINTMENT_CANCELLED: {
            subject: 'Appointment Cancelled',
            message: `
Dear User,

Your appointment has been cancelled:

Date: ${new Date(appointment.startTime).toLocaleDateString()}
Time: ${new Date(appointment.startTime).toLocaleTimeString()} - ${new Date(appointment.endTime).toLocaleTimeString()}

If you did not request this cancellation, please contact our support team.

Best regards,
Your Scheduling Team
            `
        }
    };

    return templates[action] || {
        subject: 'Appointment Notification',
        message: 'There has been an update to your appointment.'
    };
};

module.exports = { getAppointmentEmailTemplate }; 
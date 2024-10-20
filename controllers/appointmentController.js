const Appointment = require('../models/appointment');

// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get an appointment by its id
const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment) {
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update appointment details
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (appointment) {
            await appointment.update(req.body);
            res.json(appointment);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
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

// Get all appointments for a student
const getAppointmentsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const appointments = await Appointment.findAll({
            where: { userId }
        });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete all appointments for a student (e.g., student account deleted or transferred/graduated)
const deleteAppointmentsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await Appointment.destroy({
            where: { userId }
        });
        res.json({ message: `${result} appointments made by student ${userId} canceled.` });
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

module.exports = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByUserId,
    deleteAppointmentsByUserId,
    getAppointmentsByScheduleId
};
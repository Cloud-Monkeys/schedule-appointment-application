const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Schedule = require('./schedule');

const Appointment = db.define('appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'schedule_id',
        references: {
            model: Schedule,
            key: 'id',
            onDelete: 'CASCADE'
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_time'
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_time'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    validate: {
        startBeforeEnd() {
            if (this.startTime >= this.endTime) {
                throw new Error('Appointment start time must be less than end time');
            }
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['schedule_id', 'start_time', 'end_time', 'description']
        }
    ]
});

module.exports = Appointment;
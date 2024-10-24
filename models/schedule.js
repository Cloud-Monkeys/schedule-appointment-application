const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Schedule = db.define('schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    sectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'section_id'
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
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    validate: {
        startBeforeEnd() {
            if (this.startTime >= this.endTime) {
                throw new Error('Schedule start time must be less than end time');
            }
        }
    },
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'section_id', 'start_time', 'end_time', 'location']
        }
    ]
});

module.exports = Schedule;
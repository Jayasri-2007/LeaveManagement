const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        leaveType: {
            type: String,
            required: true,
            enum: ['Casual Leave', 'Medical Leave', 'Earned Leave']
        },

        startDate: {
            type: String,
            required: true
        },

        endDate: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
);

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;

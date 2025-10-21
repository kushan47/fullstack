// models/AttendanceRecord.js
const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema({
    // Reference to the Subject model
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // Status can be 'attended' or 'missed'
    status: {
        type: String,
        enum: ['attended', 'missed'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);

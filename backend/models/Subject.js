const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    // 1. Subject Name (Required and Unique)
    name: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate subject names
        trim: true
    },
    
    // 2. Total classes conducted for this subject
    totalClasses: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    // 3. Total classes the student has attended
    attendedClasses: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    // 4. The attendance percentage target (e.g., 75)
    targetAttendance: {
        type: Number,
        required: true, // Added required to ensure integrity
        default: 75,
        min: 50,
        max: 100
    },
    
    // Timestamp for when the subject was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', subjectSchema);
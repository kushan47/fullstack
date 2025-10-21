const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const AttendanceRecord = require('../models/AttendanceRecord');

// Middleware to check if a subject exists (used for detail/delete routes)
const getSubject = async (req, res, next) => {
    let subject;
    try {
        subject = await Subject.findById(req.params.id);
        if (subject == null) {
            return res.status(404).json({ message: 'Subject not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.subject = subject;
    next();
};

// --- 1. GET ALL SUBJECTS (Used by AttendancePage) ---
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find().select('-__v');
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving subjects', error: err.message });
    }
});

// --- 2. POST NEW SUBJECT (Used by AddSubjectForm) ---
router.post('/subjects', async (req, res) => {
    // FIX: Generate a unique code to prevent the E11000 duplicate key error 
    // caused by a unique index on 'code' when the code field is not provided.
    const uniqueCode = 'SUB-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const subject = new Subject({
        name: req.body.name,
        targetAttendance: req.body.targetAttendance || 75, // Default to 75%
        totalClasses: 0, 
        attendedClasses: 0,
        code: uniqueCode // Include the unique code to prevent the E11000 error
    });

    try {
        const newSubject = await subject.save();
        res.status(201).json(newSubject);
    } catch (err) {
        // Logging the full error message to the console for easier debugging
        console.error("Subject Creation Error:", err.message); 
        res.status(400).json({ message: 'Error creating subject. Name may already exist or required fields are missing.', error: err.message });
    }
});

// --- 3. GET SUBJECT DETAIL AND HISTORY (Used by SubjectDetailPage) ---
router.get('/subjects/:id', getSubject, async (req, res) => {
    try {
        // Fetch all attendance records associated with this subject ID
        const records = await AttendanceRecord.find({ subjectId: req.params.id }).select('-__v');
        
        // Return both the subject object and the records array
        res.json({
            subject: res.subject,
            records: records
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving subject details', error: err.message });
    }
});


// --- 4. DELETE SUBJECT AND HISTORY (Used by SubjectDetailPage) ---
router.delete('/subjects/:id', getSubject, async (req, res) => {
    try {
        // 1. Delete the subject itself
        await Subject.deleteOne({ _id: req.params.id });

        // 2. Delete all associated attendance records
        await AttendanceRecord.deleteMany({ subjectId: req.params.id });
        
        res.json({ message: `Deleted Subject: ${res.subject.name} and all associated records` });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting subject', error: err.message });
    }
});


// --- 5. POST ATTENDANCE RECORD (The core update logic - Used by SubjectSummaryCard) ---
router.post('/attendance', async (req, res) => {
    const { subjectId, status } = req.body;

    if (!subjectId || !status) {
        return res.status(400).json({ message: 'Missing subjectId or status in request body' });
    }

    try {
        // 1. Create a new historical record
        const record = new AttendanceRecord({ subjectId, status });
        await record.save();

        // 2. Atomically update the Subject's totals
        const update = { 
            $inc: { totalClasses: 1 } 
        };

        if (status === 'attended') {
            update.$inc.attendedClasses = 1;
        }

        const updatedSubject = await Subject.findByIdAndUpdate(
            subjectId,
            update,
            { new: true } // Return the updated document
        );

        if (!updatedSubject) {
            return res.status(404).json({ message: 'Subject not found for update' });
        }
        
        res.status(201).json({ message: 'Attendance recorded successfully', record, updatedSubject });

    } catch (err) {
        res.status(500).json({ message: 'Error recording attendance', error: err.message });
    }
});


// --- 6. GET TIMETABLE (Your B.Tech Schedule Data) ---
router.get('/timetable', (req, res) => {
    res.json([
        // Monday
        { id: 1, day: 'Monday', time: '8.45-9.45', subject: 'ML', room: '407' },
        { id: 2, day: 'Monday', time: '9.45-10.35', subject: 'FS', room: '407' },
        { id: 3, day: 'Monday', time: '10.35-11.25', subject: 'OOSE LAB', room: '407' },
        { id: 4, day: 'Monday', time: '11.25-12.15', subject: 'ML', room: '407' },
        // LUNCH
        { id: 5, day: 'Monday', time: '1.05-1.55', subject: 'CPP', room: '407' },
        { id: 6, day: 'Monday', time: '1.55-2.45', subject: 'ECS MODULE 2', room: '407' },
        { id: 7, day: 'Monday', time: '2.45-3.35', subject: 'DWDM', room: '407' },
        
        // Tuesday
        { id: 8, day: 'Tuesday', time: '8.45-10.35', subject: 'FS LAB', room: '407' }, // Combined slot
        { id: 9, day: 'Tuesday', time: '10.35-11.25', subject: 'TE', room: '407' },
        { id: 10, day: 'Tuesday', time: '11.25-12.15', subject: 'ML', room: '407' },
        // LUNCH
        { id: 11, day: 'Tuesday', time: '1.05-1.55', subject: 'OOSE', room: '407' },
        { id: 12, day: 'Tuesday', time: '1.55-2.45', subject: 'FS', room: '407' },
        { id: 13, day: 'Tuesday', time: '2.45-3.35', subject: 'TE', room: '407' },

        // Wednesday
        { id: 14, day: 'Wednesday', time: '8.45-9.45', subject: 'ML', room: '407' },
        { id: 15, day: 'Wednesday', time: '9.45-10.35', subject: 'TE', room: '407' },
        { id: 16, day: 'Wednesday', time: '10.35-11.25', subject: 'FS', room: '407' },
        { id: 17, day: 'Wednesday', time: '11.25-12.15', subject: 'DWDM', room: '407' },
        // LUNCH
        { id: 18, day: 'Wednesday', time: '1.05-1.55', subject: 'ML', room: '407' },
        { id: 19, day: 'Wednesday', time: '1.55-2.45', subject: 'ECS MODULE 1', room: '407' },

        // Thursday
        { id: 20, day: 'Thursday', time: '8.45-9.45', subject: 'DWDM', room: '407' },
        { id: 21, day: 'Thursday', time: '9.45-10.35', subject: 'CPP', room: '407' },
        { id: 22, day: 'Thursday', time: '10.35-11.25', subject: 'QA', room: '407' },
        // LUNCH
        { id: 23, day: 'Thursday', time: '1.05-1.55', subject: 'FS', room: '407' },
        { id: 24, day: 'Thursday', time: '1.55-2.45', subject: 'OOSE', room: '407' },
        { id: 25, day: 'Thursday', time: '2.45-3.35', subject: 'ECS MODULE 2', room: '407' },
        
        // Friday
        { id: 26, day: 'Friday', time: '8.45-10.35', subject: 'ML LAB', room: '407' }, // Combined slot
        { id: 27, day: 'Friday', time: '10.35-12.15', subject: 'CPP LAB', room: '407' }, // Combined slot
        // LUNCH
        { id: 28, day: 'Friday', time: '1.05-1.55', subject: 'DWDM', room: '407' },
        { id: 29, day: 'Friday', time: '1.55-2.45', subject: 'ML', room: '407' },
        { id: 30, day: 'Friday', time: '2.45-3.35', subject: 'FS', room: '407' },
    ]);
});


module.exports = router;
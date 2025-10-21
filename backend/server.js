// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// The MONGO_URI is now read directly from your .env file
const MONGO_URI = process.env.MONGO_URI; 

// Check if the URI was loaded successfully
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined. Please check your .env file.");
    process.exit(1);
}

// --- Middleware Setup ---

// 1. CORS: Allows the React frontend (e.g., http://localhost:3000) to communicate with this API
const corsOptions = {
    // *** FIX: Changed origin from 3001 to 3000 ***
    origin: 'https://fullstack-l75a.vercel.app/', 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// 2. Body Parser: Used to parse incoming JSON payloads from the frontend
app.use(express.json());


// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process if connection fails
    });

// --- Routes ---
// All routes defined in attendanceRoutes will be prefixed with /api
app.use('/api', attendanceRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.send('Attendance Tracker API is Running!');
});

// --- Server Start ---
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

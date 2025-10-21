// src/services/attendanceApi.js

import axios from 'axios';

// Base URL for the Express backend (Update this if your backend uses a different port)
const API_URL = 'https://fullstack-ebx8.onrender.com';

// --- SUBJECTS & ATTENDANCE ---

/**
 * Fetches all subjects and their attendance data.
 */
export const getSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/subjects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

/**
 * Records attendance (attended or missed) for a subject.
 */
export const recordAttendance = async (subjectId, status) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, {
      subjectId,
      status,
      date: new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error recording attendance:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds a new subject to the database.
 */
export const addSubject = async (subjectData) => {
  try {
    const response = await axios.post(`${API_URL}/subjects`, subjectData);
    return response.data;
  } catch (error) {
    console.error("Error adding subject:", error.response?.data || error.message);
    throw error;
  }
};


// --- TIMETABLE ---

/**
 * Fetches the entire weekly class schedule.
 */
export const getTimetable = async () => {
  try {
    const response = await axios.get(`${API_URL}/timetable`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
};
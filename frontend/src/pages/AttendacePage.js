// src/pages/AttendancePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getSubjects, recordAttendance } from '../services/attendanceApi';
import SubjectSummaryCard from '../components/Attendance/SubjectSummaryCard';

const AttendancePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getSubjects();
        setSubjects(data);
    } catch (error) {
        console.error("Failed to load subjects:", error);
        // Optionally show an error message to the user
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Handler for recording attendance
  const handleRecordAttendance = async (subjectId, status) => {
    try {
      // 1. Send the record to the backend
      await recordAttendance(subjectId, status);
      
      // 2. Re-fetch subjects to update the UI with new counts
      // This ensures the calculated percentage is accurate based on the server's data
      fetchSubjects(); 
    } catch (error) {
      alert(`Failed to record attendance. Check console for details.`);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Loading subjects...</div>;
  }

  return (
    <div>
      <h2>Your Current Attendance Overview</h2>
      <div style={cardGridStyle}>
        {subjects.map(subject => (
          <SubjectSummaryCard
            key={subject._id}
            subject={subject}
            onRecord={handleRecordAttendance}
          />
        ))}
        {subjects.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                No subjects found. Please use the "+ Subject" link to add your courses!
            </p>
        )}
      </div>
    </div>
  );
};

const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '20px'
};

export default AttendancePage;
import React, { useState, useEffect } from 'react';
import { getTimetable } from '../services/attendanceApi';
import TimetableGrid from '../components/Timetable/TimetableGrid'; // <-- New Import

const TimetablePage = () => {
    const [schedule, setSchedule] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const data = await getTimetable();
                setSchedule(data);
            } catch (error) {
                console.error("Failed to load timetable:", error);
            }
            setLoading(false);
        };
        fetchSchedule();
    }, []);

    return (
        <div>
            <h2>Weekly Timetable</h2>
            {loading ? (
                <p>Loading schedule...</p>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {schedule.length > 0 ? (
                        // <-- Now rendering the imported component
                        <TimetableGrid schedule={schedule} />
                    ) : (
                        <p style={{textAlign: 'center', padding: '50px'}}>
                            No timetable entries found. (Backend is currently returning mock data).
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimetablePage;

import React from 'react';

const TimetableGrid = ({ schedule }) => {
    // Define the structure of the timetable grid
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Group schedule entries by day for easy rendering
    const scheduleByDay = days.reduce((acc, day) => {
        acc[day] = schedule.filter(item => item.day === day)
                           .sort((a, b) => a.time.localeCompare(b.time));
        return acc;
    }, {});

    return (
        <div style={gridContainerStyle}>
            {days.map(day => (
                <div key={day} style={dayColumnStyle}>
                    <h3 style={dayHeaderStyle}>{day}</h3>
                    <div style={classesContainerStyle}>
                        {scheduleByDay[day].length > 0 ? (
                            scheduleByDay[day].map(item => (
                                <div key={item._id || item.id} style={classCardStyle}>
                                    <p style={subjectTextStyle}>{item.subject}</p>
                                    <p style={timeTextStyle}>{item.time}</p>
                                    {/* --- ADDED ROOM NUMBER DISPLAY --- */}
                                    <p style={roomTextStyle}>Room: {item.room}</p>
                                    {/* ---------------------------------- */}
                                </div>
                            ))
                        ) : (
                            <p style={noClassesStyle}>No classes</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Inline Styles for Aesthetics and Responsiveness ---

const gridContainerStyle = {
    display: 'grid',
    // Responsive grid: 2 columns on small screens, 4 on medium, 7 on large
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', // Slightly wider columns
    gap: '15px',
    padding: '10px',
};

const dayColumnStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    minHeight: '200px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const dayHeaderStyle = {
    margin: 0,
    padding: '10px 15px',
    backgroundColor: '#2c3e50', // Dark header
    color: 'white',
    fontSize: '1.1em',
    textAlign: 'center',
};

const classesContainerStyle = {
    padding: '10px',
};

const classCardStyle = {
    backgroundColor: '#ecf0f1', // Light gray background
    borderLeft: '4px solid #3498db', // Blue accent
    borderRadius: '4px',
    padding: '10px',
    marginBottom: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const subjectTextStyle = {
    fontWeight: 'bold',
    margin: '0 0 3px 0',
    color: '#333',
};

const timeTextStyle = {
    fontSize: '0.9em',
    color: '#555',
    margin: '0 0 3px 0',
};

const roomTextStyle = {
    fontSize: '0.9em',
    color: '#e74c3c', // Red accent for room
    fontWeight: 'bold',
    margin: 0,
};

const noClassesStyle = {
    fontSize: '0.9em',
    color: '#888',
    textAlign: 'center',
    padding: '20px 0',
};

export default TimetableGrid;
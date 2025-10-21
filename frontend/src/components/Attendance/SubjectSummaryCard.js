// src/components/Attendance/SubjectSummaryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const TARGET_PERCENTAGE = 75;

const SubjectSummaryCard = ({ subject, onRecord }) => {
  const { _id, name, totalClasses = 0, attendedClasses = 0 } = subject;
  
  // --- Calculation Logic ---
  const currentPercentage = totalClasses === 0 
    ? 0 
    : (attendedClasses / totalClasses) * 100;
  
  let statusText = '';
  let statusColor = '';

  if (currentPercentage >= TARGET_PERCENTAGE) {
    // Math to see how many classes can be bunked while staying at 75%
    // Formula: (4 * attendedClasses - 3 * totalClasses) / 3
    const maxBunks = Math.floor((4 * attendedClasses - 3 * totalClasses) / 3);
    statusText = `👍 Safe! You can bunk ${Math.max(0, maxBunks)} more classes.`;
    statusColor = 'darkgreen';
  } else {
    // Math to see how many classes must be attended to reach 75%
    // Formula: (3 * totalClasses - 4 * attendedClasses) / 1
    const mustAttend = Math.ceil((3 * totalClasses - 4 * attendedClasses) / 1);
    statusText = `🚨 Critical! Must attend ${Math.max(1, mustAttend)} classes to reach ${TARGET_PERCENTAGE}%.`;
    statusColor = 'darkred';
  }

  return (
    <div style={cardStyle}>
      <Link to={`/subject/${_id}`} style={titleLinkStyle}>
        <h3>{name}</h3>
      </Link>
      
      <p>Classes Attended: <strong>{attendedClasses}</strong> / Total: <strong>{totalClasses}</strong></p>
      
      <h4 style={{ color: currentPercentage >= TARGET_PERCENTAGE ? 'green' : 'red' }}>
        Current Percentage: {currentPercentage.toFixed(1)}%
      </h4>
      <p style={{ fontWeight: 'bold', color: statusColor, minHeight: '40px' }}>{statusText}</p>

      <div style={buttonGroupStyle}>
        <button 
          style={attendButtonStyle} 
          onClick={() => onRecord(_id, 'attended')}
        >
          ✅ Attended
        </button>
        <button 
          style={missButtonStyle} 
          onClick={() => onRecord(_id, 'missed')}
        >
          ❌ Missed
        </button>
      </div>
    </div>
  );
};

// Simple inline styles for demonstration
const cardStyle = {
  border: '1px solid #ddd',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const titleLinkStyle = {
    textDecoration: 'none',
    color: '#333'
}

const buttonGroupStyle = {
    marginTop: '15px',
    display: 'flex',
    gap: '10px'
};

const commonButtonStyle = {
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    flex: 1,
    fontWeight: 'bold'
};

const attendButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
    border: '1px solid #388e3c'
};

const missButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    border: '1px solid #d32f2f'
};

export default SubjectSummaryCard;
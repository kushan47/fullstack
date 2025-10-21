// src/pages/SubjectDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Base URL for the Express backend
const API_URL = 'http://localhost:5000/api';

// --- API Functions specific to detail page ---
const getSubjectDetails = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/subjects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for subject ${id}:`, error);
        throw new Error("Could not fetch subject details.");
    }
};

const deleteSubject = async (id) => {
    try {
        await axios.delete(`${API_URL}/subjects/${id}`);
    } catch (error) {
        console.error(`Error deleting subject ${id}:`, error);
        throw new Error("Could not delete subject.");
    }
};
// ----------------------------------------------


const SubjectDetailPage = () => {
    const { id: subjectId } = useParams();
    const navigate = useNavigate();
    
    const [subject, setSubject] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Assume the backend returns { subject: {...}, records: [...] }
            const data = await getSubjectDetails(subjectId);
            setSubject(data.subject);
            setRecords(data.records.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sort descending by date
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete the subject "${subject.name}" and all its attendance records?`)) {
            try {
                await deleteSubject(subjectId);
                alert(`${subject.name} deleted successfully!`);
                navigate('/'); // Redirect back to the main attendance page
            } catch (err) {
                alert(`Failed to delete subject: ${err.message}`);
            }
        }
    };

    if (loading) {
        return <div style={containerStyle}>Loading subject details...</div>;
    }

    if (error) {
        return <div style={{ ...containerStyle, color: 'red' }}>Error: {error}</div>;
    }

    if (!subject) {
        return <div style={containerStyle}>Subject not found.</div>;
    }

    // Calculation for display
    const currentPercentage = subject.totalClasses === 0 
        ? 0 
        : (subject.attendedClasses / subject.totalClasses) * 100;
        
    const isGood = currentPercentage >= subject.targetAttendance;
    
    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2>{subject.name} Details</h2>
                <button style={deleteButtonStyle} onClick={handleDelete}>
                    🗑️ Delete Subject
                </button>
            </div>

            <div style={statsGridStyle}>
                <StatBox title="Current %" value={`${currentPercentage.toFixed(1)}%`} color={isGood ? '#10b981' : '#ef4444'} />
                <StatBox title="Attended" value={subject.attendedClasses} color="#3b82f6" />
                <StatBox title="Total Classes" value={subject.totalClasses} color="#f59e0b" />
                <StatBox title="Target %" value={`${subject.targetAttendance}%`} color="#8b5cf6" />
            </div>

            <h3 style={historyHeaderStyle}>Attendance History ({records.length})</h3>
            
            <div style={tableContainerStyle}>
                <table style={tableStyle}>
                    <thead style={tableHeadStyle}>
                        <tr>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Status</th>
                            {/* You could add an action column here to allow toggling status or deletion */}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={record._id || index} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                                <td style={tdStyle}>{new Date(record.date).toLocaleDateString()}</td>
                                <td style={{ ...tdStyle, color: record.status === 'attended' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                    {record.status === 'attended' ? 'Attended' : 'Missed'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {records.length === 0 && <p style={{textAlign: 'center', color: '#777'}}>No attendance records found for this subject.</p>}
        </div>
    );
};

// Reusable StatBox component
const StatBox = ({ title, value, color }) => (
    <div style={{ ...statBoxStyle, borderLeft: `5px solid ${color}` }}>
        <p style={statTitleStyle}>{title}</p>
        <p style={statValueStyle}>{value}</p>
    </div>
);

// --- Styling ---

const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px'
};

const deleteButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
};

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
};

const statBoxStyle = {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const statTitleStyle = {
    fontSize: '0.9rem',
    color: '#6b7280',
    margin: '0 0 5px 0',
    textTransform: 'uppercase'
};

const statValueStyle = {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: 0
};

const historyHeaderStyle = {
    marginTop: '30px',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px'
};

const tableContainerStyle = {
    overflowX: 'auto',
    marginBottom: '20px',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 5px',
    fontSize: '1rem',
    minWidth: '300px'
};

const tableHeadStyle = {
    backgroundColor: '#e5e7eb',
    textAlign: 'left'
};

const thStyle = {
    padding: '12px 15px',
    fontWeight: '600'
};

const tdStyle = {
    padding: '12px 15px',
};

const rowEvenStyle = {
    backgroundColor: '#fff',
};

const rowOddStyle = {
    backgroundColor: '#f9f9f9',
};


export default SubjectDetailPage;
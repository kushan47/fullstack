// src/components/forms/AddSubjectForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addSubject } from '../../services/attendanceApi.js';

// The 'isPage' prop is now correctly destructured here.
const AddSubjectForm = ({ isPage = false }) => { 
    const [name, setName] = useState('');
    const [targetAttendance, setTargetAttendance] = useState(75);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!name) {
            setMessage('Subject name is required.');
            return;
        }

        try {
            const newSubject = { name, targetAttendance: Number(targetAttendance) };
            await addSubject(newSubject);
            
            setMessage(`Subject '${name}' added successfully!`);
            setName('');
            
            // Redirect to the attendance page after a successful addition
            if (isPage) {
                setTimeout(() => navigate('/'), 1000); 
            }
            
        } catch (error) {
            setMessage(`Failed to add subject: ${error.message}`);
        }
    };

    // The style object now correctly uses the 'isPage' prop, which is defined above.
    const formContainerStyle = {
        maxWidth: '500px',
        margin: isPage ? '20px auto' : '0 auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
    };


    return (
        <div style={formContainerStyle}>
            <h2>{isPage ? "Add New Subject" : "Quick Add Subject"}</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
                
                <div style={inputGroupStyle}>
                    <label htmlFor="name" style={labelStyle}>Subject Name:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label htmlFor="target" style={labelStyle}>Target Attendance (%):</label>
                    <input
                        id="target"
                        type="number"
                        min="50"
                        max="100"
                        value={targetAttendance}
                        onChange={(e) => setTargetAttendance(e.target.value)}
                        style={inputStyle}
                    />
                </div>
                
                <button type="submit" style={buttonStyle}>Add Subject</button>
            </form>

            {message && (
                <p style={{ marginTop: '15px', color: message.includes('Failed') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

// Simple inline styles
const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
};

const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
};

const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555'
};

const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const buttonStyle = {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
};

export default AddSubjectForm;

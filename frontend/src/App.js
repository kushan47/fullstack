// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AttendancePage from './pages/AttendacePage';
import TimetablePage from './pages/TimeTablePage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import AddSubjectForm from './components/forms/AddSubjectForm';

const App = () => {
  return (
    <Router>
      <header style={headerStyle}>
        <h1>Attendance Tracker ⏰</h1>
        <nav>
          <Link to="/" style={linkStyle}>Attendance</Link>
          <Link to="/timetable" style={linkStyle}>Timetable</Link>
          <Link to="/add-subject" style={linkStyle}>+ Subject</Link>
        </nav>
      </header>
      <main style={mainStyle}>
        <Routes>
          <Route path="/" element={<AttendancePage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/add-subject" element={<AddSubjectForm isPage={true} />} />
          <Route path="/subject/:id" element={<SubjectDetailPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </main>
    </Router>
  );
};

// Simple inline styles for demonstration
const headerStyle = {
  background: '#333',
  color: '#fff',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '10px 15px',
  marginLeft: '10px',
  border: '1px solid #555',
  borderRadius: '4px',
};

const mainStyle = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invitation from './pages/Invitation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
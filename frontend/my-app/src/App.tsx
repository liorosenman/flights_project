import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComp from '../src/components/Login/LoginComp.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginComp />} />
      </Routes>
    </Router>
  );
};

export default App;

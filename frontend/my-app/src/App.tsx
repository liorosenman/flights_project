import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComp from '../src/components/Login/LoginComp.tsx';
import Users from './pages/Users.tsx';
import ClientPg from './components/clientPg.tsx';
import AirlinePg from './components/airlinePg.tsx';
import CreateCustomer from './components/createusers/CreateCustomer.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginComp />} />
        <Route path="/users" element={<Users />} />
        <Route path="/clients" element={<ClientPg />} />
        <Route path="/airlines" element={<AirlinePg />} />
        <Route path="/createcustomer" element={<CreateCustomer />} />

      </Routes>
    </Router>
  );
};

export default App;

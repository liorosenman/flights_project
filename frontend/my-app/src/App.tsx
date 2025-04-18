import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComp from '../src/components/Login/LoginComp.tsx';
import Users from './pages/Users.tsx';
import ClientPg from './components/clientPg.tsx';
import AirlinePg from './components/airlinePg.tsx';
import CreateCustomer from './components/createusers/CreateCustomerComp.tsx';
import CreateAirline from './components/createusers/CreateAirlineComp.tsx';
import CreateAdmin from './components/createusers/CreateAdminComp.tsx';
import CreateFlightComp from './components/airline/CreateFlightComp.tsx';
import FlightsBoard from './components/Flight/FlightsBoard.tsx';
import { useAppSelector } from './app/hooks.ts';


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
        <Route path="/createairline" element={<CreateAirline />} />
        <Route path="/createadmin" element={<CreateAdmin />} />
        <Route path="/createflight" element={<CreateFlightComp />} />
        <Route path="/flightsboard" element = {<FlightsBoard />} />
                      


      </Routes>
    </Router>
  );
};

export default App;

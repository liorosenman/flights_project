import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComp from '../src/components/Login/LoginComp.tsx';
import Users from './pages/Users.tsx';
import ClientPg from './components/clientPg.tsx';
// import AirlinePg from './components/users/airline/';
import CreateCustomer from './components/createusers/CreateCustomerComp.tsx';
import CreateAirline from './components/createusers/CreateAirlineComp.tsx';
import CreateAdmin from './components/createusers/CreateAdminComp.tsx';
import CreateFlightComp from './components/users/airline/CreateFlightComp.tsx';
import FlightsBoard from './components/Flight/FlightsBoard.tsx';
import { useAppSelector } from './app/hooks.ts';
import TicketsList from './components/ticket/TicketsList.tsx';
import CustomerTable from './components/users/customers/CustomerTable.tsx';
import MenuLayout from './components/Menu/MainLayout.tsx';
import AdminsTable from './components/users/admins/AdminsTable.tsx';
import AirlinesTable from './components/users/airline/AirlinesTable.tsx';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginComp />} />

        {/* Protected routes inside MenuLayout */}
        {/* <Route element={<MenuLayout />}></Route>
      <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route element={<MenuLayout />}>
        <Route path="/login" element={<LoginComp />} />
        <Route path="/users" element={<Users />} />
        <Route path= "/adminslist" element={<AdminsTable/>}/>
        <Route path="/airlineslist" element={<AirlinesTable />} />
        <Route path="/createcustomer" element={<CreateCustomer />} />
        <Route path="/createairline" element={<CreateAirline />} />
        <Route path="/createadmin" element={<CreateAdmin />} />
        <Route path="/createflight" element={<CreateFlightComp />} />
        <Route path="/flightsboard" element = {<FlightsBoard />} />
        <Route path="/ticketslist" element = {<TicketsList />} />
        <Route path="/customerslist" element = {<CustomerTable />} />
        <Route path="/adminslist" element = {<AdminsTable />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

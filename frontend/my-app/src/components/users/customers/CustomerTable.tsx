import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCustomers, removeCustomer, selectCustomerState, setTargetCustomerId } from './customersSlice.tsx';
import Menu from '../../Menu/menuComp.tsx';
import { clearCustomerState } from './customersSlice.tsx'
import { clearAirlineState } from '../airline/airlineSlicer.tsx';
import { clearAdminState } from '../admins/adminsSlice.tsx';
import { clearUsersStates } from '../admins/UserManagerComp.tsx';

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, loading, error, successMsg, targetCustomerId } = useAppSelector(selectCustomerState);
  const [search, setSearch] = useState('');


  useEffect(() => {
    clearUsersStates(dispatch);
    dispatch(fetchCustomers());
  }, []);

  const handleRemoveCustomer = async (e: React.MouseEvent, customerId: number) => {
    e.preventDefault();
    dispatch(clearCustomerState())
    dispatch(setTargetCustomerId(customerId))
    try {
      await dispatch(removeCustomer(customerId)).unwrap();
      // await dispatch(getMyFlights({ token }));
      // dispatch(setTargetFlightId(null))
    } catch (error) {
      console.error("Customer removal failed.", error);
    }
  };

  // const filteredCustomers = customers.filter(c =>
  //   c.first_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.last_name.toLowerCase().includes(search.toLowerCase()) ||
  //   c.username.toLowerCase().includes(search.toLowerCase())
  // );

  return (
    <div>
      <h2>Customers List</h2>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Airport ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <React.Fragment key={c.id}>
              <tr>
                <td>{c.id}</td>
                <td>{c.username}</td>
                <td>{c.first_name}</td>
                <td>{c.last_name}</td>
                <td>{c.address}</td>
                <td>{c.phone_no}</td>
                <td>{c.email}</td>
                <td>{c.airport_id}</td>
                <td>{c.status ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={(e) => handleRemoveCustomer(e, c.id)}>DELETE</button>
                </td>
              </tr>
              {(targetCustomerId === c.id) && (error || successMsg) && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
                    {error
                      ? (typeof error === 'object' && error !== null ? (error as any).message : error)
                      : (typeof successMsg === 'object' && successMsg !== null ? (successMsg as any).message : successMsg)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;

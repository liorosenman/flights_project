import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCustomers, removeCustomer, selectCustomerState, setTargetCustomerId } from './customersSlice.tsx';
import Menu from '../../Menu/menuComp.tsx';
import {clearCustomerState} from './customersSlice.tsx'

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, loading, error, successMsg, targetCustomerId, isfiltered } = useAppSelector(selectCustomerState);
  const [search, setSearch] = useState('');
  

  useEffect(() => {
    dispatch(fetchCustomers());
  }, []);

  const handleRemoveCustomer = async (e: React.MouseEvent, customerId: number) => {
    e.preventDefault();
    dispatch(clearCustomerState())
    dispatch(setTargetCustomerId(customerId))
    try {
      console.log('AAAAAAAAAAAAAAAAAAAAAAA');
      
      await dispatch(removeCustomer(customerId)).unwrap();
      // await dispatch(getMyFlights({ token }));
      // dispatch(setTargetFlightId(null))
    } catch (error) {
      console.error("Customer removal failed.", error);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.first_name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Customers List Long Long List</h2>
      <input
        type="text"
        placeholder="Search by name or username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
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
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(c => (
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

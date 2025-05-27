import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCustomers, getCustomerByUserId, getCustomerByUsername, removeCustomer, selectCustomerState, setTargetCustomerId } from './customersSlice.tsx';
import { clearCustomerState } from './customersSlice.tsx'
import { clearUsersStates } from '../admins/UserManagerComp.tsx';
import '../../../App.css'
import { selectLoginState } from '../../Login/loginSlice.tsx';

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, error, successMsg, targetCustomerId } = useAppSelector(selectCustomerState);
  const { roleId } = useAppSelector(selectLoginState);

  useEffect(() => {
    clearUsersStates(dispatch);
    dispatch(fetchCustomers());
  }, []);

  const handleRemoveCustomer = async (e: React.MouseEvent, customerId: number) => {
    e.preventDefault();
    // dispatch(clearCustomerState())
    dispatch(setTargetCustomerId(customerId))
    try {
      await dispatch(removeCustomer(customerId)).unwrap();
      if (customers.length === 1) {
        await dispatch(getCustomerByUsername(customers[0].username))
      } else {
        await dispatch(fetchCustomers());
      }
      // await dispatch(fetchCustomers());

    } catch (error) {
      console.error("Customer removal failed.", error);
    }
  };

  return (
    <div>
      <h1 className='heading-thin-center'>Customers</h1>
      <table className="table table-bordered table-striped table-hover flight-table bg-white mx-auto text-center" style={{ width: '90%' }}>
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
            <th>Action</th>
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
                <td>{c.status ? <button className='remove-user-btn' onClick={(e) => handleRemoveCustomer(e, c.id)}>REMOVE</button> : 'Inactive'}</td>
              </tr>
              {(targetCustomerId === c.id) && (error || successMsg) && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      fontSize: '22px',
                      color: error ? 'red' : 'green',
                      fontWeight: 'bold'
                    }}
                  >
                    {error || successMsg}
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

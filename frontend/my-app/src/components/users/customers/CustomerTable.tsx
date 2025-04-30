// features/users/customer/CustomerTable.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchCustomers } from './customersSlice.tsx';
import Menu from '../../Menu/menuComp.tsx';

const CustomerTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, loading, error } = useAppSelector(state => state.customer);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

//   const handleDelete = (id: number) => {
//     if (window.confirm('Are you sure you want to delete this customer?')) {
//       dispatch(removeCustomer(id));
//     }
//   };

//   const filteredCustomers = customers.filter(c =>
//     c.first_name.toLowerCase().includes(search.toLowerCase()) ||
//     c.last_name.toLowerCase().includes(search.toLowerCase()) ||
//     c.username.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Customers List</h2>
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
            <th>First</th>
            <th>Last</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Airport ID</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>     
              <td>{c.id}</td>
              <td>{c.username}</td>
              <td>{c.first_name}</td>
              <td>{c.last_name}</td>
              <td>{c.address}</td>
              <td>{c.phone_no}</td>
              <td>{c.email}</td>
              <td>
                <button>Future Del Btn</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign: 'center' }}>No customers found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;

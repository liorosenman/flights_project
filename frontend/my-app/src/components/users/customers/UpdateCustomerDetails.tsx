import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { clearCustomerState, getCustomerByUsername, selectCustomerState, updateCustomer } from './customersSlice.tsx';
import { fetchCustomers } from './customersSlice.tsx';
import { selectLoginState } from '../../Login/loginSlice.tsx';

const UpdateCustomerDetails = () => {

const [formData, setFormData] = useState({
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    phone_no: '',
    credit_card_no: '',
});

useEffect(() => {
    dispatch(clearCustomerState())
    console.log("THE USERNAME IS ", username);
    
    if (username) {
        dispatch(getCustomerByUsername(username)); // Getting a single customer.
        console.log(customer);
    if (customer) 
      setFormData({
        password: '', // leave blank for security
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        address: customer.address,
        phone_no: customer.phone_no.toString(),
        credit_card_no: customer.credit_card_no.toString(),
      });
    }
  }, []);


const dispatch = useAppDispatch();
const { loading, error, successMsg, customer } = useAppSelector(selectCustomerState);
const { username } = useAppSelector(selectLoginState);
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!formData.password.trim()) {
            delete (payload as any).password;
        }
        console.log(payload);
        await dispatch(updateCustomer(payload));
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
                <div key={field}>
                    <label>{field.replace('_', ' ').toUpperCase()}</label>
                    <input
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== 'password'}
                    />
                </div>
            ))}
            <button type="submit">Update</button>
            {loading && <p>Loading</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>} 

        </form>
        </div>
    );
}

export default UpdateCustomerDetails
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { clearCustomerState, getCustomerByUsername, selectCustomerState, updateCustomer } from './customersSlice.tsx';
import { useLocation } from 'react-router-dom';
import './styles.css';

const UpdateCustomerDetails = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { loading, error, successMsg, customer } = useAppSelector(selectCustomerState);
    const username = localStorage.getItem('username');

    const [formData, setFormData] = useState({
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        phone_no: '',
        credit_card_no: '',
    });

    // Fetch customer data whenever the component mounts or the location changes
    useEffect(() => {
        dispatch(clearCustomerState())
        if (username) {
            dispatch(getCustomerByUsername(username)); // Getting a single customer.
        }
    }, [dispatch, username, location.key]); // Add location.key to dependencies to refresh on navigation

    // Update form data when customer data changes
    useEffect(() => {
        if (customer) {
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
    }, [customer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        if (!formData.password.trim()) {
            delete (payload as any).password;
        }
        await dispatch(updateCustomer(payload));
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((field) => (
                    <div key={field} className="form-group">
                        <label htmlFor={field}>{field.replace('_', ' ').toUpperCase()}</label>
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required={field !== 'password'}
                        />
                    </div>
                ))}
                <button className="btn btn-light update-btn" type="submit" style={{ marginLeft: '0', fontSize: '1.2rem', padding: '0.6rem 1.2rem' }}
                >Update
                </button>
                {loading && <p>Loading</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
            </form>

        </div>
    );
}

export default UpdateCustomerDetails
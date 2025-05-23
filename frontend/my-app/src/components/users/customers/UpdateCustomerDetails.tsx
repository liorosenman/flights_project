import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { clearCustomerState, getCustomerByUserId, getCustomerByUsername, selectCustomerState, updateCustomer } from './customersSlice.tsx';
import { useLocation } from 'react-router-dom';
import './styles.css';

const UpdateCustomerDetails = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { loading, error, successMsg, customer } = useAppSelector(selectCustomerState);
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('access_token')
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
    const fetchCustomer = async () => {
        if (token) {
            dispatch(clearCustomerState());
            await dispatch(getCustomerByUserId(token));
        } else {
            console.error("Token is must.");
        }
    };
    fetchCustomer();
}, []);



    useEffect(() => {
        console.log("The first name is ", customer?.first_name || 'not good');
        
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
                <button className="btn btn-light update-btn" type="submit" style={{ fontSize: '1.2rem', padding: '0.6rem 1.2rem' }}
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
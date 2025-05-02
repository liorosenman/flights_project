// src/components/SignupForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer, selectUserState} from './createUserSlicer.tsx'
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { AppDispatch } from '../../app/store.ts';
import Menu from '../Menu/menuComp.tsx';

const CustomerSignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        phone_no: '',
        credit_card_no: '',
    });

    const dispatch = useAppDispatch();
    const {error, loading, successMessage } = useAppSelector(selectUserState);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createCustomer(formData));
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
                        required
                    />
                </div>
            ))}
            <button type="submit">Signup</button>
            {loading && <p>Signing up...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} 

        </form>
        </div>
    );
};

export default CustomerSignupForm;

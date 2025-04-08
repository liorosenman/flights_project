// src/components/SignupForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCustomer, selectUserSucMsg } from './createUserSlicer.tsx'
import { selectUserLoading, selectUserError } from './createUserSlicer.tsx'

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

    //   const { loading, error } = useSelector((state) => state.customer);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);
    const SuccessMsg = useSelector(selectUserSucMsg);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(await createCustomer(formData));
    };

    return (
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
            {loading && <p>Signing up...</p>}

            {error && <p style={{ color: 'red' }}>{error.message}</p>}
            <button type="submit">Signup</button>
        </form>
    );
};

export default CustomerSignupForm;

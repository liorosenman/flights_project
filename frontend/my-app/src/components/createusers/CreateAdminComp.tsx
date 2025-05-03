import React, { useEffect, useState } from 'react';
import { createAdmin, createAirline, selectUserState } from './createUserSlicer.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../countries/countrySlicer.tsx';
import { Country } from '../../models/country.ts';
import { AppDispatch } from '../../app/store.ts';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';

const AdminForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
    });

    const { error, loading, successMessage } = useAppSelector(selectUserState);
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createAdmin(formData));
    };

    return (
        <form className="centered-form" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Admin Sign-up</h2>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Submit</button>
            {loading && <p>Signing up...</p>}
            {error && <p className='single-object-error '>{error}</p>}
            {successMessage && <p className='single-object-confirm'>{successMessage}</p>}
        </form>
    );
};

export default AdminForm;

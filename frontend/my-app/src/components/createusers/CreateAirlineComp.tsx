import React, { useState } from 'react';
import { createAirline, selectUserState } from './createUserSlicer.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useSelector } from 'react-redux';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        country: '',
    });

    // const countries = ['USA', 'canada', 'UK', 'Germany', 'France', 'India']; 
    
    const countryError = useAppSelector((state) => state.country.error);

    const dispatch = useAppDispatch();
    const { error, loading, successMessage } = useAppSelector(selectUserState);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createAirline(formData));
        console.log('Submitted data:', formData);
        // You can send this data to your backend here
    };

    return (
        <form onSubmit={handleSubmit}>
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
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Country:</label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>

            <button type="submit">Submit</button>
            {countryError && <p style={{ color: 'red' }}>Country Error: {countryError}</p>}
            {loading && <p>Signing up...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default CustomerForm;

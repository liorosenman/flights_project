import React, { useEffect, useState } from 'react';
import { clearRegisterResponses, createAirline, selectUserState } from './createUserSlicer.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../countries/countrySlicer.tsx';
import { Country } from '../../models/country.ts';
import { AppDispatch } from '../../app/store.ts';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';
import './styles.css'

const AirlineForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        name: '',
        country_id: '',
    });

    const { error, loading, successMessage } = useAppSelector(selectUserState);
    const countryError = useAppSelector((state) => state.country.error);
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
        await dispatch(createAirline(formData));
    };

    useEffect(() => {
        dispatch(clearRegisterResponses()) // Clear error or success messages.
    }, [])

    return (
        <form className="centered-form" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Airline Sign-up</h2> 
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
                <SelectCountryComp value={formData.country_id} onChange={handleChange} />
            </div>

            <button type="submit">Submit</button>
            {countryError && <p style={{ color: 'red' }}>Country Error: {countryError}</p>}
            {loading && <p className='single-object-waiting'>Signing up...</p>}
            {error && <p className='single-object-error'>{error}</p>}
            {successMessage && <p className='single-object-confirm'>{successMessage}</p>}
        </form>
    );
};

export default AirlineForm;

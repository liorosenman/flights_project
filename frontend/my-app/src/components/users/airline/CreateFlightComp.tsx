import React, { useEffect, useState } from 'react'
import { createFlight, AirlineState, clearMessages } from './airlineSlicer.tsx';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../app/hooks.ts';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { selectLoginState } from '../../Login/loginSlice.tsx';
import SelectCountryComp from '../../countries/SelectCountryComp.tsx';
import './styles.css';

const CreateFlightComp = () => {
  const [formData, setFormData] = useState({
    origin_country_id: '',
    destination_country_id: '',
    departure_time: '',
    landing_time: '',
    remaining_tickets: '',
  });

  const token = useAppSelector((state) => selectLoginState(state).token);
  const { error, loading, successMsg } = useAppSelector((state: RootState) => state.airline);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createFlight(formData));
    
  }

  useEffect(() => {
    dispatch(clearMessages());
  }, [])
  
 
  return (
    <div>
      <form onSubmit={handleSubmit} className="centered-form">
        <h2 className="text-center mb-4">Create Flight</h2>

        <SelectCountryComp
          label="From:"
          value={formData.origin_country_id}
          onChange={(e) => setFormData({ ...formData, origin_country_id: e.target.value })}
        />

        <SelectCountryComp
          label="To:"
          value={formData.destination_country_id}
          onChange={(e) => setFormData({ ...formData, destination_country_id: e.target.value })}
        />

        <div>
          <label>Departure Time:</label>
          <input
            type="datetime-local"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>Landing Time:</label>
          <input
            type="datetime-local"
            name="landing_time"
            value={formData.landing_time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Remaining Tickets:</label>
          <input
            type="number"
            name="remaining_tickets"
            value={formData.remaining_tickets}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button type="submit">Create Flight</button>
        {loading && <p>Processing...</p>}
        {error && <p className='single-object-error '>{error}</p>}
        {successMsg && <p className='single-object-confirm'>{successMsg}</p>}
      </form>
    </div>

  );
}


export default CreateFlightComp;



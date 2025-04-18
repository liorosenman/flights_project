import React, { useState } from 'react'
import { createFlight, selectAirlineState } from './airlineSlicer.tsx';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { } from './airlineSlicer.tsx';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';
import { useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import Menu from '../Menu/menuComp.tsx';

  const CreateFlightComp = () => {
    const [formData, setFormData] = useState({
      origin_country_id: '',
      destination_country_id: '',
      departure_time: '',
      landing_time: '',
      remaining_tickets: '',
    });

    const token = useAppSelector((state) => selectLoginState(state).token);
    const { error, loading, SuccessMessage } = useAppSelector(selectAirlineState);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent) => {
      console.log("BBBBBBBBBBBBBBBBBBBBBBb");
      e.preventDefault();
      await dispatch(createFlight(formData));
    }

      return (
        <div>
          <Menu/>
        <form onSubmit={handleSubmit}>
          <h2>Create Flight</h2>

          <SelectCountryComp
            value={formData.origin_country_id}
            onChange={(e) =>
              setFormData({ ...formData, origin_country_id: e.target.value })
            }
          />

          <SelectCountryComp
            value={formData.destination_country_id}
            onChange={(e) =>
              setFormData({ ...formData, destination_country_id: e.target.value })
            }
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
          {loading && <p>Signing up...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {SuccessMessage && <p style={{ color: 'green' }}>{SuccessMessage}</p>}
        </form>
        </div>
      );
    }
  

  export default CreateFlightComp;



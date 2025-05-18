// SelectCountryComp.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchAirlines } from './airlineSlicer.tsx';

interface Props {
  label: string, 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectAirlineComp: React.FC<Props> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const airlinesList = useAppSelector((state) => state.airline.airlines);
  const loading = useAppSelector((state) => state.airline.loading);

  useEffect(() => {
    dispatch(fetchAirlines());
  }, []);

  return (
    <div>
      <label>Airlines:</label>
      <select name="airline_id" value={value} onChange={onChange} className="form-select" required>
        <option value="">Select Airline</option>
        {loading && <option>Loading...</option>}
        {airlinesList.map((airline) => (
          <option key={airline.id} value={airline.id}>
            {airline.name}
          </option>
        ))}
      </select>
      {loading && <p>Loading countries...</p>}
    </div>
  );
};

export default SelectAirlineComp;

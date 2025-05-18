// SelectCountryComp.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { fetchCountries } from './countrySlicer.tsx';

interface Props {
  label: string, 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectCountryComp: React.FC<Props> = ({ value, onChange }) => {
  const dispatch = useAppDispatch();
  const countryList = useAppSelector((state) => state.country.countries);
  const loading = useAppSelector((state) => state.country.loading);

  useEffect(() => {
    dispatch(fetchCountries());
  }, []);

  return (
    <div>
      <label>Country:</label>
      <select name="country_id" value={value} onChange={onChange} className="form-select" required>
        <option value="">Select Country</option>
        {loading && <option>Loading...</option>}
        {countryList.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      {loading && <p>Loading countries...</p>}
    </div>
  );
};

export default SelectCountryComp;

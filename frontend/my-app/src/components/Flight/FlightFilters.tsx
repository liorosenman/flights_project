
import React, { useState } from 'react';
import { FlightFilterOptions } from '../../models/FlightFilterOptions.ts';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';
import { useAppDispatch } from '../../app/hooks.ts';
import {getFlightById, loadFlights} from './flightSlice.tsx'

interface FlightFiltersProps {
  onFilter: (filters: any) => void; // You can define a better type later
}

const FlightFilters: React.FC<FlightFiltersProps> = ({ onFilter }) => {
  const [selectedOption, setSelectedOption] = useState<FlightFilterOptions>(FlightFilterOptions.GET_ALL_FLIGHTS);
  const [flightId, setFlightId] = useState<number | null>(null);
  const [airlineId, setAirlineId] = useState<number | null>(null);
  const [originCountry, setOriginCountry] = useState<string>('');
  const [destinationCountry, setDestinationCountry] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const dispatch = useAppDispatch();
  const [lastFilters, setLastFilters] = useState<any>(null);

  const handleFilterClick = async () => {

    let filters: any = {};

    switch (selectedOption) {
      case FlightFilterOptions.GET_ALL_FLIGHTS:
        filters = { type: selectedOption };
        break;
      case FlightFilterOptions.GET_FLIGHT_BY_ID:
        if (flightId != null && flightId > 0) {
          filters = { type: selectedOption, flightId };
        }
      case FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID:
        if (airlineId && airlineId > 0) {
          filters = { type: selectedOption, airlineId };
        }
       
        break;
      case FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS:
        if (originCountry && destinationCountry && departureDate) {
          filters = { type: selectedOption, originCountry, destinationCountry, departureDate };
        }
        break;
      case FlightFilterOptions.GET_ARRIVAL_FLIGHTS:
      case FlightFilterOptions.GET_DEPARTURE_FLIGHTS:
        if (country) {
          filters = { type: selectedOption, country };
        }
        break;
      default:
        break;
    }

    onFilter(filters);
  };

  const handlePositiveIntegerInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number | null) => void) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value ? parseInt(value, 10) : null);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value as FlightFilterOptions)}
      >
        {Object.values(FlightFilterOptions).map((option) => (
          <option key={option} value={option}>
            {option.replace(/_/g, ' ').toUpperCase()}
          </option>
        ))}
      </select>

      {/* Dynamic input fields depending on selected option */}
      {selectedOption === FlightFilterOptions.GET_FLIGHT_BY_ID && (
        <input
          type="text"
          placeholder="Enter Flight ID"
          value={flightId !== null ? flightId : ''}
          onChange={(e) => handlePositiveIntegerInput(e, setFlightId)}
        />
      )}

      {selectedOption === FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID && (
        <input
          type="text"
          placeholder="Enter Airline ID"
          value={airlineId !== null ? airlineId : ''}
          onChange={(e) => handlePositiveIntegerInput(e, setAirlineId)}
        />
      )}

      {selectedOption === FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS && (
        <>
          <SelectCountryComp
            label="Origin Country"
            value={originCountry}
            onChange={(e) => setOriginCountry(e.target.value)}
          />
          <SelectCountryComp
            label="Destination Country"
            value={destinationCountry}
            onChange={(e)=> setDestinationCountry(e.target.value)}
          />
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </>
      )}

      {(selectedOption === FlightFilterOptions.GET_ARRIVAL_FLIGHTS ||
        selectedOption === FlightFilterOptions.GET_DEPARTURE_FLIGHTS) && (
        <SelectCountryComp
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      )}

      <button onClick={handleFilterClick} style={{ marginLeft: '10px' }}>
        Filter
      </button>
    </div>
  );
};

export default FlightFilters;

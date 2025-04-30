
import React, { useState } from 'react';
import { FlightFilterOptions } from '../../models/FlightFilterOptions.ts';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';
import { useAppDispatch } from '../../app/hooks.ts';
import { clearFlightState, getFlightById, getFlightsByParameters, loadFlights } from './flightSlice.tsx'
import SelectAirlineComp from '../users/airline/SelectAirlineComp.tsx'
interface FlightFiltersProps {
  onFilter: (filters: any) => void; // You can define a better type later
}

export interface FlightSearchParams {
  origin_country_id: number;
  dest_country_id: number;
  dep_date: string;
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

  interface FlightSearchParams {
    origin_country_id: number;
    dest_country_id: number;
    dep_date: string;
  }

  const handleFilterClick = async () => {

    let filters: any = {};
    dispatch(clearFlightState())
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
          console.log("THESE ARE THE PARAMETERS: ", originCountry, destinationCountry, departureDate);
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

      {selectedOption === FlightFilterOptions.GET_FLIGHT_BY_ID && (
        <input
          type="text"
          placeholder="Enter Flight ID"
          value={flightId !== null ? flightId : ''}
          onChange={(e) => handlePositiveIntegerInput(e, setFlightId)}
        />
      )}

      {selectedOption === FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID && (
        <SelectAirlineComp
          label="Airlines:"
          value={airlineId !== null ? airlineId.toString() : ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setAirlineId(null);
            } else {
              setAirlineId(Number(value));
            }
          }}
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
            onChange={(e) => setDestinationCountry(e.target.value)}
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

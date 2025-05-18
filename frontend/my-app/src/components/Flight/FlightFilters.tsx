
import React, { useState } from 'react';
import { FlightFilterOptions } from '../../models/FlightFilterOptions.ts';
import SelectCountryComp from '../countries/SelectCountryComp.tsx';
import { useAppDispatch } from '../../app/hooks.ts';
import { clearFlights, clearFlightState } from './flightSlice.tsx'
import SelectAirlineComp from '../users/airline/SelectAirlineComp.tsx'
import '../../App.css';

interface FlightFiltersProps {
  onFilter: (filters: any) => void;
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
    dispatch(clearFlights())
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
  <div className="card shadow-sm p-3 mb-4 bg-body rounded w-100">
    <div className="row g-3 align-items-end">

      {/* Filter Option Selector */}
      <div className="col-md-4">
        <label className="form-label fw-semibold">Select Filter Type</label>
        <select
          className="form-select"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value as FlightFilterOptions)}
        >
          {Object.values(FlightFilterOptions).map((option) => (
            <option key={option} value={option}>
              {option.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {selectedOption === FlightFilterOptions.GET_FLIGHT_BY_ID && (
        <div className="col-md-3">
          <label className="form-label fw-semibold">Flight ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Flight ID"
            value={flightId !== null ? flightId : ''}
            onChange={(e) => handlePositiveIntegerInput(e, setFlightId)}
          />
        </div>
      )}

      {selectedOption === FlightFilterOptions.GET_FLIGHTS_BY_AIRLINE_ID && (
        <div className="col-md-4">
          <SelectAirlineComp
            label="Airline"
            value={airlineId !== null ? airlineId.toString() : ''}
            onChange={(e) => {
              const value = e.target.value;
              setAirlineId(value === '' ? null : Number(value));
            }}
          />
        </div>
      )}

      {selectedOption === FlightFilterOptions.GET_FLIGHTS_BY_PARAMETERS && (
        <>
          <div className="col-md-3">
            <SelectCountryComp
              label="Origin Country"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <SelectCountryComp
              label="Destination Country"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Departure Date</label>
            <input
              type="date"
              className="form-control"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>
        </>
      )}

      {(selectedOption === FlightFilterOptions.GET_ARRIVAL_FLIGHTS ||
        selectedOption === FlightFilterOptions.GET_DEPARTURE_FLIGHTS) && (
          <div className="col-md-3">
            <SelectCountryComp
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        )}

      <div className="col-md-auto">
        <button
          className="btn btn-outline-primary px-4 fw-semibold"
          onClick={handleFilterClick}
        >
          Filter
        </button>
      </div>
    </div>
  </div>
)};


export default FlightFilters;

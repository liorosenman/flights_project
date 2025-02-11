// FlightBoard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flight from '../Flight/Flight.tsx';

const FlightBoard = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_all_flights/')
      .then(response => {
        setFlights(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the flights!', error);
      });
  }, []);

  return (
    <div>
      <h1>Flight Board</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Airline</th>
            <th>Origin Country</th>
            <th>Destination Country</th>
            <th>Landing Time</th>
            <th>Departure Time</th>
            <th>Remaining Tickets</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <Flight flight={flight} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlightBoard;

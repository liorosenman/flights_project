// Flight.js
import React from 'react';

const FlightRow = ({ flight })   => {

  

  return (
    <tr>
      <td>{flight.flight_id}</td>
      <td>{flight.airline_name}</td>
      <td>{flight.origin_country_name}</td>
      <td>{flight.destination_country_name}</td>
      <td>{flight.departure_time}</td>
      <td>{flight.landing_time}</td>
      <td>{flight.remaining_tickets}</td>
      <td>{flight.status}</td>
    </tr>
  );
};

export default FlightRow

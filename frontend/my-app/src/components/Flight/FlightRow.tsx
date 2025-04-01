// Flight.js
import React from 'react';

const FlightRow = ({ flight })   => {
  return (
    <tr>
      <td>{flight.id}</td>
      <td>{flight.airline_company_id}</td>
      <td>{flight.origin_country_id}</td>
      <td>{flight.destination_country_id}</td>
      <td>{flight.landing_time}</td>
      <td>{flight.departure_time}</td>
      <td>{flight.remaining_tickets}</td>
    </tr>
  );
};

export default FlightRow

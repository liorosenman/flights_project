import React from 'react';
import {formatDateTime} from '../../utils/DateTimeFormat.ts';
const TicketRow = ({ ticket }) => {

    return (
        <tr>
          <td>{ticket.ticket_id}</td>
          <td>{ticket.flight_id}</td>
          <td>{ticket.origin_country}</td>
          <td>{ticket.destination_country}</td>
          <td>{formatDateTime(ticket.departure_time)}</td>
          <td>{ticket.status}</td>
        </tr>
      );
}

export default TicketRow
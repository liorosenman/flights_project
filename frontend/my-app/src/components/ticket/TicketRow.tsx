import React, { useState } from 'react';
import { formatDateTime } from '../../utils/DateTimeFormat.ts';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import { cancelTicket, getMyTickets } from './ticketSlicer.tsx';

const TicketRow = ({ ticket }) => {
  const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const dispatch = useAppDispatch();
  const [cancelSuccess, setCancelSuccess] = useState<{ [key: number]: string }>({});
  const [cancelError, setCancelError] = useState<{ [key: number]: string }>({});

  const handleRemoval = async (e: React.MouseEvent, ticketId: number) => {
    e.preventDefault();
    setCancelSuccess({});
    setCancelError({});
    try {
      const response = await dispatch(cancelTicket(ticketId)).unwrap();
      console.log(response);
      setCancelSuccess({ [ticketId]: response });
    } catch (error) {
      setCancelError({ [ticketId]: error || 'Failed to cancel ticket.' });
    }
    await dispatch(getMyTickets({ token }));
  };

  return (
    <>
      <tr>
        <td>{ticket.ticket_id}</td>
        <td>{ticket.flight_id}</td>
        <td>{ticket.origin_country}</td>
        <td>{ticket.destination_country}</td>
        <td>{formatDateTime(ticket.departure_time)}</td>
        <td>{ticket.status}</td>
        {roleId === 2 && ticket.status === 'active' && (
          <td>
            <button onClick={(e) => handleRemoval(e, ticket.ticket_id)}>
              Cancel
            </button>
          </td>
        )}
      </tr>

      {(cancelError[ticket.ticket_id] || cancelSuccess[ticket.ticket_id]) && (
        <tr>
          <td colSpan={9} style={{ textAlign: 'center', color: cancelError[ticket.ticket_id] ? 'red' : 'green' }}>
            {cancelError[ticket.ticket_id] || cancelSuccess[ticket.ticket_id]}
          </td>
        </tr>
      )}
    </>
  );
};

export default TicketRow;

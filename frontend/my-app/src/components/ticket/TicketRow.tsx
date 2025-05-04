import React, { useState } from 'react';
import { formatDateTime } from '../../utils/DateTimeFormat.ts';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectLoginState } from '../Login/loginSlice.tsx';
import { cancelTicket, getMyTickets, selectTicketState } from './ticketSlicer.tsx';
import { clearTicketsState } from './ticketSlicer.tsx';
import '../../App.css'

const TicketRow = ({ ticket }) => {
  // const { token, refreshToken, roleId } = useAppSelector(selectLoginState);
  const dispatch = useAppDispatch();
  const { targetTicketId, error, SuccessMessage } = useAppSelector(selectTicketState);
  const token = localStorage.getItem('access_token')
  const roleId = Number(localStorage.getItem('role_id'))
  // const [cancelSuccess, setCancelSuccess] = useState<{ [key: number]: string }>({});
  // const [cancelError, setCancelError] = useState<{ [key: number]: string }>({});

  const handleRemoval = async (e: React.MouseEvent, ticketId: number) => {
    e.preventDefault();
    dispatch(clearTicketsState())
    try {
      await dispatch(cancelTicket(ticketId)).unwrap();
    } catch (error) {
      console.error("Ticket removal failed.");
      
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
            <button className='cancel-ticket-btn' onClick={(e) => handleRemoval(e, ticket.ticket_id)}>
              Cancel
            </button>
          </td>
        )}
      </tr>

      {((targetTicketId === ticket.ticket_id) && (error || SuccessMessage)) && (
        <tr>
          <td colSpan={9} className={error ? 'single-object-error' : 'single-object-confirm'}>
            {error || SuccessMessage}
          </td>
        </tr>
      )}
    </>
  );
};

export default TicketRow;

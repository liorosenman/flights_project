import React from 'react';
import { formatDateTime } from '../../utils/DateTimeFormat.ts';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { cancelTicket, getMyTickets, selectTicketState } from './ticketSlicer.tsx';
import { clearTicketsState } from './ticketSlicer.tsx';
import '../../App.css'

const TicketRow = ({ ticket }) => {
  const dispatch = useAppDispatch();
  const { targetTicketId, error, SuccessMessage } = useAppSelector(selectTicketState);
  const token = localStorage.getItem('access_token')
  const roleId = Number(localStorage.getItem('role_id'))

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
        <td>{ticket.al_name}</td>
        <td>{ticket.origin_country}</td>
        <td>{ticket.destination_country}</td>
        <td>{formatDateTime(ticket.departure_time)}</td>
        <td>
          {ticket.ticket_status !== 'active' ? (
            ticket.ticket_status
          ) : (
            <button
              className="cancel-ticket-btn"
              onClick={(e) => handleRemoval(e, ticket.ticket_id)}
            >
              Cancel
            </button>
          )}
        </td>
      </tr>

      {((targetTicketId === ticket.ticket_id) && (error || SuccessMessage)) && (
        <tr>
          <td colSpan={9} style={{ textAlign: 'center', color: error ? 'red' : 'green' }}>
            {error || SuccessMessage}
          </td>
        </tr>
      )}
    </>
  );
};

export default TicketRow;

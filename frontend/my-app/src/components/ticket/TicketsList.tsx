import React, { useEffect } from 'react'
import { clearTicketsState, getMyTickets, selectTicketState } from './ticketSlicer.tsx';
import TicketRow from './TicketRow.tsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';

const TicketsList = () => {
  const dispatch = useAppDispatch();
  const { tickets } = useAppSelector(selectTicketState);
  const token = localStorage.getItem('access_token');


  useEffect(() => {
    (async () => {
      await dispatch(clearTicketsState());
      await dispatch(getMyTickets({ token }));
    })();
  }, [])


  return (
    <div>
        <h1 className='heading-thin-center'>My bookings</h1>
      <table className="table table-bordered table-striped table-hover flight-table bg-white mx-auto text-center" style={{width:'90%'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Flight number</th>
            <th>Origin Country</th>
            <th>Destination Country</th>
            <th>Departure Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <TicketRow ticket={ticket} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TicketsList
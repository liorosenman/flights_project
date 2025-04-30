import React, { useEffect } from 'react'
import Menu from '../Menu/menuComp.tsx'
import { getMyTickets, selectTicketState } from './ticketSlicer.tsx';
import TicketRow from './TicketRow.tsx';
import { selectLoginState } from '../Login/loginSlice.tsx';
import { useAppSelector, useAppDispatch } from '../../app/hooks.ts';

const TicketsList = () => {
  const dispatch = useAppDispatch();
  const { tickets} = useAppSelector(selectTicketState);
  const {token} = useAppSelector(selectLoginState);

  useEffect(() => {
    (async () => {
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
       await dispatch(getMyTickets({ token }));
      
    })();
  }, [])
  
  
  return (
      <div>
        <h1>My tickets</h1>
        <table>
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
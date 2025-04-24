import axios from 'axios'
import {FlightData} from '../../models/flightdata.ts'
import { TicketData } from '../../models/TicketData.ts';

const SERVER = "http://127.0.0.1:8000/";

export const getMyTicketsService = async (token: string) => {
    const response = await axios.get(`${SERVER}/get_my_tickets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
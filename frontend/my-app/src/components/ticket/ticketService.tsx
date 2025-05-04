import axios from 'axios'

const SERVER = "http://127.0.0.1:8000/";

export const getMyTicketsService = async (token: string) => {
    const response = await axios.get(`${SERVER}/get_my_tickets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

export const cancelTicketService = async (ticketId: number, token: string) => {
  const response = await axios.put(
    `${SERVER}/remove_ticket/${ticketId}/`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

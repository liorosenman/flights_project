import { AirportUser } from './airportuser';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  phone_no: number;
  credit_card_no: number;
  airport_user: AirportUser;

}

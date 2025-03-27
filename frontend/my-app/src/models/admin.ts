import { AirportUser } from './airportuser';

export interface Admin {
  id: number;
  first_name: string;
  last_name: string;
  airport_user: AirportUser;
}

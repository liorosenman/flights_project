import { AirportUser } from './airportuser';
import { Country } from './country';

export interface Airline {
  id: number;
  name: string;
  country: Country;
  airport_user: AirportUser; 
}

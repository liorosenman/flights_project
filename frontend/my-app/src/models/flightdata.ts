import { Airline } from './airline';
import { Country } from './country';
import { FlightStatus } from './FlightStatus';


export interface FlightData {
  id: number;
  airline_company: Airline;
  origin_country: Country;
  destination_country: Country;
  landing_time: string;
  departure_time: string;
  remaining_tickets: number;
  status: FlightStatus;
}

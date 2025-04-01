import { Airline } from './airline';
import { Country } from './country';

export enum FlightStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
}

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

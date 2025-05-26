import { Airline } from './airline';
import { Country } from './country';
import { Customer } from './customer';
import { FlightData } from './FlightData';
import { FlightStatus } from './FlightStatus';


export interface TicketData {
  id: number;
  Flight: FlightData;
  Customer: Customer;
}
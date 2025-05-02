// models/LinkedCustomer.ts
export interface LinkedCustomer {
    id: number;
    username: string;          
    first_name: string;
    last_name: string;
    address: string;
    phone_no: number;
    email: string;
    airport_id: number;
    status: boolean,
    credit_card_no: number 
    password?:string            
  }
  
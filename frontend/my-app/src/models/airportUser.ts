import { UserRole } from './userRole.ts';

export interface AirportUser {
  id: number;
  username: string;
  password: string;
  email: string;
  role_name: UserRole;
  is_active: boolean;
}

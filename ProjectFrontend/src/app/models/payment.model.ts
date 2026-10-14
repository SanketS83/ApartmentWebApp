import { Maintenance } from './maintenance.model';
import { Resident } from './resident.model';

export interface Payment {
  id?: number;
  maintenance?: Maintenance;
  maintenanceId?: number;
  resident?: Resident;
  residentId?: number;
  amount: number;
  paymentDate?: string;
  paymentTime?: string;
  paymentMode: string;
  paymentMethod?: string;
  transactionId?: string;
  transactionRef?: string;
  totalAmount?: number;
  netAmount?: number;
  status?: string;
  remarks?: string;
}
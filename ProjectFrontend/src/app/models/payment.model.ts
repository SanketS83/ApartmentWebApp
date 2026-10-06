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
  paymentMode: string;
  transactionId?: string;
  status?: string;
}
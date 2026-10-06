import { Resident } from './resident.model';

export interface Visitor {
  id?: number;
  resident?: Resident;
  residentId?: number;
  visitorName: string;
  phone: string;
  purpose: string;
  visitDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: string;
}
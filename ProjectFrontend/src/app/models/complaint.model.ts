import { Resident } from './resident.model';

export interface Complaint {
  id?: number;
  resident?: Resident;
  residentId?: number;
  subject: string;
  description: string;
  category: string;
  priority?: string;
  status?: string;
  adminReply?: string;
  createdAt?: string;
}
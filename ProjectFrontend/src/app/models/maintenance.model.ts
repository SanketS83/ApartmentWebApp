import { Flat } from './flat.model';
import { Resident } from './resident.model';

export interface Maintenance {
  id?: number;
  flat?: Flat;
  flatId?: number;
  resident?: Resident;
  residentId?: number;
  month: number;
  year: number;
  amount: number;
  dueDate: string;
  status: string;
}
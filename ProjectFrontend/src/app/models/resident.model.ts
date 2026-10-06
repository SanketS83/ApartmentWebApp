import { Flat } from './flat.model';

export interface Resident {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  memberType: string;
  flat?: Flat;
  flatId?: number;
  address?: string;
  isActive?: boolean;
}
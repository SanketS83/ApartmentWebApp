import { Flat } from './flat.model';

export interface Parking {
  id?: number;
  parkingNumber: string;
  flat?: Flat;
  flatId?: number;
  vehicleNumber?: string;
  status: string;
}
export interface Guard {
  id?: number;
  name: string;
  username: string;
  phone: string;
  password?: string;
  shift: string;
  isActive?: boolean;
}
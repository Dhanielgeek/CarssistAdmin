export type AcStatus = 'Active' | 'Inactive' | 'Pending';

export interface Rider {
  id: string;
  regDate: string;
  userId: string;
  name: string;
  email: string;
  phoneNo: string;
  country: string;
  state: string;
  assists: number;
  averageRating: number; // 0 - 100
  serviceArea: string;
  lastLogin: string;
  acStatus: AcStatus;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: keyof Rider | null;
  direction: SortDirection;
}
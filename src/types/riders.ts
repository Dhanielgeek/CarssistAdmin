import type { AcStatus, Rider } from '../types/rider';

const LAST_LOGIN_OPTIONS = [
  'Today',
  'Yesterday',
  'Three days ago',
  'A week ago',
  'A month ago',
  '13/04/2024',
];

const STATUS_OPTIONS: AcStatus[] = ['Active', 'Inactive', 'Pending'];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const riders: Rider[] = Array.from({ length: 40 }, (_, i) => {
  const seed = i + 1;
  return {
    id: `rider-${seed}`,
    regDate: '12/04/2024',
    userId: '123456789',
    name: 'James Adeleke',
    email: 'jamesadeleke@gmail.com',
    phoneNo: '+124567809872',
    country: 'USA',
    state: 'Texas',
    assists: 25,
    averageRating: 40,
    serviceArea: 'Texas Frisco',
    lastLogin: pick(LAST_LOGIN_OPTIONS, seed),
    acStatus: pick(STATUS_OPTIONS, seed === 4 ? 2 : seed % 5 === 0 ? 1 : 0),
  };
});
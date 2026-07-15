import type { AcStatus, Rider } from "../types/rider";

const LAST_LOGIN_OPTIONS = [
  "Today",
  "Yesterday",
  "3 days ago",
  "1 week ago",
  "2 weeks ago",
  "1 month ago",
];

const STATUS_OPTIONS: AcStatus[] = ["Active", "Inactive", "Pending"];

const NAMES = [
  "James Adeleke",
  "Daniel Johnson",
  "Michael Smith",
  "Samuel Williams",
  "David Brown",
  "John Wilson",
  "Peter Okafor",
  "Musa Ibrahim",
  "Victor James",
  "Chris Johnson",
  "Emmanuel David",
  "Joseph Bello",
];

const COUNTRIES = [
  "USA",
  "Canada",
  "Nigeria",
  "United Kingdom",
  "South Africa",
];

const STATES = [
  "Texas",
  "California",
  "Lagos",
  "Abuja",
  "Ontario",
  "London",
];

const SERVICE_AREAS = [
  "Texas Frisco",
  "Houston",
  "Dallas",
  "Victoria Island",
  "Lekki",
  "Abuja Central",
  "Toronto",
  "Manchester",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export const riders: Rider[] = Array.from({ length: 50 }, (_, i) => {
  const seed = i + 1;
  const name = pick(NAMES, seed);
  const email = `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`;

  return {
    id: `rider-${seed}`,
    regDate: `${String((seed % 28) + 1).padStart(2, "0")}/04/2024`,
    userId: `USR${100000 + seed}`,
    name,
    email,
    phoneNo: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    country: pick(COUNTRIES, seed),
    state: pick(STATES, seed),
    assists: Math.floor(Math.random() * 120),
    averageRating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
    serviceArea: pick(SERVICE_AREAS, seed),
    lastLogin: pick(LAST_LOGIN_OPTIONS, seed),
    acStatus: pick(STATUS_OPTIONS, seed),
    
  };
});
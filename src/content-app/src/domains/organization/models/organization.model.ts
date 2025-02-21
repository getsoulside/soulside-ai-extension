export interface Organization {
  id: UUIDString | null;
  name: string | null;
  active: boolean;
  email: string;
  apartmentNumber: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  createdAt: ISO8601String;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  totalConsultations?: number;
  totalSpent?: number;
  lastActive?: string;
  avatar?: string;
}
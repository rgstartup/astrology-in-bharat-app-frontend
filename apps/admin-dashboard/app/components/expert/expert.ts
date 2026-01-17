export interface Expert {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  specialization: string;
  experience: number;
  rating: number;
  totalConsultations: number;
  totalEarnings: number;
  city?: string;
  state?: string;
  languages?: string[];
  avatar?: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  lastActive?: string;
}
export interface KYCDocument {
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ExpertKYC {
  id: string;
  expertId: string;
  expertName: string;
  email: string;
  phone: string;
  expertise: string;
  aadharNumber: string;
  panNumber: string;
  documents: KYCDocument[];
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  experience: number;
  address: string;
}

export const mockKYCData: ExpertKYC[] = [
  {
    id: "KYC001",
    expertId: "EXP001",
    expertName: "Pandit Rajesh Sharma",
    email: "rajesh.sharma@astrology.com",
    phone: "+91 98765 43210",
    expertise: "Vedic Astrology",
    aadharNumber: "XXXX-XXXX-1234",
    panNumber: "ABCDE1234F",
    documents: [
      { type: "Aadhar Card", url: "/docs/aadhar_rajesh.pdf", uploadedAt: "2025-12-10" },
      { type: "PAN Card", url: "/docs/pan_rajesh.pdf", uploadedAt: "2025-12-10" },
      { type: "Certificate", url: "/docs/cert_rajesh.pdf", uploadedAt: "2025-12-10" },
    ],
    status: "pending",
    submittedAt: "2025-12-15",
    experience: 15,
    address: "123, Temple Street, Varanasi, UP - 221001",
  },
  {
    id: "KYC002",
    expertId: "EXP002",
    expertName: "Dr. Priya Iyer",
    email: "priya.iyer@astrology.com",
    phone: "+91 98765 43211",
    expertise: "Nadi Astrology",
    aadharNumber: "XXXX-XXXX-5678",
    panNumber: "FGHIJ5678K",
    documents: [
      { type: "Aadhar Card", url: "/docs/aadhar_priya.pdf", uploadedAt: "2025-12-08" },
      { type: "PAN Card", url: "/docs/pan_priya.pdf", uploadedAt: "2025-12-08" },
      { type: "PhD Certificate", url: "/docs/phd_priya.pdf", uploadedAt: "2025-12-08" },
    ],
    status: "approved",
    submittedAt: "2025-12-08",
    reviewedAt: "2025-12-10",
    reviewedBy: "Admin Kumar",
    experience: 12,
    address: "456, Beach Road, Chennai, TN - 600001",
  },
  {
    id: "KYC003",
    expertId: "EXP003",
    expertName: "Guruji Anil Joshi",
    email: "anil.joshi@astrology.com",
    phone: "+91 98765 43212",
    expertise: "Kundli Matching",
    aadharNumber: "XXXX-XXXX-9012",
    panNumber: "KLMNO9012P",
    documents: [
      { type: "Aadhar Card", url: "/docs/aadhar_anil.pdf", uploadedAt: "2025-12-05" },
      { type: "PAN Card", url: "/docs/pan_anil.pdf", uploadedAt: "2025-12-05" },
    ],
    status: "rejected",
    submittedAt: "2025-12-05",
    reviewedAt: "2025-12-07",
    reviewedBy: "Admin Sharma",
    rejectionReason: "Incomplete documentation - Certificate missing",
    experience: 8,
    address: "789, Hill View, Rishikesh, UK - 249201",
  },
  {
    id: "KYC004",
    expertId: "EXP004",
    expertName: "Smt. Lakshmi Devi",
    email: "lakshmi.devi@astrology.com",
    phone: "+91 98765 43213",
    expertise: "Numerology",
    aadharNumber: "XXXX-XXXX-3456",
    panNumber: "QRSTU3456V",
    documents: [
      { type: "Aadhar Card", url: "/docs/aadhar_lakshmi.pdf", uploadedAt: "2025-12-12" },
      { type: "PAN Card", url: "/docs/pan_lakshmi.pdf", uploadedAt: "2025-12-12" },
      { type: "Experience Certificate", url: "/docs/exp_lakshmi.pdf", uploadedAt: "2025-12-12" },
    ],
    status: "under_review",
    submittedAt: "2025-12-12",
    experience: 20,
    address: "321, Garden Lane, Hyderabad, TS - 500001",
  },
  {
    id: "KYC005",
    expertId: "EXP005",
    expertName: "Swami Raghavendra",
    email: "raghavendra@astrology.com",
    phone: "+91 98765 43214",
    expertise: "Palmistry",
    aadharNumber: "XXXX-XXXX-7890",
    panNumber: "VWXYZ7890A",
    documents: [
      { type: "Aadhar Card", url: "/docs/aadhar_raghav.pdf", uploadedAt: "2025-12-14" },
      { type: "PAN Card", url: "/docs/pan_raghav.pdf", uploadedAt: "2025-12-14" },
      { type: "Training Certificate", url: "/docs/train_raghav.pdf", uploadedAt: "2025-12-14" },
    ],
    status: "pending",
    submittedAt: "2025-12-14",
    experience: 10,
    address: "654, Temple Road, Mysore, KA - 570001",
  },
];
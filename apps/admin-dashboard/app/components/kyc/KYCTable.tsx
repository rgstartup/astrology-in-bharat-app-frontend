import { DataTable } from "@/app/components/admin/DataTable";
import KYCStatusBadge from "./KYCStatusBadge";
import KYCActionButtons from "./KYCActionButtons";

interface KYCDocument {
  type: string;
  url: string;
  uploadedAt: string;
}

interface ExpertKYC {
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
  [key: string]: any;
}

interface KYCTableProps {
  data: ExpertKYC[];
  onView: (kyc: ExpertKYC) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMarkUnderReview: (id: string) => void;
}

export default function KYCTable({
  data,
  onView,
  onApprove,
  onReject,
  onMarkUnderReview,
}: KYCTableProps) {
  const columns = [
    { key: "expertId", label: "Expert ID" },
    { key: "expertName", label: "Expert Name" },
    { key: "expertise", label: "Expertise" },
    { key: "email", label: "Email" },
    { key: "submittedAt", label: "Submitted On" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (kyc: ExpertKYC, key: string) => {
    switch (key) {
      case "status":
        return <KYCStatusBadge status={kyc.status} />;
      case "actions":
        return (
          <KYCActionButtons
            kyc={kyc}
            onView={() => onView(kyc)}
            onApprove={() => onApprove(kyc.id)}
            onReject={(reason) => onReject(kyc.id, reason)}
            onMarkUnderReview={() => onMarkUnderReview(kyc.id)}
          />
        );
      default:
        return kyc[key as keyof ExpertKYC];
    }
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="No KYC submissions found"
      renderCell={renderCell} searchKeys={[]}    />
  );
}




import * as LucideIcons from "lucide-react";
import type { Expert } from "@/app/components/expert/expert";

const {
  Mail: MailIcon,
  Phone: PhoneIcon,
  MapPin: MapPinIcon,
  Calendar: CalendarIcon,
  DollarSign: DollarSignIcon,
  Clock: ClockIcon,
  Star: StarIcon,
  Award: AwardIcon,
  Briefcase: BriefcaseIcon
} = LucideIcons;

export const getProfileModalProps = (expert: Expert) => {
  const profile = expert.profile_expert;

  // Data picking with priority (Root level from new API, then fallback to nested)
  const name = expert.name;
  const avatar = expert.avatar;
  const bio = expert.bio || profile?.bio;
  const gallery = expert.gallery || profile?.gallery || [];
  const documents = expert.documents || profile?.documents || [];
  const intro_video_url = expert.intro_video_url || profile?.intro_video_url;
  const specialization = expert.specialization || profile?.specialization || "Expert Astrologer";
  const experience = expert.experience ?? profile?.experience ?? 0;
  const rating = expert.rating ?? profile?.rating ?? "0.0";
  const totalConsultations = expert.consultationCount ?? expert.totalConsultations ?? profile?.totalConsultations ?? 0;
  const totalEarnings = expert.totalEarnings ?? profile?.totalEarnings ?? 0;
  const kycStatus = expert.kyc_details?.status || expert.kycStatus || profile?.kycStatus || "Pending";
  const phone = expert.phone;
  const email = expert.email;

  // Extract primary address from the array if present
  const primaryAddress = expert.addresses?.[0];
  const addressStr = primaryAddress
    ? `House: ${primaryAddress.houseNo || primaryAddress.line1 || 'N/A'}, District: ${primaryAddress.district || 'N/A'}, City: ${primaryAddress.city || 'N/A'}, State: ${primaryAddress.state || 'N/A'}, Pin: ${primaryAddress.pincode || primaryAddress.zipCode || 'N/A'}`
    : (expert.city ? `${expert.city}, ${expert.state}` : "Address not provided");

  const formattedDob = expert.dob ? new Date(expert.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

  // Verification Checklist Logic (Comprehensive)
  const checklist = [
    { label: "Profile Name", isComplete: !!name, value: name },
    { label: "Email Address", isComplete: !!email, value: email },
    { label: "Profile Picture", isComplete: !!avatar, value: avatar },
    { label: "Gender", isComplete: !!expert.gender, value: expert.gender },
    { label: "Date of Birth", isComplete: !!formattedDob, value: formattedDob },
    { label: "Phone Number", isComplete: !!phone, value: phone },
    { label: "Languages Spoken", isComplete: !!(expert.languages && expert.languages.length > 0), value: expert.languages?.join(", ") },
    { label: "Bio / Introduction", isComplete: !!bio, value: bio },
    {
      label: "Office/Home Address",
      isComplete: !!primaryAddress || (!!expert.city && !!expert.state),
      value: addressStr
    },
    {
      label: "Gallery Photos",
      isComplete: !!(gallery && gallery.length > 0),
      value: gallery.map((img: any) => ({ url: typeof img === 'string' ? img : img.url }))
    },
    {
      label: "Introduction Video",
      isComplete: !!intro_video_url,
      value: intro_video_url
    },
    {
      label: "Aadhaar Card (KYC)",
      isComplete: documents.some((d: any) => d.category === 'aadhar' && d.side === 'front') &&
        documents.some((d: any) => d.category === 'aadhar' && d.side === 'back'),
      value: documents.filter((d: any) => d.category === 'aadhar').map((d: any) => ({ url: d.url, side: d.side }))
    },
    {
      label: "Certificates",
      isComplete: !!(expert.certificates && expert.certificates.length > 0),
      value: expert.certificates?.map((url: string) => ({ url }))
    },
    {
      label: "PAN Card (KYC)",
      isComplete: documents.some((d: any) => d.category === 'pan' && d.side === 'front') &&
        documents.some((d: any) => d.category === 'pan' && d.side === 'back'),
      value: documents.filter((d: any) => d.category === 'pan').map((d: any) => ({ url: d.url, side: d.side }))
    },
  ];

  return {
    avatar,
    name,
    subtitle: specialization,
    bio,
    intro_video_url,
    gallery,
    documents,
    checklist,

    badges: [
      {
        label: expert.status || "Pending",
        color: expert.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700",
      },
      {
        label: `KYC: ${kycStatus}`,
        color: kycStatus === "Verified" || kycStatus === "verified" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700",
      },
    ],
    stats: [
      { icon: StarIcon, value: rating, label: "Rating", bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
      { icon: BriefcaseIcon, value: String(totalConsultations), label: "Consultations", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
      { icon: AwardIcon, value: `${experience}y Exp`, label: "Experience", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
      { icon: DollarSignIcon, value: totalEarnings >= 1000 ? `₹${(totalEarnings / 1000).toFixed(1)}k` : `₹${totalEarnings}`, label: "Total Earnings", bgColor: "bg-green-50", iconColor: "text-green-600" },
    ],
    details: [
      { icon: MailIcon, label: "Email", value: email },
      { icon: PhoneIcon, label: "Phone", value: phone || "Not provided" },
      { icon: MapPinIcon, label: "Location", value: expert.city ? `${expert.city}, ${expert.state}` : "Not specified" },
      { icon: CalendarIcon, label: "Joined", value: new Date(expert.createdAt).toLocaleDateString("en-IN") },
    ],
  };
};




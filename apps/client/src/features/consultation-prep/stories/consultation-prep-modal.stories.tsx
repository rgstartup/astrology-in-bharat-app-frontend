import React, { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import DetailsStep from "../components/modal/details-step.component";
import type { PrepExpert } from "../components/modal/types";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";
import type { SomeoneElseData } from "@/actions/chat";

const mockExpert: PrepExpert = {
  id: 101,
  name: "Pt. Radheshyam Shastri",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  rating: 4.9,
  experience_in_years: 15,
  specializations: ["Vedic Astrology", "Kundli Matching", "Vastu"],
  pricing: {
    chat_price: 25,
    call_price: 35,
    video_call_price: 60,
  },
  price: 25,
  is_available: true,
} as unknown as PrepExpert;

const defaultMember: SomeoneElseData = {
  name: "Aarav Sharma",
  gender: "male",
  dob: "1995-08-15",
  tob: "14:30",
  pob: "New Delhi, India",
};

interface PrepModalDemoProps {
  mode?: ConsultationMode;
  isAvailable?: boolean;
  balance?: number;
  showLowBalance?: boolean;
  initialAskSomeoneElse?: boolean;
}

function PrepModalDemo({
  mode = "chat",
  isAvailable = true,
  balance = 500,
  showLowBalance = false,
  initialAskSomeoneElse = true,
}: PrepModalDemoProps) {
  const [askSomeoneElse, setAskSomeoneElse] = useState(initialAskSomeoneElse);
  const [someoneElseData, setSomeoneElseData] =
    useState<SomeoneElseData>(defaultMember);
  const [loading, setLoading] = useState(false);

  const priceMap: Record<ConsultationMode, number> = {
    chat: 25,
    voice: 35,
    video: 60,
  };
  const minRequired = priceMap[mode] * 5;

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-[640px] flex items-center justify-center bg-slate-100/70 p-4">
      <div className="w-full max-w-[440px] rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <DetailsStep
          expert={mockExpert}
          mode={mode}
          isExpertAvailable={isAvailable}
          askSomeoneElse={askSomeoneElse}
          setAskSomeoneElse={setAskSomeoneElse}
          someoneElseData={someoneElseData}
          setSomeoneElseData={setSomeoneElseData}
          handleStartConsultation={handleStart}
          actionLoading={loading}
          balance={balance}
          showLowBalance={showLowBalance}
          minBalanceRequired={minRequired}
          isAuthenticated={true}
          onClose={() => alert("Close clicked")}
          onRecharge={() => alert("Recharge clicked")}
        />
      </div>
    </div>
  );
}

const meta: Meta<typeof DetailsStep> = {
  title: "Consultation / PrepModal",
  component: DetailsStep,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DetailsStep>;

/**
 * Live Chat consultation prep case:
 * Displays chat mode pill in header band, chat icon badge on avatar,
 * chat rate per minute, and Start Chat Consultation CTA.
 */
export const RequestingChat: Story = {
  render: () => <PrepModalDemo mode="chat" balance={300} />,
};

/**
 * Voice Call consultation prep case:
 * Displays voice mode pill in header band, phone icon badge on avatar,
 * voice rate per minute (₹35/min), and Start Voice Call CTA.
 */
export const RequestingVoice: Story = {
  render: () => <PrepModalDemo mode="voice" balance={400} />,
};

/**
 * Video Call consultation prep case:
 * Displays video mode pill in header band, video icon badge on avatar,
 * video rate per minute (₹60/min), and Start Video Call CTA.
 */
export const RequestingVideo: Story = {
  render: () => <PrepModalDemo mode="video" balance={500} />,
};

/**
 * Low balance threshold case:
 * Highlights shortfall alert and switches primary CTA to Recharge action.
 */
export const LowBalanceRecharge: Story = {
  render: () => (
    <PrepModalDemo mode="video" balance={40} showLowBalance={true} />
  ),
};

/**
 * Offline expert case:
 * Shows offline badge in header band, renders inline "The expert is offline" notice,
 * and renders disabled action CTA button showing "The expert is offline".
 */
export const OfflineExpert: Story = {
  render: () => <PrepModalDemo mode="voice" isAvailable={false} />,
};

/**
 * Consulting for someone else case:
 * Displays pre-filled member chip with quick-edit access to birth details.
 */
export const ConsultingForSomeoneElse: Story = {
  render: () => <PrepModalDemo mode="chat" initialAskSomeoneElse={false} />,
};

import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import type { useRouter } from "@/i18n/navigation";
import { ConsultationSidebar } from "./consultation-sidebar.component";

type Router = ReturnType<typeof useRouter>;

function stubRouter(): Router {
  const router = {
    back: () => undefined,
    push: () => undefined,
  };
  return router as unknown as Router;
}

/** Matches exact user wireframe: Pandit Rahul Sharma, Vedic Astrologer. */
const rahulSharmaExpert = {
  id: 101,
  name: "Pandit Rahul Sharma",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  rating: 4.9,
  languages: "Hindi, English, Sanskrit",
  professions: [
    {
      is_primary: true,
      profession: {
        id: 1,
        title: "Vedic Astrologer",
      },
    },
  ],
  pricing: {
    chat_price: 25,
    call_price: 30,
    video_call_price: 50,
  },
} as unknown as IExpert;

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const meta: Meta<typeof ConsultationSidebar> = {
  title: "Chat/Sidebar/ConsultationSidebar",
  component: ConsultationSidebar,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ConsultationSidebar>;

/**
 * Exact wireframe scenario from user prompt:
 * - Consultations / Active session
 * - Connected securely
 * - Pandit Rahul Sharma (Vedic Astrologer, Online)
 * - CONSULTATION: Chat session (Secure, private conversation)
 * - ELAPSED TIME: 12:34
 * - REMAINING TIME: 08:42
 * - Upgrade consultation (Voice: ₹30/min, Video: ₹50/min)
 * - End consultation at bottom
 */
export const WireframeActiveSession: Story = {
  render: () => (
    <div className="flex h-[720px] bg-[#f5f1ec] p-4">
      <ConsultationSidebar
        expertData={rahulSharmaExpert}
        sessionStatus="active"
        formatTime={formatTime}
        elapsedTime={754} // 12:34
        timeLeft={522} // 08:42
        handleEndChat={() => undefined}
        isWarning={false}
        router={stubRouter()}
      />
    </div>
  ),
};

export const LowBalanceAlert: Story = {
  render: () => (
    <div className="flex h-[720px] bg-[#f5f1ec] p-4">
      <ConsultationSidebar
        expertData={rahulSharmaExpert}
        sessionStatus="active"
        formatTime={formatTime}
        elapsedTime={1320} // 22:00
        timeLeft={45} // 00:45 (urgent)
        handleEndChat={() => undefined}
        isWarning={true}
        router={stubRouter()}
      />
    </div>
  ),
};

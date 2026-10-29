import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import type { useRouter } from "@/i18n/navigation";
import { Header } from "@/features/consultation/header";

type Router = ReturnType<typeof useRouter>;

function stubRouter(): Router {
  const router = {
    back: () => undefined,
    push: () => undefined,
  };
  return router as unknown as Router;
}

/** Matches exact user design reference. */
const fixtureExpert = {
  name: "Acharya Vedant Sharma",
  avatar:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  professions: [
    {
      is_primary: true,
      profession: {
        title: "Vedic Astrologer",
      },
    },
  ],
  pricing: {
    chat_price: 25,
  },
} as unknown as IExpert;

/** Long display name test fixture. */
const longNameExpert = {
  name: "Pandit Radheshyam Vishwanath Shastri",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  professions: [
    {
      is_primary: true,
      profession: {
        title: "Senior Jyotish Acharya & Vastu Expert",
      },
    },
  ],
  pricing: {
    chat_price: 35,
  },
} as unknown as IExpert;

function formatTime(time: number): string {
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  const padded = secs.toString().padStart(2, "0");
  return `${mins}:${padded}`;
}

function Stage(props: React.ComponentProps<typeof Header>) {
  return (
    <div className="w-[960px] max-w-full bg-[#f5f1ec] p-4">
      <Header {...props} />
    </div>
  );
}

const meta: Meta<typeof Header> = {
  title: "Chat/Header/RoomHeader",
  component: Header,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

/**
 * Exact design reference from user request:
 * - Back to consultations
 * - Acharya Vedant Sharma / Vedic Astrologer
 * - Connected status & End session button
 * - SESSION TIME 12:48 | TIME REMAINING 17:12 | RATE ₹25 / min
 * - Progress bar
 */
export const DesignReference: Story = {
  render: () => (
    <Stage
      router={stubRouter()}
      expertData={fixtureExpert}
      isFree={false}
      sessionStatus="active"
      formatTime={formatTime}
      elapsedTime={768} // 12:48
      timeLeft={1032} // 17:12
      handleEndChat={() => undefined}
      isWarning={false}
      rate={25}
    />
  ),
};

export const LowBalanceWarning: Story = {
  render: () => (
    <Stage
      router={stubRouter()}
      expertData={fixtureExpert}
      isFree={false}
      sessionStatus="active"
      formatTime={formatTime}
      elapsedTime={1200}
      timeLeft={45}
      handleEndChat={() => undefined}
      isWarning={true}
      rate={25}
    />
  ),
};

export const FreeSessionPromotion: Story = {
  render: () => (
    <Stage
      router={stubRouter()}
      expertData={fixtureExpert}
      isFree={true}
      sessionStatus="active"
      formatTime={formatTime}
      elapsedTime={120}
      timeLeft={300}
      handleEndChat={() => undefined}
      isWarning={false}
      rate={0}
    />
  ),
};

export const ConnectingWaiting: Story = {
  render: () => (
    <Stage
      router={stubRouter()}
      expertData={fixtureExpert}
      isFree={false}
      sessionStatus="pending"
      formatTime={formatTime}
      elapsedTime={0}
      timeLeft={1800}
      handleEndChat={() => undefined}
      rate={25}
    />
  ),
};

export const LongExpertName: Story = {
  render: () => (
    <Stage
      router={stubRouter()}
      expertData={longNameExpert}
      isFree={false}
      sessionStatus="active"
      formatTime={formatTime}
      elapsedTime={3720}
      timeLeft={180}
      handleEndChat={() => undefined}
      rate={35}
    />
  ),
};

export const MobileViewport: Story = {
  render: () => (
    <div className="w-[375px] max-w-full bg-[#f5f1ec] p-2">
      <Header
        router={stubRouter()}
        expertData={fixtureExpert}
        isFree={false}
        sessionStatus="active"
        formatTime={formatTime}
        elapsedTime={768}
        timeLeft={1032}
        handleEndChat={() => undefined}
        isWarning={false}
        rate={25}
      />
    </div>
  ),
};

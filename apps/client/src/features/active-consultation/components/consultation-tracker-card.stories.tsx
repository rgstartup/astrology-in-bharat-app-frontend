import type { Meta, StoryObj } from "@repo/storybook";
import { ConsultationTrackerCard } from "./consultation-tracker-card.component";

function CardStage(props: React.ComponentProps<typeof ConsultationTrackerCard>) {
  return (
    <div className="relative flex min-h-[280px] w-[560px] max-w-full items-end justify-end bg-slate-100/60 p-6">
      <ConsultationTrackerCard {...props} />
    </div>
  );
}

const meta: Meta<typeof ConsultationTrackerCard> = {
  title: "Chat / ConsultationTrackerCard",
  component: ConsultationTrackerCard,
  parameters: {
    layout: "centered",
  },
  args: {
    onReturn: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof ConsultationTrackerCard>;

export const LiveSession: Story = {
  render: () => (
    <CardStage
      expertName="Pt. Radheshyam Shastri"
      expertAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      startedAt={new Date(Date.now() - 4 * 60 * 1000).toISOString()}
      paused={false}
      onReturn={() => undefined}
    />
  ),
};

export const LiveSessionWithoutAvatar: Story = {
  render: () => (
    <CardStage
      expertName="Acharya Devrat"
      startedAt={new Date(Date.now() - 62 * 1000).toISOString()}
      paused={false}
      onReturn={() => undefined}
    />
  ),
};

export const PausedBudgetHold: Story = {
  render: () => (
    <CardStage
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      startedAt={new Date(Date.now() - 11 * 60 * 1000).toISOString()}
      paused={true}
      onReturn={() => undefined}
    />
  ),
};

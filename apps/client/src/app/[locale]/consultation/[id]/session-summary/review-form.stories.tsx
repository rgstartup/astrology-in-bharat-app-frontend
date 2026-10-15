import { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import ReviewForm from "./review-form.component";

type ReviewStoryProps = {
  initialRating?: number;
  initialComment?: string;
  initialSubmitted?: boolean;
  status?: string;
};

const router = { push: (_path: string) => undefined };

function ReviewStory({
  initialRating = 0,
  initialComment = "",
  initialSubmitted = false,
  status,
}: ReviewStoryProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitted, setSubmitted] = useState(initialSubmitted);

  return (
    <div className="w-[320px]">
      <ReviewForm
        status={status}
        isDarkMode={false}
        reviewRating={rating}
        setReviewRating={setRating}
        reviewComment={comment}
        setReviewComment={setComment}
        reviewSubmitted={submitted}
        setReviewSubmitted={setSubmitted}
        sessionId="session-1"
        expertData={{ id: 7 }}
        router={router}
      />
    </div>
  );
}

const meta: Meta<typeof ReviewForm> = {
  title: "Chat/SessionSummary/ReviewForm",
  component: ReviewForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ReviewForm>;

export const Empty: Story = {
  render: () => <ReviewStory />,
};

export const Rated: Story = {
  render: () => <ReviewStory initialRating={4} initialComment="Very clear guidance." />,
};

export const Submitted: Story = {
  render: () => <ReviewStory initialRating={5} initialSubmitted />,
};

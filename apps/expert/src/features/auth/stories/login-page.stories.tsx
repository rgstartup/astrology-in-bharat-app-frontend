import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import { LoginForm } from "../components/LoginForm";
import { ExpertShowcaseCard } from "../components/ExpertShowcaseCard";

/**
 * Full page composition representing Expert Login.
 * Shows responsive behavior between mobile full-height layout
 * and desktop dual-column layout with ambient brand showcase card.
 */
const FullLoginPageComposition: React.FC<{ isMobilePreview?: boolean }> = ({
  isMobilePreview = false,
}) => {
  return (
    <section className="relative flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-between lg:justify-center w-full min-h-screen min-h-dvh lg:h-screen lg:max-h-screen bg-white font-sans py-2.5 sm:py-6 lg:py-8 overflow-y-auto lg:overflow-hidden">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10 flex-1 flex flex-col justify-between lg:block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-24 2xl:gap-28 items-stretch flex-1 flex flex-col justify-between lg:grid">
          {/* Left Column: Form & Brand Header/Footer */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between flex-1 lg:flex-initial h-full w-full">
            <div className="flex flex-col justify-between w-full flex-1 h-full min-h-[calc(100dvh-1.25rem)] lg:min-h-0">
              {/* Top Left: Brand Logo */}
              <div className="w-full flex justify-start pt-0.5 sm:pt-2 mb-8 sm:mb-8 lg:mb-10">
                <AuthHeader subtitle="Astrology in Bharat" title="EXPERT PORTAL" />
              </div>

              {/* Center/Upper Third: LoginForm */}
              <div className="w-full max-w-[420px] mx-auto lg:ml-auto lg:mr-6 lg:mx-0 mt-3 sm:mt-6 lg:my-auto mb-auto">
                <LoginForm />
              </div>

              {/* Bottom: AuthFooter */}
              <AuthFooter />
            </div>
          </div>

          {/* Right Column: Embedded Showcase Card (hidden on mobile) */}
          <div className={`${isMobilePreview ? "hidden" : "hidden lg:flex"} lg:col-span-6 xl:col-span-6 w-full justify-end items-stretch h-full`}>
            <ExpertShowcaseCard />
          </div>
        </div>
      </div>
    </section>
  );
};

const meta: Meta<typeof FullLoginPageComposition> = {
  title: "Features/Auth/LoginPage",
  component: FullLoginPageComposition,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FullLoginPageComposition>;

export const MobileView: Story = {
  render: () => (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-[390px] h-[844px] bg-white rounded-[44px] border-[10px] border-stone-850 shadow-2xl flex flex-col overflow-hidden relative">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-900 rounded-full z-50 flex items-center justify-end px-3">
          <div className="size-2 rounded-full bg-stone-800" />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col pt-4">
          <FullLoginPageComposition isMobilePreview={true} />
        </div>
        {/* Bottom Home Indicator */}
        <div className="h-6 bg-white w-full flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-stone-300 rounded-full" />
        </div>
      </div>
    </div>
  ),
};

export const DesktopView: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-white">
      <FullLoginPageComposition isMobilePreview={false} />
    </div>
  ),
};

export const TabletView: Story = {
  render: () => (
    <div className="min-h-screen bg-stone-100 p-6 flex items-center justify-center">
      <div className="w-[768px] min-h-[950px] bg-white rounded-3xl border-4 border-stone-300 shadow-xl p-6 overflow-hidden">
        <FullLoginPageComposition isMobilePreview={true} />
      </div>
    </div>
  ),
};

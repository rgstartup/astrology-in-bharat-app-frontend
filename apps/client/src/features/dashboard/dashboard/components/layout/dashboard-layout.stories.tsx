import type { Meta, StoryObj } from "@repo/storybook";
import React from "react";
import { DashboardSidebar } from "./dashboard-sidebar.root";
import { DashboardHeader } from "./dashboard-header.root";
import { SidebarSupportCard } from "./sidebar-support-card.component";
import { HeaderBreadcrumb } from "./header-breadcrumb.component";
import { HeaderActions } from "./header-actions.component";

const meta: Meta = {
  title: "Dashboard / Layout",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const SidebarDesktop: Story = {
  render: () => (
    <div className="h-screen w-64 border-r border-[#d3cec6] bg-[#f5f1ec]">
      <DashboardSidebar />
    </div>
  ),
};

export const HeaderDesktop: Story = {
  render: () => (
    <header className="h-16 w-full border-b border-[#d3cec6] bg-white">
      <DashboardHeader />
    </header>
  ),
};

export const BreadcrumbOverview: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <HeaderBreadcrumb isOverview={true} pageName="Overview" />
    </div>
  ),
};

export const BreadcrumbNested: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <HeaderBreadcrumb isOverview={false} pageName="Daily Horoscope" />
    </div>
  ),
};

export const SupportCard: Story = {
  render: () => (
    <div className="w-64 bg-[#f5f1ec] p-4">
      <SidebarSupportCard />
    </div>
  ),
};

export const HeaderActionsBar: Story = {
  render: () => (
    <div className="flex max-w-xl items-center justify-end rounded-xl border border-[#d3cec6] bg-white p-4">
      <HeaderActions
        userName="Aarav Sharma"
        initials="AS"
        userSubtitle="+91 98765 43210"
        unreadCount={3}
        onLogout={async () => undefined}
      />
    </div>
  ),
};

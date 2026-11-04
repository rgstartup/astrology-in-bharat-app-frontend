import type { ReactNode } from "react";
import { MobileSidebarDrawer } from "../sidebar/mobile-sidebar-drawer";
type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type MainAreaProps = {
  drawer: DrawerProps;
  /** Chat body, rendered for chat and docked voice sessions. */
  children: ReactNode;
};

export default function MainArea({ drawer, children }: MainAreaProps) {
  return (
    <>
      <MobileSidebarDrawer {...drawer} />
      {children}
    </>
  );
}

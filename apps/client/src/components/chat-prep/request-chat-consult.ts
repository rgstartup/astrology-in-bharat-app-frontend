import type { ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { useChatPrepStore } from "@/store/chatPrepStore";

type RequestChatDeps = {
  isAuthenticated: boolean;
  pathname: string;
  push: (url: string) => void;
  loginTitle: ReactNode;
  loginActionLabel: ReactNode;
};

/**
 * Card-level chat entry: opens the prep modal when logged in,
 * otherwise stashes the expert and shows a login toast.
 * ChatPrepHost reopens the modal automatically after login.
 */
export function requestChatConsult(expertId: string, deps: RequestChatDeps) {
  const { isAuthenticated, pathname, push, loginTitle, loginActionLabel } =
    deps;
  if (isAuthenticated) {
    useChatPrepStore.getState().openChatPrep(expertId);
    return;
  }
  useChatPrepStore.getState().setPendingExpert(expertId);
  // withCallbackUrl drops "/" (home), which would bounce the user to the
  // dashboard after login — return to the experts section instead.
  const returnTo = pathname === "/" ? "/#our-experts" : pathname;
  const id = toast.warning(loginTitle, {
    action: {
      label: loginActionLabel,
      onClick: () => {
        toast.dismiss(id);
        push(withCallbackUrl(PATHS.LOGIN, returnTo));
      },
    },
  });
}

"use client";

import { Home, Moon, Sun, User } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type HeaderActionsProps = {
  router: ReturnType<typeof useRouter>;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  className?: string;
};

function ThemeIcon({ isDarkMode }: { isDarkMode: boolean }) {
  if (isDarkMode) return <Sun data-icon="inline-start" />;
  return <Moon data-icon="inline-start" />;
}

export function HeaderActions({
  router,
  isDarkMode,
  setIsDarkMode,
  className,
}: HeaderActionsProps) {
  function handleToggleTheme() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-1 md:gap-1.5", className)}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
                onClick={() => router.push("/")}
              >
                <Home data-icon="inline-start" />
                Home
              </Button>
            }
          />
          <TooltipContent>Go home</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
                onClick={() => router.push("/client/profile")}
              >
                <User data-icon="inline-start" />
                Profile
              </Button>
            }
          />
          <TooltipContent>Open profile</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-black/10 hover:text-primary-foreground"
                onClick={handleToggleTheme}
              >
                <ThemeIcon isDarkMode={isDarkMode} />
              </Button>
            }
          />
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

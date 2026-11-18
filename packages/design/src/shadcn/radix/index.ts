/**
 * Radix UI (@radix-ui/react-*) variant entry point.
 */

// Re-export all shared UI components from ui/ (Button, Card, Input, etc.)
export * from "../ui/index";

// Radix-backed primitives
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogClose,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./alert-dialog";

// Sonner Toast (Radix UI variant)
export {
  Toaster,
  toast,
  type ToasterProps,
  Toaster as SonnerToaster,
  toast as sonnerToast,
  type ToasterProps as SonnerToasterProps,
} from "./sonner";

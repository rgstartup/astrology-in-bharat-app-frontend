/**
 * Radix UI (@radix-ui/react-*) variant entry point.
 */

// Re-export all shared UI components from ui/ (Button, Card, Input, etc.)
export * from "../ui";

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

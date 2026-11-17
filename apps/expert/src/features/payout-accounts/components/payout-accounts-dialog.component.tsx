"use client";

import { CreditCard, RefreshCw } from "@repo/design/lucide";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from "@repo/design/shadcn";
import { useForm } from "react-hook-form";
import type { InitiatePayoutOnboardingOutput } from "@/features/payout-accounts/api";

interface PayoutAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formSpec: InitiatePayoutOnboardingOutput | null;
  submitting: boolean;
  form: ReturnType<typeof useForm<Record<string, string>>>;
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
  /** Show the trigger "Link Bank Account" button inside the dialog (default true). */
  showTrigger?: boolean;
}

const FIELD_LABELS: Record<string, string> = {
  account_holder_name: "Account Holder Name",
  account_number: "Account Number",
  ifsc: "IFSC Code",
};

const fieldLabel = (field: string) => {
  const mapped = FIELD_LABELS[field];
  if (mapped) return mapped;
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function PayoutAccountsDialog({
  open,
  onOpenChange,
  formSpec,
  submitting,
  form,
  onSubmit,
  onCancel,
  showTrigger = true,
}: PayoutAccountsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div>
        {showTrigger && (
          <Button
            onClick={() => onOpenChange(true)}
            disabled={submitting}
            className="bg-[#fd6410] text-white"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Linking…</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Link Bank Account</span>
              </>
            )}
          </Button>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Bank Account</DialogTitle>
            <DialogDescription>
              Enter your bank account details to link your payout account via
              RazorpayX.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {formSpec?.fields?.map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel required>{fieldLabel(field)}</FormLabel>
                      <FormControl>
                        <Input
                          id={field}
                          autoComplete="off"
                          inputMode="text"
                          {...f}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#fd6410] text-white"
                >
                  {submitting ? "Linking…" : "Link Bank Account"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  );
}

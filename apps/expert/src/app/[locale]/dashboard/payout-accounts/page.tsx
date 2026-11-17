"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "@repo/design/lucide";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import {
  initiatePayoutOnboarding,
  completePayoutOnboarding,
  listPayoutAccountLinks,
  executePayout,
  reconcilePayouts,
  removePayoutAccount,
  setPrimaryPayoutAccount,
  type InitiatePayoutOnboardingInput,
  type InitiatePayoutOnboardingOutput,
  type CompletePayoutOnboardingInput,
  type ExecutePayoutInput,
  type ReconcilePayoutsInput,
  type PayoutAccountLink,
} from "@/features/payout-accounts/api";
import { getErrorMessage } from "@repo/lib";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  AUTHORIZED: { label: "Authorized", color: "bg-blue-100 text-blue-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-700" },
};

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

export default function PayoutAccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [links, setLinks] = useState<PayoutAccountLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formSpec, setFormSpec] =
    useState<InitiatePayoutOnboardingOutput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [reconcileLoading, setReconcileLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<number | null>(null);
  const [executeFormOpen, setExecuteFormOpen] = useState(false);

  const form = useForm<Record<string, string>>({
    defaultValues: {},
    mode: "onBlur",
  });

  useEffect(() => {
    if (formSpec) {
      const defaults: Record<string, string> = {};
      formSpec.fields?.forEach((field) => {
        defaults[field] = "";
      });
      form.reset(defaults);
    }
  }, [formSpec, form]);

  useEffect(() => {
    const linked = searchParams.get("linked");
    const error = searchParams.get("error");
    const externalAccountId = searchParams.get("externalAccountId");
    if (linked === "1") {
      setMessage({
        type: "success",
        text: externalAccountId
          ? `Payout account linked successfully (${externalAccountId}).`
          : "Payout account linked successfully.",
      });
    } else if (error) {
      setMessage({
        type: "error",
        text: `Linking failed: ${error.replace(/_/g, " ")}.`,
      });
    }
    fetchLinks();
  }, [searchParams]);

  const fetchLinks = async () => {
    setLoading(true);
    const result = await listPayoutAccountLinks();
    if (result.ok) {
      setLinks(Array.isArray(result.data) ? result.data : []);
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) || "Failed to load payout accounts.",
      });
    }
    setLoading(false);
  };

  const handleLinkAccount = async () => {
    setLoading(true);
    const redirectUri =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/payout-accounts`
        : "";
    const input: InitiatePayoutOnboardingInput = {
      providerCode: "razorpayx",
      redirectUri,
    };
    const result = await initiatePayoutOnboarding(input);
    setLoading(false);
    if (result.ok && result.data) {
      if (result.data.type === "redirect" && result.data.url) {
        window.location.href = result.data.url;
      } else if (result.data.type === "form") {
        setFormSpec(result.data);
        setDialogOpen(true);
      } else {
        setMessage({
          type: "error",
          text: "Unexpected response from provider.",
        });
      }
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) ||
          "Failed to start payout onboarding. Please try again.",
      });
    }
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    if (!formSpec) return;
    setSubmitting(true);
    const input: CompletePayoutOnboardingInput = {
      onboardingId: formSpec.onboardingId,
      accountHolderName: data.account_holder_name || undefined,
      accountNumber: data.account_number || undefined,
      ifsc: data.ifsc || undefined,
    };
    const result = await completePayoutOnboarding(input);
    setSubmitting(false);
    if (result.ok && result.data) {
      setDialogOpen(false);
      setFormSpec(null);
      form.reset();
      setMessage({
        type: "success",
        text: `Payout account linked (${result.data.providerReference}).`,
      });
      fetchLinks();
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) ||
          "Failed to complete payout onboarding. Please try again.",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await listPayoutAccountLinks();
    setRefreshing(false);
    if (result.ok) {
      setMessage({ type: "success", text: "Payout accounts refreshed." });
      setLinks(Array.isArray(result.data) ? result.data : []);
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) || "Failed to refresh payout accounts.",
      });
    }
  };

  const handleExecutePayout = async () => {
    setExecuteLoading(true);
    const input: ExecutePayoutInput = {
      payoutAccountId: 0,
      amount: 0,
      currencyCode: "INR",
      narration: "",
      idempotencyKey: undefined,
    };
    const result = await executePayout(input);
    setExecuteLoading(false);
    if (result.ok && result.data) {
      setExecuteFormOpen(false);
      setMessage({
        type: "success",
        text: `Payout executed (${result.data.providerPayoutReference}, ${result.data.status}).`,
      });
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) ||
          "Failed to execute payout. Please try again.",
      });
    }
  };

  const handleReconcile = async () => {
    setReconcileLoading(true);
    const input: ReconcilePayoutsInput = { statuses: undefined, limit: 100 };
    const result = await reconcilePayouts(input);
    setReconcileLoading(false);
    if (result.ok && result.data) {
      setMessage({
        type: "success",
        text: `Reconciled ${result.data.checked} payout(s), ${result.data.updated} updated.`,
      });
    } else {
      setMessage({
        type: "error",
        text:
          getErrorMessage(result.error) ||
          "Reconciliation failed. Please try again.",
      });
    }
  };

  const handleRemove = async (id: number) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    if (
      !window.confirm(`Unlink payout account ${link.externalAccountId ?? id}?`)
    )
      return;
    setRemovingId(id);
    try {
      const result = await removePayoutAccount(id);
      if (result.ok) {
        setMessage({ type: "success", text: "Payout account removed." });
        fetchLinks();
      } else {
        setMessage({
          type: "error",
          text:
            getErrorMessage(result.error) || "Failed to remove payout account.",
        });
      }
    } finally {
      setRemovingId(null);
    }
  };

  const handleSetPrimary = async (id: number) => {
    setSettingPrimaryId(id);
    try {
      const result = await setPrimaryPayoutAccount(id);
      if (result.ok) {
        setMessage({ type: "success", text: "Set as primary payout account." });
        fetchLinks();
      } else {
        setMessage({
          type: "error",
          text:
            getErrorMessage(result.error) ||
            "Failed to set primary payout account.",
        });
      }
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const dismissMessage = () => setMessage(null);

  return (
    <div className="min-h-screen bg-white sm:bg-gray-50/50 p-0 sm:p-6 lg:p-8 font-outfit">
      <header className="px-4 pt-6 sm:px-0 sm:pt-0 mb-6 sm:mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Payout Accounts
        </h1>
        <p className="text-gray-700 mt-1">
          Link a bank account via RazorpayX to send and receive payouts.
        </p>
      </header>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg flex items-center gap-3 mb-6 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
          <button
            onClick={dismissMessage}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Link bank account dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div>
          <Button
            onClick={handleLinkAccount}
            disabled={loading}
            className="bg-[#fd6410] text-white"
          >
            {loading ? (
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
        </div>
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
              onSubmit={form.handleSubmit(handleFormSubmit)}
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
                  onClick={() => {
                    setDialogOpen(false);
                    setFormSpec(null);
                  }}
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
      </Dialog>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Linked Accounts</h2>
            <p className="text-gray-600 text-sm">
              Manage your payout destination accounts.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Your Payout Accounts
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {links.length === 0
                ? "No accounts linked yet. Add one to receive payouts."
                : `${links.length} account${links.length !== 1 ? "s" : ""} linked.`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                    Account
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    IFSC
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    Primary
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <p className="text-[12px] font-bold text-gray-700">
                        No payout accounts linked
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Click "Link Bank Account" to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr
                      key={link.id}
                      className="relative hover:bg-gray-50/80 transition-all duration-300 group border-b border-gray-50 sm:border-none last:border-0"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[13px] font-bold text-gray-900">
                            {link.accountNumberMasked
                              ? `•••• ${link.accountNumberMasked}`
                              : (link.externalAccountId ?? "—")}
                          </span>
                          {link.ifsc && (
                            <span className="text-[11px] text-gray-500 font-mono">
                              {link.ifsc}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-500">
                            Created{" "}
                            {new Date(link.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`text-[11px] font-mono font-bold ${link.ifsc ? "text-gray-700" : "text-gray-400"}`}
                        >
                          {link.ifsc ?? "—"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_CONFIG[link.onboardingStatus]?.color ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {STATUS_CONFIG[link.onboardingStatus]?.label ??
                            link.onboardingStatus}
                        </span>
                        {link.accountStatus && (
                          <span className="text-[10px] text-gray-500 block mt-1">
                            {link.accountStatus}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {link.isPrimary ? (
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                            Primary
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right space-x-1">
                        <Button
                          onClick={() => handleRemove(link.id)}
                          size="sm"
                          disabled={removingId === link.id}
                          variant="outline"
                          className="text-[10px] px-3 py-1.5 text-red-600 border-red-100 hover:bg-red-50"
                        >
                          {removingId === link.id
                            ? "Removing…"
                            : link.isPrimary
                              ? "Primary"
                              : "Unlink"}
                        </Button>
                        {!link.isPrimary && (
                          <Button
                            onClick={() => handleSetPrimary(link.id)}
                            size="sm"
                            disabled={settingPrimaryId === link.id}
                            variant="outline"
                            className="text-[10px] px-3 py-1.5 text-gray-700 border-gray-100 hover:bg-gray-100"
                          >
                            {settingPrimaryId === link.id
                              ? "Setting…"
                              : "Set Primary"}
                          </Button>
                        )}
                        <Button
                          onClick={handleRefresh}
                          size="sm"
                          disabled={refreshing}
                          className="text-[10px] px-3 py-1.5"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Button
          onClick={handleReconcile}
          disabled={reconcileLoading}
          className="mt-6 text-[10px] px-3 py-1.5 text-gray-600 hover:bg-gray-100"
        >
          {reconcileLoading ? "Reconciling…" : "Reconcile Payouts"}
        </Button>
      </div>
    </div>
  );
}

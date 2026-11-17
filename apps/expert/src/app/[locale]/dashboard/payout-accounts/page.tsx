"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  usePayoutAccounts,
  usePayoutLink,
  PayoutMessageBanner,
  PayoutAccountsDialog,
  PayoutAccountsTable,
  removePayoutAccount,
  setPrimaryPayoutAccount,
  executePayout,
  reconcilePayouts,
  type ExecutePayoutInput,
  type ReconcilePayoutsInput,
} from "@/features/payout-accounts";
import { Button } from "@/components/ui/button";
import { CreditCard } from "@repo/design/lucide";
import { getErrorMessage } from "@repo/lib";

export default function PayoutAccountsPage() {
  const searchParams = useSearchParams();

  // Data hooks
  const { links, refreshing, fetchLinks, handleRefresh } = usePayoutAccounts();
  const {
    dialogOpen,
    setDialogOpen,
    formSpec,
    submitting,
    form,
    handleLinkAccount,
    handleFormSubmit,
  } = usePayoutLink();

  // Page-level state
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [executeFormOpen, setExecuteFormOpen] = useState(false);
  const [reconcileLoading, setReconcileLoading] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<number | null>(null);

  // URL search params effect (linked/error messages)
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
  }, [searchParams, fetchLinks]);

  const dismissMessage = () => setMessage(null);

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
        await fetchLinks();
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
        setMessage({
          type: "success",
          text: "Set as primary payout account.",
        });
        await fetchLinks();
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

      <PayoutMessageBanner message={message} onDismiss={dismissMessage} />

      {/* Link bank account dialog */}
      <PayoutAccountsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formSpec={formSpec}
        submitting={submitting}
        form={form}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setDialogOpen(false);
        }}
        showTrigger={false}
      />

      <div className="max-w-7xl mx-auto">
        {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Linked Accounts</h2>
            <p className="text-gray-600 text-sm">
              Manage your payout destination accounts.
            </p>
          </div>
        </div> */}

        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight">
                Your Payout Accounts
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {links.length === 0
                  ? "No accounts linked yet. Add one to receive payouts."
                  : `${links.length} account${links.length !== 1 ? "s" : ""} linked.`}
              </p>
            </div>
            <Button
              onClick={handleLinkAccount}
              className="bg-[#fd6410] text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>

          <PayoutAccountsTable
            links={links}
            removingId={removingId}
            settingPrimaryId={settingPrimaryId}
            onRemove={handleRemove}
            onSetPrimary={handleSetPrimary}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
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

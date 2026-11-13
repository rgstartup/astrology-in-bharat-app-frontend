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
import {
  listBankLinks,
  initiateBankLink,
  completeBankLink,
  validatePennyDrop,
  setPrimaryBankLink,
  deleteBankLink,
  refreshBankLinkStatus,
  type BankLinkSummary,
  type InitiateBankLinkOutput,
} from "@/features/bank-links/api";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  AUTHORIZED: { label: "Authorized", color: "bg-blue-100 text-blue-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-700" },
};

export default function PayoutAccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [links, setLinks] = useState<BankLinkSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formSpec, setFormSpec] = useState<InitiateBankLinkOutput | null>(null);
  const [externalAccountId, setExternalAccountId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPennyDrop, setShowPennyDrop] = useState(false);
  const [pennyDropAmount, setPennyDropAmount] = useState("");
  const [validatingPennyDrop, setValidatingPennyDrop] = useState(false);

  useEffect(() => {
    // Handle callback query params from provider redirect
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
    const result = await listBankLinks();
    if (result.ok) {
      setLinks(result.data ?? []);
    }
    setLoading(false);
  };

  const handleLinkAccount = async () => {
    setLoading(true);
    const redirectUri =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard/payout-accounts`
        : "";
    const result = await initiateBankLink({ redirectUri });
    setLoading(false);
    if (result.ok && result.data) {
      if (result.data.type === "redirect" && result.data.url) {
        window.location.href = result.data.url;
      } else if (result.data.type === "form") {
        setFormSpec(result.data);
        setFormData({});
      } else {
        setMessage({ type: "error", text: "Unexpected response from provider." });
      }
    } else {
      setMessage({ type: "error", text: "Failed to start linking. Please try again." });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await refreshBankLinkStatus();
    setRefreshing(false);
    if (result.ok) {
      setMessage({ type: "success", text: "Status refreshed." });
      fetchLinks();
    } else {
      setMessage({ type: "error", text: "Failed to refresh status." });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await completeBankLink({
      accountHolderName: formData.accountHolderName || undefined,
      accountNumber: formData.accountNumber || undefined,
      ifsc: formData.ifsc || undefined,
    });
    setSubmitting(false);
    if (result.ok && result.data) {
      setFormSpec(null);
      setFormData({});
      setExternalAccountId(result.data.externalAccountId || null);
      setShowPennyDrop(true);
    } else {
      setMessage({ type: "error", text: "Failed to complete bank link. Please try again." });
    }
  };

  const handleValidatePennyDrop = async () => {
    if (!externalAccountId) return;
    const amount = parseFloat(pennyDropAmount);
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount." });
      return;
    }
    setValidatingPennyDrop(true);
    const result = await validatePennyDrop(externalAccountId, amount);
    setValidatingPennyDrop(false);
    if (result.ok) {
      setShowPennyDrop(false);
      setPennyDropAmount("");
      setMessage({ type: "success", text: "Penny-drop validated. Account linked." });
      fetchLinks();
    } else {
      setMessage({ type: "error", text: "Penny-drop validation failed. Please try again." });
    }
  };

  const handleSetPrimary = async (id: number) => {
    const result = await setPrimaryBankLink(id);
    if (result.ok) {
      fetchLinks();
    } else {
      setMessage({ type: "error", text: "Failed to set primary account." });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Unlink this payout account?")) return;
    const result = await deleteBankLink(id);
    if (result.ok) {
      fetchLinks();
    } else {
      setMessage({ type: "error", text: "Failed to unlink account." });
    }
  };

  const dismissMessage = () => setMessage(null);

  return (
    <div className="min-h-screen bg-white sm:bg-gray-50/50 p-0 sm:p-6 lg:p-8">
      <header className="px-4 pt-6 sm:px-0 sm:pt-0 mb-6 sm:mb-8 font-outfit">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Payout Accounts
        </h1>
        <p className="text-gray-700 mt-1">
          Link a bank account to receive payouts. Your bank and KYC details are
          collected securely by our payment provider.
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

      {formSpec && formSpec.type === "form" && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Bank Details
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your bank account details to link your payout account.
            </p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formSpec.fields?.map((field) => (
                <div key={field} className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor={field}
                  >
                    {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#fd6410] text-white"
              >
                {submitting ? "Linking…" : "Link Bank Account"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {showPennyDrop && (
        <div className="max-w-md mx-auto mb-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Penny-Drop Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              A small amount (₹1) has been deposited to your account.
              Please confirm the amount to complete linking.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount deposited (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={pennyDropAmount}
                  onChange={(e) => setPennyDropAmount(e.target.value)}
                  required
                />
              </div>
              <Button
                onClick={handleValidatePennyDrop}
                disabled={validatingPennyDrop}
                className="w-full bg-[#fd6410] text-white"
              >
                {validatingPennyDrop ? "Validating…" : "Confirm Amount"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Linked Accounts</h2>
            <p className="text-gray-600 text-sm">
              Manage your payout destination accounts.
            </p>
          </div>
          <Button
            onClick={handleLinkAccount}
            disabled={loading}
            className="flex items-center gap-2 bg-[#fd6410] text-white"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Linking...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Link Bank Account</span>
              </>
            )}
          </Button>
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
                    Provider
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                    Account
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
                    <td colSpan={5} className="p-20 text-center">
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
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-gray-900 group-hover:text-black transition-colors">
                              {link.paymentProvider}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {link.providerProduct}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900">
                            {link.externalAccountId ?? "—"}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Created {new Date(link.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_CONFIG[link.onboardingStatus]?.color ?? "bg-gray-100 text-gray-700"}`}>
                          {STATUS_CONFIG[link.onboardingStatus]?.label ?? link.onboardingStatus}
                        </span>
                        {link.accountStatus && (
                          <span className="text-[10px] text-gray-500 block mt-1">
                            {link.accountStatus}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        {link.isPrimary ? (
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            Primary
                          </span>
                        ) : (
                          <Button
                            onClick={() => handleSetPrimary(link.id)}
                            size="sm"
                            className="text-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5"
                          >
                            Set Primary
                          </Button>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleDelete(link.id)}
                            size="sm"
                            variant="outline"
                            className="text-[10px] px-3 py-1.5 text-red-600 border-red-100 hover:bg-red-50"
                          >
                            Unlink
                          </Button>
                          <Button
                            onClick={handleRefresh}
                            size="sm"
                            disabled={refreshing}
                            className="text-[10px] px-3 py-1.5"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

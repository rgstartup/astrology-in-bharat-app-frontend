"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import type { IExpert } from "@repo/lib";
import type { SomeoneElseData } from "@/actions/chat";
import { useTranslations } from "next-intl";
import { Wallet, AlertCircle, ArrowLeft, Pencil } from "@repo/design/lucide";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import { resolveModePrice } from "@/lib/pricing";
import { type DeviceHintKind } from "../hooks/use-device-preflight";
import ExpertHeader from "./expert-header";
import { ConsultingForSelect, MemberDetailsForm } from "./consulting-for";
import {
  ConsultationModeIcon,
  getConsultationModeLabel,
} from "./consultation-mode-icon";

export interface ExpertPreviewProps {
  expert: (Partial<IExpert> & { expertise?: string }) | null;
  mode?: ConsultationMode;
  askSomeoneElse: boolean;
  setAskSomeoneElse: (val: boolean) => void;
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: (val: SomeoneElseData) => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
  balance?: number | null;
  showLowBalance?: boolean;
  minBalanceRequired?: number;
  isAuthenticated?: boolean;
  isExpertAvailable?: boolean;
  /** Inline device-access recovery hint; null when devices are fine. */
  deviceHint?: DeviceHintKind | null;
  /** Retry probe after unblocking devices; shown only for the blocked hint. */
  onRetryDevices?: () => void;
  /** When provided, low-balance CTA enters an embedded recharge step instead of redirecting. */
  onRecharge?: () => void;
}

/**
 * Renders user wallet balance row when user is authenticated.
 */
function BalanceRow({
  isAuthenticated,
  balance,
  label,
}: {
  isAuthenticated: boolean;
  balance: number | null;
  label: string;
}) {
  if (!isAuthenticated || balance === null) return null;

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 bg-slate-50 text-sm">
      <span className="flex items-center gap-1.5 font-semibold text-slate-600 truncate">
        <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
        {label}
      </span>
      <span className="font-black text-slate-900 shrink-0">₹{balance.toFixed(2)}</span>
    </div>
  );
}

/**
 * Low balance alert notice rendered before checkout.
 */
function LowBalanceAlert({
  show,
  minBalanceRequired,
  title,
  desc,
}: {
  show: boolean;
  minBalanceRequired: number;
  title: string;
  desc: string;
}) {
  if (!show) return null;

  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 rounded-2xl border border-red-200">
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
      <p className="text-xs text-red-700 leading-snug min-w-0">
        <span className="font-bold">{title}. </span>
        {desc}
      </p>
    </div>
  );
}

/**
 * Copy and tone per device-hint kind. Lookup replaces branching.
 */
const DEVICE_HINT_COPY = {
  blocked: {
    titleKey: "deviceBlockedTitle",
    descKey: "deviceBlockedDesc",
    containerClass:
      "flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 rounded-2xl border border-amber-200",
    iconClass: "w-4 h-4 text-amber-600 shrink-0 mt-0.5",
    textClass: "text-xs text-amber-800 leading-snug min-w-0",
  },
  denied: {
    titleKey: "deviceDeniedTitle",
    descKey: "deviceDeniedDesc",
    containerClass:
      "flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 rounded-2xl border border-amber-200",
    iconClass: "w-4 h-4 text-amber-600 shrink-0 mt-0.5",
    textClass: "text-xs text-amber-800 leading-snug min-w-0",
  },
  missing: {
    titleKey: "deviceMissingTitle",
    descKey: "deviceMissingDesc",
    containerClass:
      "flex items-start gap-2.5 px-3 py-2.5 bg-red-50 rounded-2xl border border-red-200",
    iconClass: "w-4 h-4 text-red-500 shrink-0 mt-0.5",
    textClass: "text-xs text-red-700 leading-snug min-w-0",
  },
} as const;

/**
 * Retry action shown only for the blocked hint: the user may have unblocked
 * devices via site settings since the denial was remembered.
 */
function DeviceHintRetry({
  hint,
  onRetry,
  label,
}: {
  hint: DeviceHintKind | null | undefined;
  onRetry?: () => void;
  label: string;
}) {
  if (hint !== "blocked") return null;
  if (onRetry === undefined) return null;

  return (
    <button
      type="button"
      onClick={onRetry}
      className="mt-1.5 text-xs font-bold underline underline-offset-2 cursor-pointer"
    >
      {label}
    </button>
  );
}

/**
 * Inline device-access recovery notice rendered above the start CTA.
 */
function DeviceHintNotice({
  hint,
  mode,
  onRetry,
}: {
  hint: DeviceHintKind | null | undefined;
  mode: ConsultationMode;
  onRetry?: () => void;
}) {
  const tx = useTranslations("Chat.expertPreview");
  if (hint === null || hint === undefined) return null;
  if (mode === "chat") return null;

  const copy = DEVICE_HINT_COPY[hint];
  const devices = tx(mode === "video" ? "deviceMicCamera" : "deviceMic");

  return (
    <div className={copy.containerClass}>
      <AlertCircle className={copy.iconClass} />
      <div className={copy.textClass}>
        <p>
          <span className="font-bold">{tx(copy.titleKey)}. </span>
          {tx(copy.descKey, { devices })}
        </p>
        <DeviceHintRetry hint={hint} onRetry={onRetry} label={tx("deviceTryAgain")} />
      </div>
    </div>
  );
}

/**
 * Offline notice banner displayed when the expert is unavailable.
 */
function OfflineNotice({
  show,
  message,
}: {
  show: boolean;
  message: string;
}) {
  if (!show) return null;

  return (
    <div className="flex items-start gap-2.5 px-3 py-2.5 bg-amber-50 rounded-2xl border border-amber-200">
      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 font-medium leading-snug">
        {message}
      </p>
    </div>
  );
}

/**
 * Action button rendered inside the consultation initiation controls.
 */
function ActionButton({
  isAvailable,
  showLowBalance,
  onRecharge,
  onRedirectWallet,
  handleStartConsultation,
  actionLoading,
  mode,
  connectingLabel,
  rechargeLabel,
  startLabel,
  offlineLabel,
}: {
  isAvailable: boolean;
  showLowBalance: boolean;
  onRecharge?: () => void;
  onRedirectWallet: () => void;
  handleStartConsultation: () => void;
  actionLoading: boolean;
  mode: ConsultationMode;
  connectingLabel: string;
  rechargeLabel: string;
  startLabel: string;
  offlineLabel: string;
}) {
  if (!isAvailable) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="flex-1 min-w-0 py-3 bg-slate-100 text-slate-400 rounded-full font-bold text-sm border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2 px-3 truncate"
      >
        <ConsultationModeIcon mode={mode} className="w-4 h-4 shrink-0 text-slate-400" />
        <span className="truncate">{offlineLabel}</span>
      </button>
    );
  }

  if (showLowBalance) {
    return (
      <button
        type="button"
        onClick={() => (onRecharge ? onRecharge() : onRedirectWallet())}
        className="flex-1 min-w-0 py-3 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all cursor-pointer truncate"
      >
        {rechargeLabel}
      </button>
    );
  }

  const ctaClass =
    "flex-1 min-w-0 py-3 bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-3 truncate";

  if (actionLoading) {
    return (
      <button type="button" disabled className={ctaClass}>
        <ConsultationModeIcon mode={mode} className="w-4 h-4 animate-pulse shrink-0" />
        <span className="truncate">{connectingLabel}</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={handleStartConsultation} className={ctaClass}>
      <ConsultationModeIcon mode={mode} className="w-4 h-4 shrink-0" />
      <span className="truncate">{startLabel}</span>
    </button>
  );
}

/**
 * Someone else member chip displaying name and quick-edit action.
 */
function SomeoneElseChip({
  askSomeoneElse,
  name,
  enterNameLabel,
  changeLabel,
  onEdit,
}: {
  askSomeoneElse: boolean;
  name?: string;
  enterNameLabel: string;
  changeLabel: string;
  onEdit: () => void;
}) {
  if (askSomeoneElse) return null;

  return (
    <button
      type="button"
      onClick={onEdit}
      className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer min-w-0"
    >
      <span className="truncate">{name || enterNameLabel}</span>
      <span className="flex items-center gap-1 shrink-0 text-slate-500">
        <Pencil className="w-3 h-3" />
        {changeLabel}
      </span>
    </button>
  );
}

/**
 * Expert preview details view orchestrating pricing summary, consulting-for selector,
 * low-balance checks, and the primary consultation launch action.
 *
 * @param props - Component properties.
 * @returns Expert preview element.
 */
const ExpertPreview = ({
  expert,
  mode = "chat",
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance = null,
  showLowBalance = false,
  minBalanceRequired = 0,
  isAuthenticated = false,
  isExpertAvailable: isExpertAvailableProp,
  onRecharge,
  deviceHint = null,
  onRetryDevices,
}: ExpertPreviewProps) => {
  const router = useRouter();
  const tx = useTranslations("Chat.expertPreview");
  const price = resolveModePrice(expert, mode);
  const modeLabel = getConsultationModeLabel(mode);
  const [view, setView] = useState<"details" | "member">("details");

  let isAvailable = expert?.is_available !== false;
  if (typeof isExpertAvailableProp === "boolean") {
    isAvailable = isExpertAvailableProp;
  }

  const pickConsultingFor = (val: boolean) => {
    setAskSomeoneElse(val);
    if (!val) setView("member");
  };

  if (view === "member") {
    return (
      <div className="px-5 pb-5 pt-12 space-y-3 max-w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAskSomeoneElse(true);
              setView("details");
            }}
            aria-label={tx("back")}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="text-sm font-bold text-slate-900 truncate">{tx("someoneElse")}</h3>
        </div>

        <MemberDetailsForm
          initial={someoneElseData}
          onSubmit={(v) => {
            setSomeoneElseData(v);
            setView("details");
          }}
        />
      </div>
    );
  }

  const startButtonLabel = `Start ${modeLabel}`;

  return (
    <div className="px-5 pb-5 pt-12 space-y-3 max-w-full">
      <ExpertHeader expert={expert} mode={mode} />

      {/* Compact price summary */}
      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="flex items-center gap-1.5 text-slate-600 truncate">
            <ConsultationModeIcon mode={mode} className="w-4 h-4 text-orange-500 shrink-0" />
            <span>₹{price} {tx("perMin")}</span>
          </span>
          <span className="font-semibold text-slate-900 shrink-0">₹{price}</span>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
          <span className="text-slate-600 truncate">
            {tx("minSession", { price: minBalanceRequired || 0 })}
          </span>
          <span className="font-semibold text-slate-900 shrink-0">₹{minBalanceRequired || 0}</span>
        </div>

        <BalanceRow
          isAuthenticated={isAuthenticated}
          balance={balance}
          label={tx("yourBalance")}
        />
      </div>

      <LowBalanceAlert
        show={showLowBalance}
        minBalanceRequired={minBalanceRequired}
        title={tx("lowBalance")}
        desc={tx("lowBalanceDesc", { price: minBalanceRequired || 0 })}
      />

      <OfflineNotice
        show={!isAvailable}
        message={tx("expertOffline")}
      />

      <DeviceHintNotice hint={deviceHint} mode={mode} onRetry={onRetryDevices} />

      <div className="flex gap-2 max-w-full">
        <ConsultingForSelect
          askSomeoneElse={askSomeoneElse}
          setAskSomeoneElse={pickConsultingFor}
          className="w-[124px]"
        />

        <ActionButton
          isAvailable={isAvailable}
          showLowBalance={showLowBalance}
          onRecharge={onRecharge}
          onRedirectWallet={() => router.push("/client/profile?tab=wallet")}
          handleStartConsultation={handleStartConsultation}
          actionLoading={actionLoading}
          mode={mode}
          connectingLabel={tx("connecting")}
          rechargeLabel={tx("rechargeNow")}
          startLabel={startButtonLabel}
          offlineLabel={tx("expertOffline")}
        />
      </div>

      <SomeoneElseChip
        askSomeoneElse={askSomeoneElse}
        name={someoneElseData.name}
        enterNameLabel={tx("enterName")}
        changeLabel={tx("change")}
        onEdit={() => setView("member")}
      />

      <p className="text-center text-[11px] leading-relaxed text-slate-400">
        {tx("termsPrefix")}{" "}
        <Link
          href="/terms-and-conditions"
          className="font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          {tx("termsLink")}
        </Link>
      </p>
    </div>
  );
};

export default ExpertPreview;

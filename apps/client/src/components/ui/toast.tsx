"use client";

import * as React from "react";
import {
  Toast as ToastPrimitive,
  type ToastManagerAddOptions,
  type ToastObject,
} from "@base-ui/react/toast";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Info,
  TriangleAlert,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

type ToastType =
  "default" | "success" | "error" | "warning" | "info" | "loading";

type ToastVariant =
  "default" | "success" | "error" | "destructive" | "warning" | "info";

interface ToastActionConfig {
  label: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

interface CustomToastData {
  action?: React.ReactNode | ToastActionConfig;
  variant?: ToastVariant;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  className?: string;
}

interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  type?: ToastType;
  action?: React.ReactNode | ToastActionConfig;
  duration?: number;
  autoClose?: number;
  timeout?: number;
  priority?: "low" | "high";
  onClose?: () => void;
  onRemove?: () => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  data?: CustomToastData;
}

const baseToastManager = ToastPrimitive.createToastManager<CustomToastData>();

function isActionConfig(value: unknown): value is ToastActionConfig {
  return typeof value === "object" && value !== null && "label" in value;
}

function isToastProps(input: unknown): input is ToastProps {
  return (
    typeof input === "object" && input !== null && !React.isValidElement(input)
  );
}

function normalizeToastOptions(
  input?: React.ReactNode | ToastProps,
  options?: Partial<ToastProps>,
  defaultType?: ToastType,
): ToastManagerAddOptions<CustomToastData> {
  const mergedProps: ToastProps = isToastProps(input)
    ? { ...input, ...options }
    : { description: input, ...options };

  const resolvedTimeout =
    mergedProps.timeout ?? mergedProps.autoClose ?? mergedProps.duration;

  const resolvedType =
    mergedProps.type ||
    defaultType ||
    (mergedProps.variant === "destructive"
      ? "error"
      : mergedProps.variant === "default"
        ? undefined
        : mergedProps.variant);

  const customData: CustomToastData = {
    ...mergedProps.data,
    action: mergedProps.action ?? mergedProps.data?.action,
    variant: mergedProps.variant ?? mergedProps.data?.variant,
    onClick: mergedProps.onClick ?? mergedProps.data?.onClick,
    style: mergedProps.style ?? mergedProps.data?.style,
    className: mergedProps.className ?? mergedProps.data?.className,
  };

  return {
    id: mergedProps.id,
    title: mergedProps.title,
    description: mergedProps.description,
    type: resolvedType,
    timeout: resolvedTimeout,
    priority: mergedProps.priority,
    onClose: mergedProps.onClose,
    onRemove: mergedProps.onRemove,
    data: customData,
  };
}

const toast = Object.assign(
  (input: React.ReactNode | ToastProps, options?: Partial<ToastProps>) => {
    return baseToastManager.add(normalizeToastOptions(input, options));
  },
  baseToastManager,
  {
    success: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "success")),
    error: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "error")),
    warning: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "warning")),
    warn: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "warning")),
    info: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "info")),
    loading: (
      input?: React.ReactNode | ToastProps,
      options?: Partial<ToastProps>,
    ) => baseToastManager.add(normalizeToastOptions(input, options, "loading")),
    dismiss: (id?: string) => {
      if (id) {
        baseToastManager.close(id);
      }
    },
  },
);

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-[calc(100vw-2.5rem)] sm:max-w-[400px] w-full outline-none select-none",
        className,
      )}
      {...props}
    />
  );
}

function Toast({
  className,
  toast: toastItem,
  onClick,
  ...props
}: ToastPrimitive.Root.Props & {
  toast: ToastObject<CustomToastData>;
}) {
  const type = toastItem.type;

  const statusStyles =
    type === "success"
      ? "border-emerald-200/90 ring-1 ring-emerald-500/10"
      : type === "error"
        ? "border-rose-200/90 ring-1 ring-rose-500/10"
        : type === "warning"
          ? "border-amber-200/90 ring-1 ring-amber-500/10"
          : type === "info"
            ? "border-sky-200/90 ring-1 ring-sky-500/10"
            : "border-slate-200/80";

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={toastItem}
      onClick={(e) => {
        if (toastItem.data?.onClick) {
          toastItem.data.onClick(e);
        }
        onClick?.(e);
      }}
      style={toastItem.data?.style}
      className={cn(
        "group/toast pointer-events-auto relative flex w-full items-center overflow-hidden rounded-2xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border p-3.5 sm:p-4 text-slate-900 dark:text-slate-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
        "data-starting-style:opacity-0 data-starting-style:translate-y-4 data-starting-style:scale-95",
        "data-ending-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:scale-95",
        statusStyles,
        toastItem.data?.className,
        className,
      )}
      {...props}
    />
  );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn("flex w-full items-start gap-3 min-w-0", className)}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "text-[13.5px] font-bold text-slate-900 dark:text-slate-100 leading-tight",
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  hasTitle = false,
  ...props
}: ToastPrimitive.Description.Props & { hasTitle?: boolean }) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn(
        hasTitle
          ? "text-[12.5px] font-normal text-slate-600 dark:text-slate-300 leading-snug mt-0.5"
          : "text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-2xs active:scale-95 transition-all cursor-pointer select-none",
        className,
      )}
      {...props}
    />
  );
}

function ToastClose({
  className,
  children,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close"
      className={cn(
        "shrink-0 size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer select-none ml-auto -mr-1 -mt-1",
        className,
      )}
      {...props}
    >
      {children ?? <X className="size-3.5 stroke-[2.5]" aria-hidden="true" />}
    </ToastPrimitive.Close>
  );
}

function ToastIcon({ type }: { type?: string }) {
  switch (type) {
    case "success":
      return (
        <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/90 flex items-center justify-center shrink-0 shadow-2xs">
          <CheckCircle2 className="size-4.5 text-emerald-600 stroke-[2.2]" />
        </div>
      );
    case "error":
      return (
        <div className="size-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100/90 flex items-center justify-center shrink-0 shadow-2xs">
          <AlertCircle className="size-4.5 text-rose-600 stroke-[2.2]" />
        </div>
      );
    case "warning":
      return (
        <div className="size-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/90 flex items-center justify-center shrink-0 shadow-2xs">
          <TriangleAlert className="size-4.5 text-amber-600 stroke-[2.2]" />
        </div>
      );
    case "info":
      return (
        <div className="size-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-100/90 flex items-center justify-center shrink-0 shadow-2xs">
          <Info className="size-4.5 text-sky-600 stroke-[2.2]" />
        </div>
      );
    case "loading":
      return (
        <div className="size-9 rounded-xl bg-orange/10 text-orange border border-orange/20 flex items-center justify-center shrink-0 shadow-2xs">
          <Loader2 className="size-4.5 text-orange animate-spin stroke-[2.2]" />
        </div>
      );
    default:
      return null;
  }
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<CustomToastData>();

  return toasts.map((toastItem) => {
    const hasTitle = Boolean(toastItem.title);
    const action = toastItem.data?.action;
    const hasAction = Boolean(action);

    return (
      <Toast key={toastItem.id} toast={toastItem}>
        <ToastContent>
          <ToastIcon type={toastItem.type} />
          <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
            {hasTitle && <ToastTitle>{toastItem.title}</ToastTitle>}
            <ToastDescription hasTitle={hasTitle}>
              {toastItem.description}
            </ToastDescription>
          </div>
          {hasAction && (
            <ToastAction
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (isActionConfig(action) && action.onClick) {
                  action.onClick(e);
                }
              }}
            >
              {isActionConfig(action) ? action.label : action}
            </ToastAction>
          )}
          <ToastClose />
        </ToastContent>
      </Toast>
    );
  });
}

function Toaster({
  children,
  toastManager = baseToastManager,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;
const useToast = ToastPrimitive.useToastManager;

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToast,
  useToastManager,
  type ToastActionConfig,
  type ToastProps,
  type ToastType,
  type ToastVariant,
  type CustomToastData,
};

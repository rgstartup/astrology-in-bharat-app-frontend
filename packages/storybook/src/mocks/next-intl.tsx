import React, { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let defaultMessages: Record<string, any> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("@messages/en");
  defaultMessages = mod.default || mod;
} catch {
  // Fallback if require fails
}

interface IntlContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>;
  locale: string;
}

const IntlContext = createContext<IntlContextValue>({
  messages: defaultMessages,
  locale: "en",
});

/**
 * Storybook mock for `useLocale` from `next-intl`.
 * Returns active locale from context or default "en".
 */
export function useLocale(): string {
  const context = useContext(IntlContext);
  return context.locale || "en";
}

/**
 * Resolves a nested value from a dictionary using case-insensitive dot segments.
 */
function getNestedValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any> | undefined,
  path: string[],
): string | undefined {
  if (!obj) return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const segment of path) {
    if (current == null || typeof current !== "object") return undefined;
    if (segment in current) {
      current = current[segment];
    } else {
      const lower = segment.toLowerCase();
      const matchKey = Object.keys(current).find((k) => k.toLowerCase() === lower);
      if (matchKey && matchKey in current) {
        current = current[matchKey];
      } else {
        return undefined;
      }
    }
  }
  if (typeof current === "string") return current;
  return undefined;
}

/**
 * Formats camelCase key to readable title/sentence case as human-friendly fallback.
 */
function formatKeyFallback(key: string): string {
  const withSpaces = key.replace(/([A-Z])/g, " $1").trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

/**
 * Storybook mock for `useTranslations` from `next-intl`.
 * Resolves real strings from the active dictionary or @messages/en fallback.
 */
export function useTranslations(namespace?: string) {
  const context = useContext(IntlContext);
  const messages =
    context && Object.keys(context.messages || {}).length > 0
      ? context.messages
      : defaultMessages;

  const lookup = (key: string): string => {
    const fullPath = namespace
      ? [...namespace.split(".").filter(Boolean), key]
      : [key];
    const resolved = getNestedValue(messages, fullPath);
    if (resolved != null) return resolved;
    return formatKeyFallback(key);
  };

  const t = (key: string, values?: Record<string, unknown>) => {
    let result = lookup(key);
    if (values) {
      for (const [k, v] of Object.entries(values)) {
        result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return result;
  };

  t.rich = (
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: Record<string, any>,
  ) => {
    const raw = lookup(key);
    if (!values) return raw;
    let result: React.ReactNode = raw;
    for (const [k, v] of Object.entries(values)) {
      if (typeof v === "function") {
        const tagRegex = new RegExp(`<${k}>(.*?)</${k}>`, "g");
        const match = tagRegex.exec(raw);
        if (match) {
          result = v(match[1]);
        }
      } else {
        result = String(result).replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return result;
  };

  t.raw = (key: string) => {
    return lookup(key);
  };

  return t;
}

/**
 * Storybook mock for `useMessages` from `next-intl`.
 */
export function useMessages(): Record<string, unknown> {
  const context = useContext(IntlContext);
  return context.messages;
}

/**
 * Storybook mock for `useFormatter` from `next-intl`.
 */
export function useFormatter() {
  return {
    dateTime: (date: Date) => date.toLocaleDateString(),
    number: (num: number) => String(num),
    relativeTime: (_date: Date) => "recently",
  };
}

/**
 * Storybook mock for `useTimeZone` from `next-intl`.
 */
export function useTimeZone(): string {
  return "UTC";
}

/**
 * Storybook mock for `useNow` from `next-intl`.
 */
export function useNow(): Date {
  return new Date();
}

/**
 * Storybook mock for `NextIntlClientProvider` injecting messages context into stories.
 */
export function NextIntlClientProvider({
  messages,
  locale = "en",
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages?: Record<string, any>;
  locale?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  const activeMessages =
    messages && Object.keys(messages).length > 0 ? messages : defaultMessages;

  return (
    <IntlContext.Provider value={{ messages: activeMessages, locale }}>
      {children}
    </IntlContext.Provider>
  );
}

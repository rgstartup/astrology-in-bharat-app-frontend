import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { isAppLocale, locales } from "@/i18n/config";
import Homepage from "./Homepage";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedHomepage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  if (!isAppLocale(locale)) notFound();
  const messages = (await import(`../../../messages/${locale}`)).default;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <Homepage searchParams={resolvedSearchParams} />
    </NextIntlClientProvider>
  );
}

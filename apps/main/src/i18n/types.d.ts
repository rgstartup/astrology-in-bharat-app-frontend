import messages from "@messages/en";
import type { AppLocale } from "./routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}

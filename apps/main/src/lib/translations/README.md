# Internationalization

`next-intl` provides the server-rendered locale for the app. The `locale`
cookie is the source of truth and is read in `src/i18n/request.ts`.

## Message files

Translations live in `apps/main/messages` as JSON files:

```text
messages/
  en/
    home.json
    profile.json
    calculators/
      love-calculator.json
  hi/
    home.json
    profile.json
    calculators/
      love-calculator.json
```

Add a matching JSON file for every supported locale. Each locale's `index.ts`
registers its own files as next-intl namespaces, which makes the complete
message set available to the request configuration.

## Component usage

Use `next-intl` rather than client-side language state for new or migrated
components:

```tsx
import {useTranslations} from 'next-intl';

export function Example() {
  const t = useTranslations('Home');
  return <h1>{t('hero.title')}</h1>;
}
```

The old TypeScript dictionaries remain temporarily for compatibility with
unmigrated imports. JSON files in `messages/` are the SSR message source.

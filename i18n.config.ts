export const i18n = {
  defaultLocale: 'rw',
  locales: ['rw', 'fr', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export type LocalizedString = { en: string; de: string }

export type Locale = 'en' | 'de'

export function localize(
  value: LocalizedString | null | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (!value) return fallback
  return value[locale] || value.en || fallback
}

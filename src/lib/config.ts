/** Application-wide locale and currency configuration.
 *  Change these two constants to update formatting across the entire app. */
export const LOCALE = 'es-CO';
export const CURRENCY = 'COP';

/** Returns a locale-formatted currency string using the app defaults. */
export function formatCurrency(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits,
  }).format(value);
}

/** Returns a locale-formatted number string using the app defaults. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat(LOCALE).format(value);
}

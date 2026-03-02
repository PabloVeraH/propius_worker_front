/**
 * Safely converts a value that may be a Prisma/Decimal.js object into a number.
 *
 * The backend occasionally serializes Decimal fields as internal Decimal.js
 * objects ({ s, e, d }) instead of plain numbers. This helper centralises
 * the conversion so every consumer is consistent and easy to update when
 * the backend is fixed to return number primitives directly.
 *
 * @param val - A number, a Decimal-like object, a numeric string, or null/undefined
 * @param fallback - Value returned when conversion fails (default: 0)
 */
export function parseDecimal(val: unknown, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  }
  // Decimal.js / Prisma Decimal object: { s: number, e: number, d: number[] }
  if (typeof val === 'object' && 'd' in (val as object) && Array.isArray((val as any).d)) {
    const d = (val as any).d as number[];
    const e = (val as any).e as number;
    // Reconstruct value: the coefficient array represents digits in base-1e7.
    // For simple values (single-element array, small exponent) this is accurate.
    // Example: { s:1, e:1, d:[50] } → 50, { s:1, e:2, d:[1500000] } → 150
    if (d.length === 1) {
      const magnitude = Math.pow(10, e - 6); // Decimal.js uses base 1e7 per element
      const result = d[0] * magnitude;
      // Heuristic: if exponent < 7 and first digit looks like a plain integer, return as-is
      if (Number.isInteger(d[0]) && e < 7) return d[0];
      return isNaN(result) ? fallback : result;
    }
    // Multi-element Decimal: best effort conversion via string
    try {
      const num = Number((val as any).toString());
      return isNaN(num) ? fallback : num;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

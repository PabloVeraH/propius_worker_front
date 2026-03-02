const CATEGORY_LABELS: Record<string, string> = {
  MAINTENANCE: 'Mantenimiento',
  UTILITIES: 'Servicios Públicos',
  SERVICES: 'Servicios',
  INSURANCE: 'Seguros',
  OTHER: 'Otros',
};

/**
 * Translates a backend category key (e.g. "MAINTENANCE") to a human-readable
 * Spanish label. Accepts both plain string keys and category objects with a
 * `name`, `label`, or `description` field.
 *
 * Returns the original value unchanged if no translation is found.
 */
export function formatCategory(category: unknown): string {
  if (!category) return '-';

  if (typeof category === 'object' && category !== null) {
    const obj = category as Record<string, unknown>;
    const key = (obj.name ?? obj.label ?? obj.description ?? '') as string;
    return CATEGORY_LABELS[key] ?? key ?? '-';
  }

  if (typeof category === 'string') {
    return CATEGORY_LABELS[category] ?? category;
  }

  return '-';
}

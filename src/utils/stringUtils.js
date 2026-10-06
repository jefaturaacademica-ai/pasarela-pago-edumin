/**
 * Normalizes text for search and string comparisons by stripping accents/tildes,
 * converting to lowercase, and removing extra whitespace.
 * e.g., "Logística" -> "logistica", "Geología" -> "geologia"
 */
export function normalizeText(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Matches candidate against search query ignoring accents, case, and whitespace.
 */
export function textMatches(candidate, query) {
  if (!query) return true;
  if (!candidate) return false;
  return normalizeText(candidate).includes(normalizeText(query));
}

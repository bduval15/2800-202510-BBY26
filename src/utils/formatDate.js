/**
 * formatDate.js
 * Loaf Life – Provides locale-aware date and time formatting.
 *
 * This utility function, `formatLocaleDate`, takes a date input (Date object,
 * timestamp, or parsable date string) and formats it into a human-readable
 * string based on specified locales and formatting options. It leverages the
 * `Intl.DateTimeFormat` API for robust internationalization.
 *
 * Features:
 * - Formats dates and times according to BCP 47 language tags.
 * - Customizable formatting options via `Intl.DateTimeFormat`.
 * - Handles various date input types.
 *
 * @author Nathan Oloresisimo
 */
function formatLocaleDate(input, locales = undefined, options = {}) {
    const date = input instanceof Date ? input : new Date(input);
    return date.toLocaleString(locales, options);
  }
  
  // Usage
  console.log(
    formatLocaleDate(new Date(), 'en-CA', {
      dateStyle: 'short',
      timeStyle: 'medium'
    })
  );
  // → "2025-05-01, 12:07:45 PM"
  
/**
 * Locale-aware date/time formatting
 * @param {Date|string|number} input     A Date, timestamp or parsable date string
 * @param {string|string[]}    locales   BCP 47 language tag(s), e.g. 'en-CA', 'fr'
 * @param {Object}             options   Intl.DateTimeFormat options
 * @returns {string}
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
  
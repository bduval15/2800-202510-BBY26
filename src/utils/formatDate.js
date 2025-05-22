/**
 * File: formatDate.js
 *
 * Loaf Life
 *   Provides locale-aware date and time formatting. Leverages the Intl.DateTimeFormat API
 *   for robust internationalization and supports BCP 47 language tags.
 *   Handles various date input types and customizable formatting options.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *
 * Main Function:
 *   @function formatLocaleDate
 *   @description Formats a date input (Date object, timestamp, or parsable string) into a
 *                human-readable string based on specified locales and options.
 *                Utilizes Intl.DateTimeFormat for internationalized formatting.
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
  
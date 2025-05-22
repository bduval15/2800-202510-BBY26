/**
 * File: toTitleCase.js
 *
 * Loaf Life
 *   Converts a string to title case, capitalizing the first letter of significant words.
 *   Minor words (e.g., "a", "the") are kept lowercase unless they are the first or last word.
 *   Handles empty or null input strings gracefully.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *   @author https://gemini.google.com/app (Portions of logic and modifications)
 *
 * Main Function:
 *   @function toTitleCase
 *   @description Transforms a string into title case. The first letter of each significant word
 *                is capitalized. Common minor words are excluded from capitalization unless they
 *                are the first or last word of the string.
 *                Handles empty or null strings by returning an empty string.
 */

const toTitleCase = (str) => {
  if (!str) return '';
  const minorWords = new Set([
    "a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to",
    "from", "by", "of", "in", "into", "near", "over", "past", "through",
    "up", "upon", "with", "without"
  ]);
  const words = String(str).toLowerCase().split(' ');
  return words.map((word, index) => {
    if (index === 0 || index === words.length - 1 || !minorWords.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
};

export default toTitleCase; 
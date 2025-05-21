/**
 * toTitleCase.js
 * Loaf Life – Converts a string to title case.
 *
 * This utility function takes a string and converts it to title case,
 * where the first letter of each word is capitalized, except for minor words 
 * (and not first/last).
 *
 * Portions of logic assisted by Google Gemini 2.5 Flash.
 *
 * Modified with assistance from Google Gemini 2.5 Flash.
 *
 * @author Nathan Oloresisimo 
 * @author https://gemini.google.com/app
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
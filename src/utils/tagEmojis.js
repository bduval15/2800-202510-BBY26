/**
 * File: tagEmojis.js
 *
 * Loaf Life
 *   Provides a mapping from tag labels to corresponding emojis and a function to retrieve them.
 *   Offers a default emoji if a specific tag is not found.
 *
 * Authorship:
 *   @author Nathan Oloresisimo
 *
 * Constants and Static Data:
 *   // Mapping of tag labels to their respective emoji representations.
 *   // const tagToEmojiMap = {...};
 *
 * Helper Functions:
 *   @function getEmojiForTag
 *   @description Retrieves an emoji for a given tag label. It first attempts an exact match,
 *                then a case-insensitive match. If no match is found, it returns a default
 *                "tag" emoji (🏷️).
 */
export const tagToEmojiMap = {
  "Event": "📅",
  "Deal": "🛍️",
  "Gaming": "🎮",
  "Cooking": "👨‍🍳",
  "Coding": "💻",
  "Photography": "📸",
  "Reading": "📖",
  "Movies": "🎬",
  "Art": "🎨",
  "Music": "🎵",
  "Investing": "📈",
  "Yoga": "🧘‍♀️",
  "Hack": "🎯",
  "Cycling": "🚴‍♀️",
  "Football": "⚽",
  "Fitness": "🏋️",
  "Public Speaking": "🗣️",
  "Study Groups": "📚",
  "Sustainability": "🌍",
  "Entrepreneurship": "💼",
  "Hiking": "🏞️",
  "Mental Health": "🧠",
  "Animal Care": "🐶",
  "Board Games": "🧩",
  "Comedy": "🎭",
  "Esports": "🕹️",  
};

export const getEmojiForTag = (tagLabel) => {  
  let emoji = tagToEmojiMap[tagLabel];
  if (emoji) return emoji;
  
  const lowerTagLabel = tagLabel.toLowerCase();
  for (const key in tagToEmojiMap) {
    if (key.toLowerCase() === lowerTagLabel) {
      return tagToEmojiMap[key];
    }
  }
  
  return "🏷️"; 
}; 
export const tagToEmojiMap = {
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
  "Hacks": "🎯",
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
  // Add other tags and their emojis here if needed
};

export const getEmojiForTag = (tagLabel) => {
  // Attempt to find a direct match (case-sensitive)
  let emoji = tagToEmojiMap[tagLabel];
  if (emoji) return emoji;

  // Attempt to find a case-insensitive match
  const lowerTagLabel = tagLabel.toLowerCase();
  for (const key in tagToEmojiMap) {
    if (key.toLowerCase() === lowerTagLabel) {
      return tagToEmojiMap[key];
    }
  }
  
  // Default emoji if no match is found
  return "🏷️"; // Default tag emoji
}; 
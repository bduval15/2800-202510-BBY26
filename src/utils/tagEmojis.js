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
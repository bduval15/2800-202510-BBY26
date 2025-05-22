/**
 * getRecommendationFromHuggingFace.js
 * Builds a prompt from an array of interests, sends it to the Hugging Face inference API,
 * and returns a casual, concise recommendation for university students. Used in the Loaf Life app
 * to power the Magic Wand feature that suggests deals, hacks, or events.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/
 *
 * @function getRecommendationFromHuggingFace
 * @description Constructs an API prompt based on user interests and fetches a generated
 *              suggestion from the Mistral-7B-Instruct model.
 * @param {string[]} interests - List of user interest keywords (e.g., "fitness", "gaming").
 * @returns {Promise<string>} A generated recommendation or a fallback message on error.
 */


/**
 * Generates and returns a short recommendation based on user interests.
 */
export async function getRecommendationFromHuggingFace(interests) {
  const prompt = `Suggest a fun, money-saving deal, hack, or event idea for a university student interested in: ${interests.join(", ")}. Keep it casual and short.`;

  // Call the Hugging Face inference API
  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
    method: "POST",
    headers: {
      Authorization: `Bearer AI_TOKEN`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  // Handle non-OK responses
  if (!response.ok) {
    throw new Error("AI API request failed");
  }

  // Parse and return the generated text or fallback message
  const data = await response.json();
  return data?.[0]?.generated_text || "Sorry, no recommendation right now.";
}

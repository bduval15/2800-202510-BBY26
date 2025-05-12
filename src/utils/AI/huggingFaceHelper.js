/**
 * getRecommendationFromHuggingFace
 * ---------------------------------
 * It builds a prompt from the interests array, calls the API, and returns
 * the generated suggestion. Used in the Loaf Life app to power the Magic Wand feature.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/
 */

export async function getRecommendationFromHuggingFace(interests) {
    const prompt = `Suggest a fun, money-saving deal, hack, or event idea for a university student interested in: ${interests.join(", ")}. Keep it casual and short.`;
  
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer AI_TOKEN`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });
  
    if (!response.ok) {
      throw new Error("AI API request failed");
    }
  
    const data = await response.json();
    return data?.[0]?.generated_text || "Sorry, no recommendation right now.";
  }
  
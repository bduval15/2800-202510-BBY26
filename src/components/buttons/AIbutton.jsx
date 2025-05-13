import { useState } from 'react';
import { clientDB } from '@/supabaseClient';

export default function AIbutton({ interests }) {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setRecommendation("");
  
    const tables = ['deals', 'hacks', 'free-events'];
  
    // Shuffle tables so it's random every time
    const shuffledTables = tables.sort(() => Math.random() - 0.5);
  
    try {
      let found = false;
  
      for (let i = 0; i < shuffledTables.length; i++) {
        const table = shuffledTables[i];
  
        const { data, error } = await clientDB
          .from(table)
          .select('title, description');
  
        if (error) {
        //   console.error(`Error fetching from ${table}:`, error.message);
          continue; // try next table
        }
  
        if (data && data.length > 0) {
          const randomItem = data[Math.floor(Math.random() * data.length)];
          setRecommendation(`${randomItem.title} – ${randomItem.description}`);
          found = true;
          break;
        }
      }
  
      if (!found) {
        throw new Error("No data found in any table.");
      }
  
    } catch (err) {
      console.error("Error in Magic Wand:", err.message);
      setRecommendation("Failed to fetch recommendation.");
    }
  
    setLoading(false);
  };
  
  

  return (
    <div className="text-center my-4">
      <button
        onClick={handleClick}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full shadow"
      >
        🪄 Get Magic Recommendation
      </button>

      {loading && <p className="mt-2 text-gray-500">Thinking...</p>}

      {recommendation && (
        <div className="mt-4 p-4 bg-white rounded shadow max-w-md mx-auto border">
          <p className="text-[#8B4C24]">{recommendation}</p>
        </div>
      )}
    </div>
  );
}

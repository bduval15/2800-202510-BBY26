/**
 * SkeletonLoaf.jsx
 * Loaf Life – fallback component displayed while profile data is loading.
 * 
 * This skeleton screen shows a pulsing loaf image and message during data fetch.
 * Used on ProfilePage while waiting on Supabase data to load.
 * 
 * Portions of layout and styling were assisted by ChatGPT for educational purposes.
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

export default function SkeletonLoaf() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 animate-fade-in">
      {/* Loading text */}
      <p className="mb-2 text-[#8B4C24] font-medium animate-pulse">Waking up the loaf…</p>

      {/* Animated placeholder image */}
      <img
        src="/images/skeleton/Skeleton.png"
        alt="Loading..."
        className="w-24 h-24 opacity-80 animate-pulse-slow"
      />
    </div>
  );
}

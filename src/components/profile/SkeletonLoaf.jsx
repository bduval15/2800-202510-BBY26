/**
 * SkeletonLoaf.jsx
 *
 * Loaf Life – Fallback animation component shown while profile data is loading.
 *
 * This animated skeleton screen shows a pulsing loaf message and graphic while
 * waiting for Supabase data (used in ProfilePage).
 *
 * Styling and animation were refined with the help of Tailwind utility classes.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 * 
 * @function SkeletonLoaf
 * @description Renders a centered animated loaf and loading message to indicate data is being fetched.
 */

/**
 * SkeletonLoaf
 * 
 * @function SkeletonLoaf
 * @returns {JSX.Element} Animated skeleton placeholder component
 */
export default function SkeletonLoaf() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 animate-fade-in">
      {/* Loading text with pulsing animation */}
      <p className="mb-2 text-[#8B4C24] font-medium animate-pulse">Waking up the loaf…</p>

      {/* Pulsing loaf image as a placeholder */}
      <img
        src="/images/skeleton/Skeleton.png"
        alt="Loading..."
        className="w-24 h-24 opacity-80 animate-pulse-slow"
      />
    </div>
  );
}

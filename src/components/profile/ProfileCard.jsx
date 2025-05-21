/**
 * ProfileCard.jsx
 * 
 * Loaf Life – Component to display the user's avatar, name, school, and an Edit button.
 *
 * This reusable profile header section allows for avatar selection and profile editing.
 * Extracted from ProfilePage and structured with reusable UI and props.
 *
 * Modularized and styled with Tailwind CSS. Built for consistent UX across Loaf Life.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 * 
 * @function ProfileCard
 * @description Renders the user's profile avatar, name, and school, along with editable options.
 */

import { PencilIcon } from '@heroicons/react/24/outline'

/**
 * ProfileCard
 * 
 * @function ProfileCard
 * @returns {JSX.Element} Profile summary section for display and interaction
 */
export default function ProfileCard({
  selectedAvatar,      // URL to user's selected avatar
  name,                // Display name of the user
  school,              // User's school information
  onEditClick,         // Triggers Edit Profile modal
  onAvatarClick,       // Triggers Avatar selection modal
}) {
  return (
    <section className="relative max-w-md mx-auto bg-white p-4 pb-12 rounded-xl border border-[#D1905A] shadow-md mt-10 text-center">

      {/* ---------- Avatar Display Block ---------- */}
      <div
        className="relative w-30 h-30 mx-auto mb-4 mt-6 group cursor-pointer"
        onClick={onAvatarClick}
        title="Change avatar"
      >
        {/* Avatar Image */}
        <img
          src={selectedAvatar}
          alt="User Avatar"
          className="w-full h-full object-contain rounded-full transition"
        />

        {/* Hover Overlay with Pencil Icon */}
        <div
          className="absolute bottom-0 right-0 bg-[#F5E3C6] p-1 rounded-full shadow 
                     group-hover:bg-[#639751] transition"
        >
          <PencilIcon className="h-4 w-4 text-[#8B4C24] group-hover:text-white transition" />
        </div>
      </div>

      {/* ---------- Name & School Info ---------- */}
      <h1 className="text-2xl font-bold mb-1">{name}</h1>
      <p className="text-[#C27A49] text-sm">{school}</p>

      {/* ---------- Edit Button (Bottom Right) ---------- */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={onEditClick}
          className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24]
                     text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
        >
          <span>Edit</span>
        </button>
      </div>
    </section>
  )
}


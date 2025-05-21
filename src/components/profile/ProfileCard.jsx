/**
 * ProfileCard.jsx
 * Loaf Life – component for rendering the user's avatar, name, school, and Edit button.
 *
 * Props:
 * - selectedAvatar (string): the user's avatar image URL
 * - name (string): the user's name
 * - school (string): the user's school
 * - onEditClick (function): handler to open Edit Profile modal
 * - onAvatarClick (function): handler to open Avatar Selector modal
 *
 * Modularized from ProfilePage. Styling and structure assisted by ChatGPT for educational purposes.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author Aleen Dawood
 * 
 * @author https://chatgpt.com/*
 */

import { PencilIcon } from '@heroicons/react/24/outline'

export default function ProfileCard({
  selectedAvatar,
  name,
  school,
  onEditClick,
  onAvatarClick,
}) {
  return (
    <section className="relative max-w-md mx-auto bg-white p-4 pb-12 rounded-xl border border-[#D1905A] shadow-md mt-10 text-center">
      {/* Avatar wrapper */}
      <div
        className="relative w-30 h-30 mx-auto mb-4 mt-6 group cursor-pointer"
        onClick={onAvatarClick}
        title="Change avatar"
      >
        {/* actual avatar */}
        <img
          src={selectedAvatar}
          alt="User Avatar"
          className="w-full h-full object-contain rounded-full transition"
        />

        {/* pencil overlay */}
        <div
          className="absolute bottom-0 right-0 bg-[#F5E3C6] p-1 rounded-full shadow 
                     group-hover:bg-[#639751] transition"
        >
          <PencilIcon className="h-4 w-4 text-[#8B4C24] group-hover:text-white transition" />
        </div>
      </div>
      
      {/* Display name and school */}
      <h1 className="text-2xl font-bold mb-1">{name}</h1>
      <p className="text-[#C27A49] text-sm">{school}</p>

      {/* Edit button (opens profile editor modal) */}
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


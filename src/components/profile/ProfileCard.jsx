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
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

export default function ProfileCard({ selectedAvatar, name, school, onEditClick, onAvatarClick }) {
    return (
        <section className="relative max-w-md mx-auto bg-white p-12 rounded-xl shadow-md text-center">
            {/* User Avatar – click to change */}
            <img
                src={selectedAvatar}
                alt="User Avatar"
                className="w-24 h-24 mx-auto object-contain mb-4 cursor-pointer"
                onClick={onAvatarClick}
            />

            {/* Display name and school */}
            <h1 className="text-2xl font-bold mb-1">{name}</h1>
            <p className="text-[#C27A49] text-sm">{school}</p>

            {/* Edit button (opens profile editor modal) */}
            <div className="absolute bottom-4 right-4">
                <button
                    onClick={onEditClick}
                    className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
                >
                    <span>Edit</span>
                </button>
            </div>
        </section>
    );
}

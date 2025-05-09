/**
 * ProfileCard.jsx
 * Renders the user's avatar, name, and school, and an Edit button.
 * Props:
 * - selectedAvatar
 * - name
 * - school
 * - onEditClick (opens Edit Profile modal)
 * - onAvatarClick (opens Avatar Selector modal)
 */

export default function ProfileCard({ selectedAvatar, name, school, onEditClick, onAvatarClick }) {
    return (
        <section className="relative max-w-md mx-auto bg-white p-12 rounded-xl shadow-md text-center">
            {/* Avatar */}
            <img
                src={selectedAvatar}
                alt="User Avatar"
                className="w-24 h-24 mx-auto object-contain mb-4 cursor-pointer"
                onClick={onAvatarClick} 
            />

            {/* Name and School */}
            <h1 className="text-2xl font-bold mb-1">{name}</h1>
            <p className="text-[#C27A49] text-sm">{school}</p>

            {/* Edit Button */}
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

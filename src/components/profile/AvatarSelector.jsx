/**
 * AvatarSelector.jsx
 * 
 * Loaf Life – Component for selecting a user avatar from a fixed list.
 *
 * Displays a grid of avatar images. Highlights the currently selected one.
 * Allows users to preview hover styles and select an avatar with one click.
 * 
 * Styling uses Tailwind CSS for layout, hover effects, and ring indicators.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * Portions of layout and selection logic were refined using ChatGPT for educational purposes.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 *
 * @function AvatarSelector
 * @description Renders a grid of avatars. Handles hover and click selection.
 *              Highlights current selection with a ring and applies hover outline.
 */

"use client";

import React, { useState } from "react";

// -------------------- Constants --------------------

// List of avatar image paths available for user selection
export const AVATAR_OPTIONS = [
    "/images/avatars/avatar1.png",
    "/images/avatars/avatar2.png",
    "/images/avatars/avatar3.png",
    "/images/avatars/avatar4.png",
    "/images/avatars/avatar5.png",
    "/images/avatars/avatar6.png",
    "/images/avatars/avatar7.png",
    "/images/avatars/avatar8.png",
    "/images/avatars/avatar9.png",
];

/**
 * AvatarSelector
 * 
 * @function AvatarSelector
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Function to handle avatar click
 * @param {string} props.selectedAvatar - Path of the currently selected avatar
 * @returns {JSX.Element} The avatar grid component
 */
export default function AvatarSelector({ onSelect, selectedAvatar }) {
    // -------------------- State --------------------

    // Tracks which avatar the user is hovering over
    const [hovered, setHovered] = useState(null);

    // -------------------- Render --------------------

    return (
        // Avatar grid layout
        <div className="grid grid-cols-3 gap-4 p-4">
            {AVATAR_OPTIONS.map((avatar, index) => {
                const isSelected = selectedAvatar === avatar;
                const isHovered = hovered === index;

                return (
                    // Each avatar box
                    <div
                        key={index}
                        onClick={() => onSelect(avatar)} // Select avatar on click
                        onMouseEnter={() => setHovered(index)} // Track hover
                        onMouseLeave={() => setHovered(null)} // Clear hover
                        className={`
                          relative w-22 h-22 rounded-full flex items-center justify-center 
                          transition duration-200 ease-in-out cursor-pointer 
                          ring-offset-2 ring-4
                          ${isSelected ? "ring-[#639751]" : isHovered ? "ring-[#C27A49]" : "ring-transparent"}
                         `}
                    >
                        {/* Avatar image */}
                        <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-full"
                            draggable={false}
                        />
                    </div>
                );
            })}
        </div>
    );
}
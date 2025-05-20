/**
 * AvatarSelector.jsx
 * Loaf Life – component for selecting a user avatar from a predefined list of images.
 *
 * This reusable UI component allows users to choose an avatar by clicking on an image.
 * Tailwind CSS is used for layout, styling, and hover/selection states.
 *
 * Portions of this code, including grid layout, avatar hover logic, and styling best practices,
 * were refined with the assistance of ChatGPT o4-mini-high for educational purposes.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

"use client";

import React, { useState } from "react";

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
 * AvatarSelector component
 * 
 * Props:
 * - onSelect (function): callback when an avatar is clicked
 * - selectedAvatar (string): the currently selected avatar path
 */
export default function AvatarSelector({ onSelect, selectedAvatar }) {
    const [hovered, setHovered] = useState(null); // Tracks which avatar is currently hovered

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {AVATAR_OPTIONS.map((avatar, index) => {
                const isSelected = selectedAvatar === avatar;
                const isHovered = hovered === index;

                return (
                    <div
                        key={index}
                        onClick={() => onSelect(avatar)}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        className={`
    relative w-22 h-22 rounded-full flex items-center justify-center 
    transition duration-200 ease-in-out cursor-pointer 
    ring-offset-2 ring-4
    ${isSelected ? "ring-[#639751]" : isHovered ? "ring-[#C27A49]" : "ring-transparent"}
  `}
                    >
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
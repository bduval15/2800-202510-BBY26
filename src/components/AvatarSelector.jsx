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
 * @author https://chatgpt.com/*
 */

"use client";

// Import React and useState hook for managing component state
import React, { useState } from "react";

// Define 8 avatar image paths.
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

// Functional component takes 2 parts:
// onSelect - a callback when the user clicks on an avatar 
// selectedAvatar - the currently selected avatar's path
export default function AvatarSelector({ onSelect, selectedAvatar }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {AVATAR_OPTIONS.map((avatar, index) => (
                <div
                    key={index}
                    onClick={() => onSelect(avatar)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer p-1 transition"
                    style={{
                        outline:
                            selectedAvatar === avatar
                                ? "3px solid #639751"
                                : hovered === index
                                    ? "3px solid #C27A49"
                                    : "none",
                        borderRadius: "9999px",
                        outlineOffset: "3px",
                    }}
                >
                    <img
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        className="w-20 h-20 object-contain"
                        draggable={false}
                    />
                </div>
            ))}
        </div>
    );
}

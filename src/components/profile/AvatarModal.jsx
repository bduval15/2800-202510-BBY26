/**
 * AvatarModal.jsx
 * Loaf Life – reusable modal component for avatar selection.
 * 
 * Displays the avatar selector UI and handles avatar selection and cancellation.
 * Props:
 * - selectedAvatar (string): the currently selected avatar URL
 * - onSelect (function): callback function when an avatar is selected
 * - onClose (function): callback to close the modal
 * 
 * Extracted and modularized from ProfilePage with assistance from ChatGPT o4-mini-high.
 * Portions of styling and layout were assisted by ChatGPT for educational purposes.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

import { useState } from "react";
import AvatarSelector from '@/components/profile/AvatarSelector';

export default function AvatarModal({ selectedAvatar, onSave, onClose }) {
    // Local temp state to allow previewing avatar changes without immediately saving
    const [tempAvatar, setTempAvatar] = useState(selectedAvatar);

    return (
        // Full-screen overlay background
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            {/* Modal container */}
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Choose an Avatar</h2>

                {/* Avatar selection grid */}
                <AvatarSelector
                    selectedAvatar={tempAvatar}
                    onSelect={setTempAvatar}
                />

                {/* Action buttons */}
                <div className="flex justify-between gap-2 mt-4 w-full">
                    <button
                        onClick={onClose} // Close modal without saving
                        className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-4 py-2 rounded hover:bg-[#e3cba8] transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            onSave(tempAvatar); // Save selected avatar
                            onClose();          // Then close modal
                        }}
                        className="bg-[#639751] text-white font-medium px-4 py-2 rounded hover:bg-[#6bb053] transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

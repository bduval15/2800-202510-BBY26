/**
 * AvatarModal.jsx
 * 
 * Loaf Life – Reusable modal for selecting a user avatar.
 * 
 * Props:
 * - selectedAvatar (string): Currently selected avatar image URL
 * - onSave (function): Callback invoked when the user saves a new avatar
 * - onClose (function): Callback invoked when the modal is closed
 * 
 * Extracted and modularized from ProfilePage with assistance from ChatGPT o4-mini-high.
 * Portions of layout and styling were assisted by ChatGPT for educational purposes.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 *
 * @function AvatarModal
 * @description Displays a full-screen avatar picker modal with Cancel and Save buttons.
 *              Allows the user to preview and select an avatar without committing until saved.
 */

import { useState } from "react";
import AvatarSelector from '@/components/profile/AvatarSelector';

/**
 * AvatarModal
 * 
 * @function AvatarModal
 * @param {Object} props - React props object
 * @param {string} props.selectedAvatar - Current avatar URL to display
 * @param {Function} props.onSave - Callback to save new avatar
 * @param {Function} props.onClose - Callback to close modal
 * @returns {JSX.Element} Modal overlay with avatar selector
 */
export default function AvatarModal({ selectedAvatar, onSave, onClose }) {
    // -------------------- STATE --------------------

    // Temporary avatar selection for previewing changes
    const [tempAvatar, setTempAvatar] = useState(selectedAvatar);

    return (
        // Full-screen overlay background
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

            {/* Modal container */}
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                {/* Modal heading */}
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Choose an Avatar</h2>

                {/* Avatar grid selection component */}
                <AvatarSelector
                    selectedAvatar={tempAvatar}
                    onSelect={setTempAvatar}
                />

                {/* Button row: Cancel & Save */}
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

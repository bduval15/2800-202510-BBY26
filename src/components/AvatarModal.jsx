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
 * @author https://chatgpt.com/*
 */

import AvatarSelector from '@/components/AvatarSelector';

export default function AvatarModal({ selectedAvatar, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Choose an Avatar</h2>
                <AvatarSelector
                    selectedAvatar={selectedAvatar}
                    onSelect={(avatar) => {
                        onSelect(avatar);
                        onClose();
                    }}
                />
                <button
                    onClick={onClose}
                    className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-6 py-2 rounded hover:bg-[#e3cba8] transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
} 

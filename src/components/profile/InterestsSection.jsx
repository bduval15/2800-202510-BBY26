/**
 * InterestsSection.jsx
 * 
 * Loaf Life – Reusable component to display and edit a user's interest tags.
 * 
 * This component shows a list of emoji-based interest tags and allows users to update their selections
 * via a modal interface. Users can select from a predefined list, with a max selection limit.
 *
 * Extracted from ProfilePage and modularized with assistance from ChatGPT o4-mini-high.
 * Portions of layout, tag styling, and modal UX refined for learning purposes.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 * 
 * @function InterestsSection
 * @description Renders the selected interest tags and provides an editable modal to update them.
 */

import React from "react";

/**
 * InterestsSection
 * 
 * @function InterestsSection
 * @returns {JSX.Element} Interest tag display and editing interface
 */
export default function InterestsSection({
    interests = [],                 // Current interests (display-only)
    editInterests = [],             // Temporary state for editing
    setEditInterests = () => { },   // Setter for updated selection
    showEditInterests = false,      // Controls modal visbility 
    setShowEditInterests = () => { },
    onSaveInterests = () => { },    // Callback to save interests
    predefinedInterests = [],       // List of predefined options
    maxSelection = 5,               //  Limit for selected interests
}) {
    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#D1905A] shadow-md mt-6">

            {/* ---------- Section Title ---------- */}
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">
                My Interests
            </h2>

            {/* ---------- Display Current Interests ---------- */}
            <div className="flex flex-wrap gap-2 text-sm mb-4">
                {interests.map((interest, index) => (
                    <span
                        key={index}
                        className="bg-[#FFE2B6] px-4 py-2 rounded-full flex items-center gap-1"
                    >
                        <span>{interest.emoji}</span>
                        <span>{interest.label}</span>
                    </span>
                ))}
            </div>

            {/* ---------- Edit Button ---------- */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowEditInterests(true)}
                    className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
                >
                    <span>Edit</span>
                </button>
            </div>

            {/* ---------- Interest Selection Modal ---------- */}
            {showEditInterests && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

                    {/* Modal container */}
                    <div className="bg-white p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">

                        {/* Modal heading */}
                        <h2 className="text-lg font-bold text-[#8B4C24] mb-4 text-center">
                            Choose up to {maxSelection} Interests
                        </h2>

                        {/* ---------- Interest Buttons Grid ---------- */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 justify-items-center">
                            {predefinedInterests.map((interest) => {
                                const isSelected = editInterests.some(
                                    (i) => i.label === interest.label
                                );

                                return (
                                    <button
                                        key={interest.label}
                                        type="button"
                                        onClick={() => {
                                            // Toggle selection or prevent going over max
                                            if (isSelected) {
                                                setEditInterests(
                                                    editInterests.filter((i) => i.label !== interest.label)
                                                );
                                            } else if (editInterests.length < maxSelection) {
                                                setEditInterests([...editInterests, interest]);
                                            }
                                        }}
                                        className={`flex items-center justify-center px-4 py-1.5 text-sm rounded-full border transition duration-200 ease-in-out shadow-sm whitespace-nowrap
                      ${isSelected
                                                ? "bg-[#D0F0C0] text-[#23472D] border-[#7DC383]"
                                                : "bg-white text-[#4B3E2A] border-gray-300 hover:bg-[#f4f4f4]"}`}
                                    >
                                        <span className="mr-1">{interest.emoji}</span> {interest.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ---------- Modal Buttons ---------- */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setShowEditInterests(false)}
                                className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-4 py-1.5 rounded hover:bg-[#e3cba8] transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onSaveInterests}
                                className="bg-[#639751] text-white font-medium px-6 py-1.5 rounded hover:bg-[#6bb053] transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

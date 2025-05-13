/**
 * SavedHacksSection.jsx
 * Displays a list of saved hacks from the user's profile.
 * 
 * Props:
 * - hacks (array of strings)
 * 
 * This reusable component is part of the Loaf Life user profile system.
 * 
 * Portions of styling and layout were assisted by ChatGPT for educational purposes (e.g., Tailwind class structuring, semantic HTML structure).
 * 
 * Turned saved hacks section of profile page into reusable component.
 * Modified with assistance from ChatGPT o4-mini-high.
 * @author https://chatgpt.com/*
 */

export default function SavedHacksSection({ hacks = [] }) {
    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6 mb-10">
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Hacks</h2>
            <ul className="space-y-2">
                {hacks.length > 0 ? (
                    hacks.map((hack, index) => (
                        <li key={index} className="bg-[#FFE2B6] p-3 rounded-md">
                            {hack}
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-500">No saved hacks yet.</li>
                )}
            </ul>
        </section>
    );
}

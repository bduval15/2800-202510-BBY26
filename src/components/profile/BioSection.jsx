/**
 * BioSection.jsx
 * Loaf Life – reusable component to display the user's bio information section.
 * 
 * This component renders a styled card with the user's bio.
 * 
 * Props:
 * - bio (string): the user's bio text to be displayed
 *
 * Portions of layout and styling were assisted by ChatGPT for learning purposes (e.g., Tailwind card structuring).
 *
 * Extracted from ProfilePage and refactored as a reusable component with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

export default function BioSection({ bio }) {
    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#D1905A] shadow-md mt-6">
            {/* Section title */}
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Bio</h2>

            {/* Display the bio content, allowing line breaks */}
            <p className="text-sm text-[#5C3D2E] whitespace-pre-line">
                {bio}
            </p>
        </section>
    );
}
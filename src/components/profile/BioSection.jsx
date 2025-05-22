/**
 * BioSection.jsx
 * 
 * Loaf Life – Reusable UI component to display the user's bio in a styled card.
 *
 * Renders a card with the user's bio content and a section title.
 * Used within the ProfilePage to present personal details.
 * 
 * Styling and layout follow Tailwind standards for consistency with the app’s theme.
 *
 * Extracted from ProfilePage and refactored as a modular component
 * with assistance from ChatGPT o4-mini-high.
 *
 * Portions of layout and card styling were assisted by ChatGPT for educational purposes.
 *
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 *
 * @function BioSection
 * @description Renders the user’s biography inside a styled card section.
 *              Displays the content with support for multiline formatting.
 */


/** 
 * BioSection
 * 
 * @function BioSection
 * @param {Object} props
 * @param {string} props.bio - The user’s biography text to be displayed
 * @returns {JSX.Element} A styled card containing the bio content.
 */
export default function BioSection({ bio }) {
    return (
        // Bio section container with max width, padding, and styled border
        <section className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#D1905A] shadow-md mt-6">

            {/* Section heading */}
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Bio</h2>

            {/* Render user bio with preserved line breaks */}
            <p className="text-sm text-[#5C3D2E] whitespace-pre-line">
                {bio}
            </p>
        </section>
    );
}
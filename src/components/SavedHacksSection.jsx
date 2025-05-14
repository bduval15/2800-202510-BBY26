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

import HackCard from "@/components/cards/HackCard";

export default function SavedHacksSection({ hacks = [] }) {
    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6 mb-10">
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Hacks</h2>
            <div className="space-y-4">
                {hacks.length > 0 ? (
                    hacks
                        .filter((hack) => hack?.id && hack?.title)
                        .map((hack) => (
                            <HackCard
                                key={hack.id}
                                id={hack.id}
                                href={`/hacks-page/${hack.id}`}
                                title={hack.title}
                                upvotes={hack.upvotes}
                                downvotes={hack.downvotes}
                                tags={hack.tags}
                                description={hack.description}
                            />
                        ))
                ) : (
                    <p className="text-sm text-[#8B4C24] italic">
                        You haven’t saved any hacks yet. Start exploring and tap the bookmark icon to save your favorites!
                    </p>
                )}
            </div>
        </section>
    );
}

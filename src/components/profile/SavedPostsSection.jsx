/**
 * SavedPostsSection.jsx
 * 
 * Loaf Life – Displays all saved posts (hacks, deals, events) from the user profile.
 *
 * Dynamically renders HackCard, DealCard, or EventCard based on post type.
 * If no posts are saved, shows a friendly empty-state message with a call to action.
 *
 * Originally based on SavedHacksSection; refactored for broader post type support.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/
 * 
 * @function SavedPostsSection
 * @description Renders the user's saved posts list (hacks, deals, events), or an empty state UI.
 */

'use client';

import HackCard from "@/components/cards/HackCard";
import DealCard from "@/components/cards/DealCard";
import EventCard from "@/components/cards/EventCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * SavedPostsSection
 * 
 * @function SavedPostsSection
 * @returns {JSX.Element} The complete saved post section including cards and fallback
 */
export default function SavedPostsSection({ posts = [] }) {
    const router = useRouter();

    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-xl border border-[#D1905A] shadow-md mt-6 mb-10">
            {/* Section title */}
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Posts</h2>

            {/* Post list or fallback message */}
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) => {
                        if (post.type === "hack") {
                            return (
                                <HackCard
                                    key={post.id}
                                    id={post.id}
                                    href={`/hacks-page/${post.id}`}
                                    title={post.title}
                                    upvotes={post.upvotes}
                                    downvotes={post.downvotes}
                                    tags={post.tags}
                                    description={post.description}
                                />
                            );
                        } else if (post.type === "deal") {
                            return (
                                <DealCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    location={post.location}
                                    price={post.price}
                                />
                            );
                        } else if (post.type === "event") {
                            return (
                                <EventCard
                                    key={post.id}
                                    id={post.id}
                                    title={post.title}
                                    location={post.location}
                                    price={post.price}
                                    upvotes={post.upvotes}
                                    downvotes={post.downvotes}
                                    tags={post.tags}
                                    userId={post.userId}
                                    createdAt={post.createdAt}
                                    href={`/events-page/${post.id}`}
                                />
                            );
                        } else {
                            return null; // Skip if unknown type
                        }
                    })
                ) : (
                    // Empty state when no saved posts
                    <div className="flex flex-col items-center text-center bg-[#F5E3C6] border border-[#D1905A] rounded-2xl p-6 shadow-md">
                        <Image
                            src="/images/loafs/sad-loaf.png"
                            alt="No saved posts"
                            width={100}
                            height={100}
                            className="mb-4"
                        />
                        <p className="italic text-[#8B4C24] text-sm">
                            You haven’t saved any posts yet. Start exploring and tap the bookmark icon to save hacks or deals!
                        </p>

                        {/* Browse CTA button */}
                        <button
                            onClick={() => router.push("/main-feed-page")}
                            className="mt-4 bg-[#D1905A] hover:bg-[#b6723f] text-white font-semibold py-2 px-4 rounded-xl text-sm"
                        >
                            Browse
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

/**
 * SavedPostsSection.jsx
 * Displays a list of saved posts (hacks and deals) from the user's profile.
 * 
 * Props:
 * - posts (array of objects) — includes saved hacks and deals, each with a `type` field ("hack" or "deal")
 * 
 * This reusable component is part of the Loaf Life user profile system.
 * It dynamically renders HackCard or DealCard components based on the post type.
 * 
 * Portions of styling and layout were assisted by ChatGPT for educational purposes (e.g., Tailwind class structuring, semantic HTML structure).
 * Originally based on the SavedHacksSection. Renamed and refactored to support multiple post types.
 * Modified with assistance from ChatGPT o4-mini-high.
 * @author https://chatgpt.com/*
 */

'use client';

import HackCard from "@/components/cards/HackCard";
import DealCard from "@/components/cards/DealCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SavedPostsSection({ posts = [] }) {
    const router = useRouter();

    return (
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6 mb-10">
            <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Posts</h2>
            <div className="space-y-4">
                {posts.length > 0 ? (
                    posts.map((post) =>
                        post.type === "hack" ? (
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
                        ) : (
                            <DealCard
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                location={post.location}
                                price={post.price}
                            />
                        )
                    )
                ) : (
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

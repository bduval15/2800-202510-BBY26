/**
 * Main Feed page.jsx
 * 
 * Loaf Life – The Main Feed page where 
 * all of our discussion boards will be hosted.
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * Images for the threads covers generated by ChatGPT o4-mini-high.
 * 
 * @author Brady Duval
 * @author https://chatgpt.com/
 *
 * @function MainFeed
 * @description Renders the main discussion feed UI, including sort controls,
 *              thread cards, AI recommendation button, and navigation bars.
 *
 * @function fetchInterests
 * @description Retrieves the current user’s interests from Supabase
 *              and stores them in state for the AI recommendation logic.
 *
 * @function fetchPostCounts
 * @description Executes parallel count queries on each thread table
 *              ('deals', 'hacks', 'events') to determine the total posts,
 *              then updates state with those counts.
 *
 * @function fetchLatestDates
 * @description Fetches the `created_at` timestamp of the most recent post
 *              in each thread table and updates state with those dates.
 *
 * @function visibleThreads
 * @description Memoized computation that combines static thread metadata
 *              with live post counts and latest post dates, then sorts
 *              them based on the active filter ('Popular' or 'Recent').
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StickyNavbar from '@/components/StickyNavbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import {
    ClipboardIcon,
} from '@heroicons/react/24/outline';

import AIbutton from '@/components/buttons/AIbutton';
import { clientDB } from '@/supabaseClient';

const threads = [
    {
        id: 1,
        title: 'Deals',
        description: 'Unlock exclusive deals, coupons & student discounts across Metro Vancouver',
        postCount: 0,
        imageUrl: '/images/threads/dealsThread.png',
        link: '/deals-page'
    },
    {
        id: 2,
        title: 'Hacks',
        description: 'Time-saving tips, study shortcuts & productivity tricks to supercharge your day',
        postCount: 0,
        imageUrl: '/images/threads/hacksThread.png',
        link: '/hacks-page'
    },
    {
        id: 3,
        title: 'Events',
        description: 'Discover local workshops, meetups & fun happenings in your neighborhood',
        postCount: 0,
        imageUrl: '/images/threads/eventsThread.png',
        link: '/events-page'
    },
]

const tableMap = {
    1: 'deals',
    2: 'hacks',
    3: 'events',
}

/**
 * MainFeed
 *
 * @function MainFeed
 * @description Renders the main discussion feed UI, including navigation bars,
 *              sort controls, thread cards, AI recommendation button, and footer.
 * @returns {JSX.Element} The complete main feed component.
 */
export default function MainFeed() {
    // State for which sort filter is active: 'Popular' or 'Recent'
    const [activeFilter, setActiveFilter] = useState(null);

    // User interests fetched from their profile
    const [interests, setInterests] = useState([]);

    // Loading flag for initial data fetch
    const [loading, setLoading] = useState(true);

    // Map of thread ID → number of posts in that thread
    const [postCounts, setPostCounts] = useState({});

    // Options for the sort control buttons
    const filterOptions = ['Popular', 'Recent'];

    // Map of thread ID → timestamp of the most recent post
    const [latestDates, setLatestDates] = useState({});

    /**
   * fetchInterests
   *
   * @async
   * @function fetchInterests
   * @description Retrieves the current user’s interests from the `user_profiles` table
   *              in Supabase and stores them in state. Sets `loading` to false afterward.
   */
    useEffect(() => {
        const fetchInterests = async () => {
            // Get current user
            const { data: { user } } = await clientDB.auth.getUser();
            if (!user) return;

            // Query user_profiles table for interests
            const { data, error } = await clientDB
                .from('user_profiles')
                .select('interests')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Failed to fetch interests:', error.message);
            } else if (data?.interests) {
                // Normalize interests into an array
                setInterests(Array.isArray(data.interests)
                    ? data.interests
                    : data.interests.split(','));
            }

            // Done loading user interests
            setLoading(false);
        };

        fetchInterests();
    }, []);


    /**
   * fetchPostCounts
   *
   * @async
   * @function fetchPostCounts
   * @description Executes parallel count queries against each thread’s table
   *              ('deals', 'hacks', 'events') to determine how many posts exist,
   *              then updates `postCounts` state.
   */
    useEffect(() => {
        const fetchPostCounts = async () => {
            const countsMap = {}

            // Parallel count queries for deals, hacks, events
            await Promise.all(
                threads.map(async (t) => {
                    const table = tableMap[t.id]
                    if (!table) return
                    const { count, error } = await clientDB
                        .from(table)
                        .select('id', { count: 'exact', head: true })

                    if (error) {
                        console.error(`Error counting ${table}:`, error)
                        countsMap[t.id] = 0
                    } else {
                        countsMap[t.id] = count ?? 0
                    }
                })
            )

            setPostCounts(countsMap)
        }
        fetchPostCounts()
    }, [])

    /**
    * fetchLatestDates
    *
    * @async
    * @function fetchLatestDates
    * @description Fetches the `created_at` timestamp of the most recent post
    *              in each thread table and updates `latestDates` state.
    */
    useEffect(() => {
        const fetchLatestDates = async () => {
            const map = {};

            // Parallel queries to get newest created_at per table
            await Promise.all(
                threads.map(async (t) => {
                    const table = tableMap[t.id];
                    if (!table) return;

                    const { data, error } = await clientDB
                        .from(table)
                        .select('created_at', { head: false })
                        .order('created_at', { ascending: false })
                        .limit(1);

                    if (error) {
                        console.error(`Error fetching latest date for ${table}:`, error);
                    } else if (data && data.length > 0 && data[0]?.created_at) {
                        map[t.id] = data[0].created_at;
                    }
                })
            );

            setLatestDates(map);
        };

        fetchLatestDates();
    }, []);

    /**
    * visibleThreads
    *
    * @function visibleThreads
    * @description Memoized computation that combines `threads` metadata
    *              with real-time `postCounts` and `latestDates`, then sorts
    *              them based on `activeFilter`.
    * @returns {Array} Array of enriched thread objects ready for rendering.
    */
    const visibleThreads = useMemo(() => {
        const enriched = threads.map((t) => ({
            ...t,
            postCount: postCounts[t.id] ?? t.postCount,
            latest: latestDates[t.id] ?? null,
        }));

        if (activeFilter === 'Popular') {
            // Sort by descending post count
            return [...enriched].sort((a, b) => b.postCount - a.postCount);
        } else if (activeFilter === 'Recent') {
            // Sort by descending most recent post date
            return [...enriched].sort(
                (a, b) =>
                    new Date(b.latest).getTime() -
                    new Date(a.latest).getTime()
            );
        }

        // No filter: return in original order
        return enriched;
    }, [activeFilter, postCounts, latestDates]);

    return (
        <div className="flex flex-col h-screen bg-[#F5E3C6] pt-16">
            {/* Sticky top navigation */}
            <StickyNavbar />

            {/* Sort controls */}
            <div className="p-4 border-b border-[#D1905A] max-w-md mx-auto w-full">
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="font-semibold text-sm text-[#8B4C24]">Sort by:</span>
                    {['Popular', 'Recent'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setActiveFilter(prev => (prev === opt ? null : opt))}
                            title={opt === 'Popular'
                                ? 'Order threads by total number of posts'
                                : 'Order threads by date of most recent post'}
                            className={`
          px-4 py-1 text-sm font-medium rounded-full transition
          ${activeFilter === opt ? 'bg-[#639751] text-white' : 'bg-white text-[#8B4C24] hover:bg-gray-100'}
        `}
                        >
                            {opt === 'Popular' ? 'Most Posts' : 'Newest Post'}
                        </button>
                    ))}
                    <button
                        onClick={() => setActiveFilter(null)}
                        className="px-2 py-1 text-sm font-semibold text-[#8B4C24] hover:text-[#639751] transition"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Scrollable threads feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full relative pb-16">
                {visibleThreads.map((t) => (
                    <Link key={t.id} href={t.link} passHref className="block">
                        <div
                            className="
                            relative
                            h-48
                            rounded-2xl
                            overflow-hidden
                            shadow-lg
                            bg-cover
                            bg-center
                            transition-transform duration-200
                            hover:scale-105 hover:shadow-2xl
                            cursor-pointer
                            shadow-xl  
                            ring-2 ring-[#D1905A]
                            "
                            style={{
                                backgroundImage: `url(${t.imageUrl})`
                            }}
                        >
                            {/* Background image */}
                            <Image
                                src={t.imageUrl}
                                alt={t.title}
                                fill
                                className="object-cover"
                                quality={100}
                                sizes="(max-width: 768px) 100vw, 600px"
                                priority
                            />
                            {/* Dark gradient for legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Title */}
                            <h2 className="absolute bottom-14 left-4 text-white text-lg font-semibold">
                                {t.title}
                            </h2>

                            {/* Description */}
                            <p className="absolute bottom-4 left-4 text-white/80 text-sm">
                                {t.description}
                            </p>

                            {/* Post-count badge */}
                            <div className="
                              absolute
                              top-4 right-4
                              inline-flex items-center
                              bg-white/90 text-[#8B4C24]
                              text-xs font-medium
                              px-2 py-0.5 rounded-full
                              border-2 border-[#D1905A]
                            ">
                                <ClipboardIcon className="w-4 h-4 mr-1" />
                                {t.postCount}
                            </div>
                        </div>
                    </Link>
                ))}

                {/* AI recommendation button */}
                <div className="px-4 py-2 max-w-md mx-auto w-full">
                    <AIbutton interests={interests} />
                </div>
                {/* Page footer */}
                <Footer />
            </div>
            {/* Bottom navigation for mobile */}
            <BottomNav />
        </div>
    );
}

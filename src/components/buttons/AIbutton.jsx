/**
 * AIbutton.jsx
 * Renders a floating Magic Wand button that fetches and displays a personalized recommendation
 * card (deal, hack, or event) based on user interests from the Supabase database.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 *
 * @author Natalia Arseniuk
 * @author https://chatgpt.com/
 *
 * @function AIbutton
 * @description Provides a UI button that, when clicked, queries Supabase tables (deals, hacks, events)
 *              for items matching user interests, and shows the result in a styled popup card.
 *              Includes states for loading, last shown item, tooltip guidance, and handles no-interest
 *              and no-match scenarios.
 */

'use client'

// React hooks for component state and lifecycle
import { useState, useEffect } from 'react'
// Next.js Image component for optimized loading
import Image from 'next/image'
// Supabase client instance for querying database
import { clientDB } from '@/supabaseClient'

// Card components for rendering different recommendation types
import HackCard from '@/components/cards/HackCard'
import DealCard from '@/components/cards/DealCard'
import EventCard from '@/components/cards/EventCard'

// Framer Motion for button animation
import { motion } from 'framer-motion'

export default function AIbutton({ interests }) {
    /** State Hooks **/
    // Current recommendation data (table, id, and fields)
    const [recommendationCard, setRecommendationCard] = useState(null)
    // Tracks last displayed item ID to avoid repeats
    const [lastCardId, setLastCardId] = useState(null)
    // Popup visibility
    const [isOpen, setIsOpen] = useState(false)
    // Loading indicator when fetching recommendation
    const [loading, setLoading] = useState(false)
    // Tooltip visibility on initial load
    const [showTooltip, setShowTooltip] = useState(true)

    /** Tooltip Timeout Effect **/
    useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(false), 3500)
        return () => clearTimeout(timer)
    }, [])

    /** 
    * @async
    * @function handleClick
    * @description Fetches a recommendation by querying shuffled tables for matching tags,
    *              handles no-interests and no-matches cases, and updates state accordingly.
    */
    const handleClick = async () => {
        setLoading(true)
        setIsOpen(true)
        setRecommendationCard(null)

        // Tables to search, shuffled for randomness
        const tables = ['deals', 'hacks', 'events']
        const shuffledTables = tables.sort(() => Math.random() - 0.5)

        // Short-circuit if no interests provided
        if (!interests || interests.length === 0) {
            setRecommendationCard({ table: 'no-interests' })
            setLoading(false)
            return
        }

        // Normalize interests into a lowercase array
        const normalizedInterests = Array.isArray(interests)
            ? interests.map((t) => t.toLowerCase())
            : typeof interests === 'string'
                ? interests.split(',').map((t) => t.trim().toLowerCase())
                : []

        try {
            let found = false

            // Iterate through each table until a match is found
            for (let table of shuffledTables) {
                let query = clientDB.from(table).select(
                    table === 'hacks'
                        ? 'id, title, upvotes, downvotes, tags'
                        : table === 'deals'
                            ? 'id, title, location, price, tags'
                            : 'id, title, location, upvotes, downvotes, tags' /* events */
                )

                // Filter by overlapping tags
                if (normalizedInterests.length) {
                    query = query.overlaps('tags', normalizedInterests)
                }

                // Exclude previously shown item
                if (lastCardId) {
                    query = query.neq('id', lastCardId)
                }

                // Fetch up to 10 results for selection
                const { data, error } = await query.limit(10)
                if (error || !data?.length) continue

                // Randomly pick one result
                const selected = data[Math.floor(Math.random() * data.length)]

                // Parse location if stored as JSON
                let loc = selected.location
                if (typeof loc === 'string') {
                    try {
                        loc = JSON.parse(loc)
                    } catch (_e) {
                        // leave as string if parse fails
                    }
                }
                if (loc && typeof loc === 'object' && 'address' in loc) {
                    loc = loc.address
                }

                // Wrap it back into the shape EventCard wants
                selected.location = loc

                // Update state with selected recommendation
                setLastCardId(selected.id)
                setRecommendationCard({ ...selected, table })
                found = true
                break
            }

            // Handle no matches found
            if (!found) {
                setRecommendationCard({ table: 'no-matches' })
            }
        } catch (err) {
            console.error('Recommendation fetch failed:', err.message)
        }

        setLoading(false)
    }

    /**
     * Render UI: recommendation popup, tooltip, and animated button
     */
    return (
        <>
            {/* Container aligning popup and button */}
            <div className="fixed bottom-8 right-13 z-50 flex flex-col items-end">
                {/* Recommendation Card Popup */}
                {isOpen &&
                    recommendationCard &&
                    recommendationCard.table !== 'no-interests' &&
                    recommendationCard.table !== 'no-matches' && (
                        <div className="fixed bottom-23 left-9 max-w-sm w-[100]% bg-[#F1F0EC] rounded-2xl border-0 border-[#6EC8C4] shadow-[0_0_15px_black] animate-fade-in z-50 relative">

                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setRecommendationCard(null)
                                }}
                                className="
                                absolute top-1 right-2
                                text-[#8B4C24] hover:text-[#5f321b]
                                text-xs font-bold
                                border border-[#8B4C24] rounded-full
                                px-2 py-1 bg-white
                                "
                                aria-label="Close response"
                            >
                                X
                            </button>

                            {/* Arrow Pointer */}
                            <div
                                className="
                                absolute bottom-0 right-6
                                w-3 h-3 bg-[#F1F0EC]
                                border-r border-b border-[#F1F0EC]
                                transform rotate-45 translate-y-1/2
                                "
                            />

                            {/* Render card based on table type */}
                            {recommendationCard.table === 'hacks' && (
                                <HackCard
                                    id={recommendationCard.id}
                                    href={`/hacks-page/${recommendationCard.id}`}
                                    title={recommendationCard.title}
                                    upvotes={recommendationCard.upvotes}
                                    downvotes={recommendationCard.downvotes}
                                    comments={recommendationCard.comments || 0}
                                    tags={recommendationCard.tags || []}
                                />
                            )}
                            {recommendationCard.table === 'deals' && (
                                <DealCard
                                    id={recommendationCard.id}
                                    title={recommendationCard.title}
                                    location={recommendationCard.location}
                                    price={recommendationCard.price}
                                    tags={recommendationCard.tags || []}
                                    expirationDate={recommendationCard.expirationDate}
                                />
                            )}
                            {recommendationCard.table === 'events' && (
                                <EventCard
                                    id={recommendationCard.id}
                                    href={`/events-page/${recommendationCard.id}`}
                                    title={recommendationCard.title}
                                    location={recommendationCard.location}
                                    upvotes={recommendationCard.upvotes}
                                    downvotes={recommendationCard.downvotes}
                                    tags={recommendationCard.tags || []}
                                />
                            )}
                        </div>
                    )}

                {/* No-Interests Message */}
                <div className="fixed bottom-15 right-5 z-50 flex flex-col items-end gap-5 w-fit">
                    {isOpen && recommendationCard?.table === 'no-interests' && (
                        <div className="relative top-3 left-1 bg-white border border-[#D1905A] rounded-xl px-4 py-3 shadow text-sm text-[#8B4C24] max-w-[240px]">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setRecommendationCard(null)
                                }}
                                className="
                                absolute top-2 right-2 text-[#8B4C24] hover:text-[#5f321b]
                                text-xs font-bold border border-[#8B4C24]
                                rounded-full px-2 py-1
                                "
                                aria-label="Close response"
                            >
                                X
                            </button>
                            <p className="pr-5">Set up your interests first to get recommendations.</p>
                            <div
                                className="
                                absolute bottom-0 right-6 w-3 h-3 bg-white
                                border-r border-b border-[#D1905A]
                                transform rotate-45 translate-y-1/2
                                "
                            />
                        </div>
                    )}
                    {/* No-Matches Message */}
                    {isOpen && recommendationCard?.table === 'no-matches' && (
                        <div className="relative top-3 bg-white border border-[#D1905A] rounded-xl px-4 py-3 shadow text-sm text-[#8B4C24] max-w-[240px]">
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    setRecommendationCard(null)
                                }}
                                className="
                                absolute top-2 right-2 text-[#8B4C24] hover:text-[#5f321b]
                                text-xs font-bold border border-[#8B4C24]
                                rounded-full px-2 py-1
                                "
                                aria-label="Close response"
                            >
                                X
                            </button>
                            <p className="pr-5">No matches found at this moment.</p>
                            <div
                                className="
                                absolute bottom-0 right-5 w-3 h-3 bg-white
                                border-r border-b border-[#D1905A]
                                transform rotate-45 translate-y-1/2
                                "
                            />
                        </div>
                    )}

                    {/* Tooltip before first click */}
                    {!isOpen && showTooltip && (
                        <div className="relative top-3 bg-white text-sm text-[#8B4C24] shadow-md rounded-md px-3 py-2 border border-[#D1905A] transition-opacity duration-500">
                            Get a magic recommendation!
                            <div
                                className="
                                absolute bottom-0 right-5.5 w-3 h-3 bg-white
                                border-r border-b border-[#D1905A]
                                transform rotate-45 translate-y-1/2
                                "
                            />
                        </div>
                    )}

                    {/* Animated Magic Wand Button */}
                    <motion.button
                        onClick={handleClick}
                        disabled={loading}
                        className="bg-white text-[#8B4C24] border-2 border-[#D1905A] shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-[#f3d9ae] transition"
                        initial={{ y: 0 }}
                        animate={{ y: [10, -5, -15, 10, 0] }}
                        transition={{
                            duration: 1.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 4,
                        }}

                    >
                        <Image
                            src="/images/AI/AIwizard.png"
                            alt="Magic Wand"
                            width={100}
                            height={100}
                        />
                    </motion.button>
                </div>
            </div>
        </>
    )
}

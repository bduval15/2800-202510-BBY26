import { useState } from 'react';
import { clientDB } from '@/supabaseClient';
import { useEffect } from 'react';
import Image from 'next/image';

import HackCard from '@/components/cards/HackCard';
import DealCard from '@/components/cards/DealCard';

export default function AIbutton({ interests }) {
    const [recommendationCard, setRecommendationCard] = useState(null);
    const [lastCardId, setLastCardId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = async () => {
        setLoading(true);
        setIsOpen(true);
        setRecommendationCard(null);

        const tables = ['deals', 'hacks'];
        const shuffledTables = tables.sort(() => Math.random() - 0.5);

        if (!interests || interests.length === 0) {
            setIsOpen(true);
            setRecommendationCard({ table: 'no-interests' });
            setLoading(false);
            return;
        }

        // Normalize interests
        let normalizedInterests = [];
        if (Array.isArray(interests)) {
            normalizedInterests = interests.map(tag => tag.toLowerCase());
        } else if (typeof interests === 'string') {
            normalizedInterests = interests.split(',').map(tag => tag.trim().toLowerCase());
        }

        console.log("Normalized interests:", normalizedInterests);

        try {
            let found = false;

            for (let i = 0; i < shuffledTables.length; i++) {
                const table = shuffledTables[i];
                console.log(`Trying table: ${table}`);

                let query = clientDB
                    .from(table)
                    .select(
                        table === 'hacks'
                            ? 'id, title, upvotes, downvotes, tags'
                            : 'id, title, location, price, tags'
                    );

                if (normalizedInterests.length > 0) {

                    query = query.overlaps('tags', normalizedInterests);
                }


                if (lastCardId) {
                    query = query.neq('id', lastCardId);
                }

                const { data, error } = await query.limit(10);

                if (error) {
                    console.error(`Error fetching from ${table}:`, error.message);
                    continue;
                }

                if (!data || data.length === 0) {
                    console.log(`No matching results in ${table}.`);
                    continue;
                }

                console.log(`Fetched ${data.length} items from ${table}.`);
                const selectedItem = data[Math.floor(Math.random() * data.length)];
                console.log('Selected item:', selectedItem);

                if (selectedItem) {
                    setLastCardId(selectedItem.id);
                    setRecommendationCard({ ...selectedItem, table });
                    found = true;
                    break;
                }
            }

            if (!found) {
                console.log('No recommendations matched interests.');
                setRecommendationCard({ table: 'no-matches' });
            }

        } catch (err) {
            console.error('Recommendation fetch failed:', err.message);
        }

        setLoading(false);
    };


    return (
        <>
            {/* Recommendation Bubble */}
            <div className="fixed bottom-8 right-13 z-50 flex flex-col items-end">
                {isOpen && recommendationCard && recommendationCard?.table !== 'no-interests' && recommendationCard?.table !== 'no-matches' && (
                    <div className="fixed bottom-23 left-9 max-w-sm w-[100%] bg-[#84B1B5] p- rounded-xl shadow-lg border border-[#D1905A] animate-fade-in z-50 relative">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setRecommendationCard(null);
                            }}
                            className="absolute right-2 text-[#8B4C24] hover:text-[#5f321b] text-xs font-bold"
                            aria-label="Close response"
                        >
                            X
                        </button>
                        {/*  ARROW POINTER */}
                        <div
                            className="
                            absolute bottom-0 right-6
                            w-3 h-3
                            bg-[#84B1B5]
                            border-r border-b border-[#D1905A]
                            transform rotate-45 translate-y-1/2
                          "
                        />

                        {recommendationCard.table === 'hacks' && (
                            <HackCard
                                id={recommendationCard.id}
                                href={`/hacks-page/${recommendationCard.id}`}
                                title={recommendationCard.title}
                                upvotes={recommendationCard.upvotes || 0}
                                downvotes={recommendationCard.downvotes || 0}
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
                            />
                        )}
                    </div>
                )}

                {/* Floating Chat Button & Bubble */}
                <div className="fixed bottom-15 right-5 z-50 flex flex-col items-end gap-5 w-fit">
                    {/* Chat message for no interests */}
                    {isOpen && recommendationCard?.table === 'no-interests' && (
                        <div className="relative top-3 left-1 bg-[#F5E3C6] border border-[#D1905A] rounded-xl px-4 py-3 shadow text-sm text-[#8B4C24] max-w-[240px]">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setRecommendationCard(null);
                                }}
                                className="absolute top-1 right-2 text-[#8B4C24] hover:text-[#5f321b] text-xs font-bold"
                                aria-label="Close response"
                            >
                                X
                            </button>
                            <p className="pr-5">Set up your interests first to get recommendations.</p>
                            <div
                                className="
                                absolute bottom-0 right-6
                                w-3 h-3
                                bg-[#F5E3C6]
                                border-r border-b border-[#D1905A]
                                transform rotate-45 translate-y-1/2
                                "
                            />
                        </div>


                    )}
                    {isOpen && recommendationCard?.table === 'no-matches' && (

                        <div className="relative top-3 bg-[#F5E3C6] border border-[#D1905A] rounded-xl px-4 py-3 shadow text-sm text-[#8B4C24] max-w-[240px]">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setRecommendationCard(null);
                                }}
                                className="absolute top-1 right-2 text-[#8B4C24] hover:text-[#5f321b] text-xs font-bold"
                                aria-label="Close response"
                            >
                                X
                            </button>
                            <p className="pr-5">No matches found at this moment.</p>

                            <div
                                className="
                            absolute bottom-0 right-5
                            w-3 h-3
                            bg-[#F5E3C6]
                            border-r border-b border-[#D1905A]
                            transform rotate-45 translate-y-1/2
                          "
                            />
                        </div>
                    )}

                    {!isOpen && showTooltip && (
                        <div className=" relative top-3 bg-[#F5E3C6] text-sm text-gray-800 shadow-md rounded-md px-3 py-2 border border-[#D1905A] transition-opacity duration-500">
                            Get a magic recommendation!
                            <div
                                className="
                            absolute bottom-0 right-5.5
                            w-3 h-3
                            bg-[#F5E3C6]
                            border-r border-b border-[#D1905A]
                            transform rotate-45 translate-y-1/2
                          "
                            />
                        </div>

                    )}

                    {/* Wand button */}
                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className="bg-[#F5E3C6] text-[#8B4C24] border-2 border-[#D1905A] shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-[#f3d9ae] transition"
                    >
                        <Image
                            src="/images/AI/AIwizard.png"
                            alt="Magic Wand"
                            width={100}
                            height={100}
                        />
                    </button>
                </div>
            </div>
        </>
    );

}

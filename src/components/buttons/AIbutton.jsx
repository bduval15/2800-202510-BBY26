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
                setRecommendationCard({ table: 'no-matches' }); // Optional: add UI for this
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
            {isOpen && recommendationCard && recommendationCard?.table !== 'no-interests' && (
                <div className="fixed bottom-6 right-6 max-w-sm w-[100%] bg-[#F5E3C6] p-4 rounded-xl shadow-lg border border-[#D1905A] animate-fade-in z-50 relative">

                    {/* Close button for all types */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setRecommendationCard(null);
                        }}
                        className="absolute top-1 right-2 text-[#8B4C24] hover:text-[#5f321b] text-xs font-bold"
                        aria-label="Close response"
                    >
                        ×
                    </button>

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
            <div className="fixed bottom-15 right-5 z-50 flex flex-col items-end gap-2 w-fit">
                {/* Chat message for no interests */}
                {isOpen && recommendationCard?.table === 'no-interests' && (
                    <div className="relative bg-[#F5E3C6] border border-[#D1905A] rounded-xl px-4 py-3 shadow text-sm text-[#8B4C24] max-w-[240px]">
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
                    </div>
                )}

                {!isOpen && showTooltip && (
                    <div className="bg-[#F5E3C6] text-sm text-gray-800 shadow-md rounded-md px-3 py-2 border border-gray-300 transition-opacity duration-500">
                        Get a magic recommendation!
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

/**
 * Main Feed
 * page.jsx
 * Loaf Life – The Main Feed page where all of our discussion boards will be hosted
 * 
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author https://chatgpt.com/
 */

'use client';

import React from 'react';
import StickyNavbar from '@/components/StickyNavbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import {
    MagnifyingGlassIcon,
    CheckIcon,
    ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';

const threads = [
    {
        id: 1,
        title: 'Deals Thread',
        description: 'Best discounts and coupon codes around campus',
        postCount: 24,
        accent: 'border-[#D1905A]',
    },
    {
        id: 2,
        title: 'Hacks Thread',
        description: 'Life-hacks, study tips, productivity tricks',
        postCount: 16,
        accent: 'border-teal-400',
    },
    {
        id: 3,
        title: 'Saving Tips',
        description: 'How to save money on textbooks, food, and more',
        postCount: 30,
        accent: 'border-green-400',
    },
    {
        id: 4,
        title: 'Free Events',
        description: 'Up-to-date listings of no-cost campus happenings',
        postCount: 8,
        accent: 'border-purple-400',
    },
];

export default function MainFeed() {
    return (
        <div className="flex flex-col h-screen bg-[#F5E3C6] pt-16">
            <StickyNavbar />

            {/* Filters + Search (static) */}
            <div className="p-4 border-b border-[#D1905A] max-w-md mx-auto w-full">
                {/* Static Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {['Popular', 'Recent', 'My Threads'].map((chip) => (
                        <div
                            key={chip}
                            className="px-3 py-1 text-[#8B4C24] font-medium bg-white rounded-full shadow-sm"
                        >
                            {chip}
                        </div>
                    ))}
                </div>
                {/* Search Input */}
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-[#8B4C24] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search threads"
                        className="
              w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200
              placeholder-[#8B4C24] text-[#8B4C24]
              focus:outline-none focus:ring-2 focus:ring-[#D1905A] focus:border-transparent transition
            "
                    />
                </div>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-y-auto p-4 pb-16 space-y-4 max-w-md mx-auto w-full relative">
                {threads.map((t) => (
                    <div
                        key={t.id}
                        className={`
              relative bg-white rounded-xl shadow p-4 pt-6 pb-6
              border-l-4 ${t.accent}
              group transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg
            `}
                    >
                        {/* ✓ Icon */}
                        <div className="absolute top-4 left-4">
                            <CheckIcon className="w-5 h-5 text-[#639751]" />
                        </div>

                        {/* Title + Description */}
                        <div className="pl-10 pr-16">
                            <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
                            <p className="text-sm text-gray-600 leading-snug mt-1">
                                {t.description}
                            </p>
                        </div>

                        {/* Comment bubble + count */}
                        <div className="absolute top-4 right-4 flex items-center space-x-1">
                            <ChatBubbleOvalLeftIcon className="w-5 h-5 text-[#C27A49]" />
                            <span className="text-sm text-[#C27A49]">{t.postCount}</span>
                        </div>
                    </div>
                ))}

                {/* Footer still scrolls with the list */}
                <Footer />
            </div>

            <BottomNav />
        </div>
    );
}

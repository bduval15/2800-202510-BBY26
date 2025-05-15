/**
 * Toast.jsx
 * Reusable toast notification component for Loaf Life.
 * Can be triggered globally across the app to show success, error, or info messages.
 *
 * Usage:
 * <Toast message="Profile saved!" type="success" />
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * Portions of styling and animation assisted by ChatGPT for educational purposes.
 *
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function Toast({ message, type = 'success', visible, onClose }) {
    // Automatically hide toast after 3 seconds
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    // Background colors and icons based on toast type
    const backgroundColors = {
        success: 'bg-[#639751]',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    const emojiIcons = {
        success: '/images/loafs/toast-happy.png',
        error: '/images/loafs/toast-sad.png',
        info: '/images/loafs/toast-neutral.png',
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`flex items-center gap-2 fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-white text-sm z-[1000] ${backgroundColors[type]}`}
                >
                    {/* Toast emoji icon */}
                    <Image
                        src={emojiIcons[type]}
                        alt="toast icon"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                    {/* Toast message */}
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

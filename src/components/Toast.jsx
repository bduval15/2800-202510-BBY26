/**
 * Toast.jsx
 * Reusable toast notification component for Loaf Life.
 * Can be triggered globally across the app to show success, error, or info messages.
 *
 * Usage:
 * <Toast message="Profile saved!" type="success" />
 */
'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

export default function Toast({ message, type = 'success', visible, onClose }) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

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
                    {/* Optional loaf image */}
                    <Image
                        src={emojiIcons[type]}
                        alt="toast icon"
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

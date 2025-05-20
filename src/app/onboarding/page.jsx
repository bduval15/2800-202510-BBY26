/**
 * OnboardingPage.jsx
 * Loaf Life – profile onboarding form for new users.
 *
 * This page allows users to complete their profile setup by selecting an avatar,
 * entering their school and bio, and choosing up to 5 interest tags.
 * On submission, the data is saved to Supabase and the user is redirected to the profile page.
 *
 * Features:
 * - Avatar image picker (via AvatarModal)
 * - Character limit handling for school and bio
 * - Predefined interest tag selection with a 5-tag maximum
 * - Form validation with visual feedback
 * - Loading skeleton (SkeletonLoaf) shown on submit
 *
 * Portions of styling and form logic were assisted by ChatGPT for educational purposes.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clientDB } from '@/supabaseClient';
import AvatarModal from '@/components/profile/AvatarModal';
import Footer from '@/components/Footer';
import SkeletonLoaf from '@/components/profile/SkeletonLoaf';

export default function OnboardingPage() {
    const router = useRouter();

    // State variables for form and user data
    const [userId, setUserId] = useState(null);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [school, setSchool] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('/images/avatars/avatar1.png');
    const [interests, setInterests] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Character limits
    const SCHOOL_MAX = 100;
    const BIO_MAX = 200;
    const MAX_SELECTION = 5;

    // List of selectable predefined interests
    const PREDEFINED_INTERESTS = [
        { emoji: "🎮", label: "Gaming" },
        { emoji: "👨‍🍳", label: "Cooking" },
        { emoji: "💻", label: "Coding" },
        { emoji: "📸", label: "Photography" },
        { emoji: "📖", label: "Reading" },
        { emoji: "🎬", label: "Movies" },
        { emoji: "🎨", label: "Art" },
        { emoji: "🎵", label: "Music" },
        { emoji: "📈", label: "Investing" },
        { emoji: "🧘‍♀️", label: "Yoga" },
        { emoji: "🎯", label: "Hacks" },
        { emoji: "🚴‍♀️", label: "Cycling" },
        { emoji: "⚽", label: "Football" },
        { emoji: "🏋️", label: "Fitness" },
        { emoji: "🗣️", label: "Public Speaking" },
        { emoji: "📚", label: "Study Groups" },
        { emoji: "🌍", label: "Sustainability" },
        { emoji: "💼", label: "Entrepreneurship" },
        { emoji: "🏞️", label: "Hiking" },
        { emoji: "🧠", label: "Mental Health" },
        { emoji: "🐶", label: "Animal Care" },
        { emoji: "🧩", label: "Board Games" },
        { emoji: "🎭", label: "Comedy" },
        { emoji: "🕹️", label: "Esports" },
    ];

    // Fetch user info on mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await clientDB.auth.getUser();
            if (user) setUserId(user.id); // Save user ID for profile updates
        };
        getUser();
    }, []);

    // Validation logic for form fields
    const isFormValid = school.trim() && bio.trim() && interests.length > 0 && school.length <= SCHOOL_MAX && bio.length <= BIO_MAX;

    // Handles form submission: updates Supabase, redirects to profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setSubmitting(true);

        const { error } = await clientDB.from('user_profiles').update({
            school: school.trim(),
            bio: bio.trim(),
            avatar_url: avatar,
            interests: interests.map(i => i.label),
        }).eq('id', userId);

        if (!error) router.push('/main-feed-page');
        else setError('Something went wrong while saving. Please try again.');

        setSubmitting(false);
    };

    return (
        <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-4 py-10 font-sans">
            {submitting ? (
                // Show loading animation when submitting
                <div className="flex justify-center items-center h-screen">
                    <SkeletonLoaf />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md space-y-5">
                    <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>

                    {/* Avatar section */}
                    <div className="flex flex-col items-center space-y-2">
                        <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        <button type="button" onClick={() => setShowAvatarModal(true)} className="text-sm text-[#8B4C24] border border-[#8B4C24] rounded px-3 py-1 hover:bg-[#F5E3C6]">
                            Edit Avatar
                        </button>
                    </div>

                    {/* School input with validation */}
                    <div>
                        <label className="block text-sm font-medium text-[#8B4C24]">School</label>
                        <input
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className={`w-full p-2 border rounded mt-1 ${!school.trim() ? 'border-red-500' : 'border-gray-300'}`}
                            maxLength={SCHOOL_MAX}
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">{school.length}/{SCHOOL_MAX} characters</span>
                            {!school.trim() && <span className="text-red-600">School is required</span>}
                        </div>
                    </div>

                    {/* Bio input with validation */}
                    <div>
                        <label className="block text-sm font-medium text-[#8B4C24]">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className={`w-full p-2 border rounded mt-1 ${!bio.trim() ? 'border-red-500' : 'border-gray-300'}`}
                            rows={3}
                            maxLength={BIO_MAX}
                        />
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">{bio.length}/{BIO_MAX} characters</span>
                            {!bio.trim() && <span className="text-red-600">Bio is required</span>}
                        </div>
                    </div>

                    {/* Interests selection area */}
                    <div>
                        <label className="block text-sm font-medium text-[#8B4C24] mb-1">Please select your interests</label>

                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            {PREDEFINED_INTERESTS.map((item) => {
                                const isSelected = interests.some((i) => i.label === item.label);
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setInterests(interests.filter((i) => i.label !== item.label));
                                                setError('');
                                            } else if (interests.length < MAX_SELECTION) {
                                                setInterests([...interests, item]);
                                                setError('');
                                            } else {
                                                setError('max');
                                            }
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm border transition ${isSelected
                                            ? 'bg-[#D0F0C0] border-[#639751]'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        {item.emoji} {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Error or guidance message */}
                        <p className={`text-xs ${error === 'max' ? 'text-red-600' : 'text-gray-500'}`}>
                            The maximum you can choose is {MAX_SELECTION}.
                        </p>
                    </div>

                    {/* Final submit button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || submitting}
                        className={`w-full mt-6 bg-[#639751] text-white py-2 rounded hover:bg-[#6bb053] transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Save & Continue
                    </button>
                </form>
            )}

            {/* Avatar selection modal */}
            {showAvatarModal && (
                <AvatarModal
                    selectedAvatar={avatar}
                    onSave={(newAvatar) => {
                        setAvatar(newAvatar);
                        setShowAvatarModal(false);
                    }}
                    onClose={() => setShowAvatarModal(false)}
                />
            )}

            <Footer />
        </main>
    );
}

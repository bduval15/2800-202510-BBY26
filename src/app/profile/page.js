/**
 * page.jsx
 * Loaf Life – user profile page displaying avatar, name, bio, interests, and saved hacks.
 *
 * Includes layout and positioning of profile card, user tags, and a functional "Edit Profile" button.
 * Tailwind CSS used for styling and responsiveness.
 *
 * Portions of the layout, styling, and component structure were assisted by ChatGPT for learning purposes.
 *
 * Modified with assistance from ChatGPT o4-mini-high.
 * @author https://chatgpt.com/*
 */

"use client";

import Footer from "@/components/Footer";
import StickyNavBar from "@/components/StickyNavbar";
import { useState } from "react";
import AvatarSelector from "@/components/AvatarSelector";
import BottomNav from '@/components/BottomNav' 

export default function ProfilePage() {
  // State to toggle the avatar selection modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar2.png"); // default avatar

  return (
    <>
      <StickyNavBar />
      <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 font-sans">
        {/* USER CARD */}
        <section className="relative max-w-md mx-auto bg-white p-12 rounded-xl shadow-md text-center">
          <img
            src={selectedAvatar}
            alt="User Avatar"
            className="w-24 h-24 mx-auto object-contain mb-4 cursor-pointer"
            onClick={() => setShowModal(true)}
          />
          <h1 className="text-2xl font-bold mb-1">Jason</h1>
          <p className="text-[#C27A49] text-sm">Computer Systems Tech @ BCIT</p>
          <p className="text-[#8B4C24] text-xs mt-2">
            Passionate about saving money & finding student hacks
          </p>

          {/* Fixed position */}
          <div className="absolute bottom-4 right-4">
            <button
              className="bg-[#639751] text-white font-medium px-2.5 py-1 rounded-md text-sm hover:bg-[#6bb053] transition"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* BIO */}
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
          <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Bio</h2>
          <p className="text-sm text-[#5C3D2E]">
            Hi! I’m Jason. I love discovering cheap eats, discounts, and cool free events around Vancouver.
            This app helps me live smart on a student budget!
          </p>
        </section>

        {/* TAGS / INTERESTS */}
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
          <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">My Interests</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-[#FFE2B6] px-3 py-1 rounded-full">Tech</span>
            <span className="bg-[#FFE2B6] px-3 py-1 rounded-full">Budget Eats</span>
            <span className="bg-[#FFE2B6] px-3 py-1 rounded-full">Events</span>
            <span className="bg-[#FFE2B6] px-3 py-1 rounded-full">Hacks</span>
          </div>
        </section>

        {/* SAVED HACKS */}
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6 mb-10">
          <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Hacks</h2>
          <ul className="space-y-2">
            <li className="bg-[#FFE2B6] p-3 rounded-md">Cheap Eats List</li>
            <li className="bg-[#FFE2B6] p-3 rounded-md">Student Discounts</li>
            <li className="bg-[#FFE2B6] p-3 rounded-md">Free Events</li>
          </ul>
        </section>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Choose an Avatar</h2>
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onSelect={(avatar) => {
                  setSelectedAvatar(avatar);
                  setShowModal(false);
                }}
              />
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto">
          <Footer />
        </div>

        <BottomNav />
      </main>
    </>
  );
}

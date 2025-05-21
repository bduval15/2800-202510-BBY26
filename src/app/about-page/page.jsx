/**
 * About.jsx
 * Loaf Life – About page displaying team info, mission statement, and illustrated team loafs.
 *
 * Includes:
 * - Themed header and background gradient
 * - Team avatar illustration
 * - Section cards for team members, about description, and mission quote
 *
 * Visual style follows Loaf Life's soft, warm palette using Tailwind CSS utility classes.
 * Portions of layout, card formatting, and styling strategy were refined with ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

import React from 'react';
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-[#FFF3E0] to-[#F5E3C6] text-[#8B4C24] px-6 py-10 flex flex-col items-center font-sans">

        {/* Main Header */}
        <h1 className="text-3xl font-bold mb-2 text-center">About Us</h1>
        <p className="text-2xl font-semibold mb-0.5 text-center">BBY-26</p>

        {/* Divider – Loaf Characters Holding Hands */}
        <div className="my-6 flex justify-center">
          <img
            src="/images/loafs/loafs-holding-hands.png"
            alt="Team Loafs"
            className="w-full max-w-xs mx-auto mb-2"
          />
        </div>

        {/* Team Members Section */}
        <section className="max-w-2xl w-full mb-6 bg-white p-6 rounded-xl shadow-md border border-[#D1905A] text-left">
          <p className="text-xl font-semibold mb-2">Team Members:</p>
          <ul className="list-disc list-inside space-y-1 text-lg">
            <li>Arseniuk, Natalia</li>
            <li>Dawood, Aleen</li>
            <li>Duval, Brady</li>
            <li>Oloresisimo, Nathan</li>
            <li>Ponton, Conner</li>
          </ul>
        </section>

        {/* About Description Section */}
        <section className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-md border border-[#D1905A] mb-6">
          <p className="text-lg mb-4">
            We are students at the British Columbia Institute of Technology, currently in Term 2 of the Computer Systems Technology diploma program.
          </p>
          <p className="text-lg">
            We are passionate about technology and innovation, and we strive to deliver a high-quality solution that reflects our commitment to learning and excellence.
          </p>
        </section>

        {/* Mission Statement Quote Box */}
        <div className="bg-[#FFF8E5] border-l-4 border-[#D1905A] p-4 rounded-xl shadow-sm italic text-sm text-[#8B4C24] max-w-2xl w-full mb-6">
          “Delivering warm, useful, and accessible student life solutions — one loaf at a time.”
        </div>
      </main>

      {/* Footer Component */}
      <Footer />
    </>
  );
}

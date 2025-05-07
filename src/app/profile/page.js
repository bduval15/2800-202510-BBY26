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

// Import dependencies
import { clientDB } from '@/services/supabaseClient';
import Footer from "@/components/Footer";
import StickyNavBar from "@/components/StickyNavbar";
import { useState } from "react";
import AvatarSelector from "@/components/AvatarSelector";
import BottomNav from '@/components/BottomNav'
import { useEffect } from "react";

// Main profile page component
export default function ProfilePage() {

  // === PROFILE STATE ===
  const [showModal, setShowModal] = useState(false); // Avatar modal toggle
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar1.png"); // default avatar
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");

  // === EDIT PROFILE MODAL STATE ===
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editSchool, setEditSchool] = useState(school);
  const [editBio, setEditBio] = useState(bio);

  // === INTERESTS STATE ===
  const [interests, setInterests] = useState(["Tech", "Budget Eats", "Events", "Hacks"]);
  const [editInterests, setEditInterests] = useState([...interests]);
  const [showEditInterests, setShowEditInterests] = useState(false);

  // === FETCH PROFILE FROM SUPABASE ON MOUNT ===
  useEffect(() => {
    const loadProfile = async (session) => {
      const { data, error } = await clientDB
        .from("user_profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setName(data.name || "");
        setSchool(data.school || "");
        setBio(data.bio || "");
        setSelectedAvatar(data.avatar_url || "/images/avatars/avatar1.png");
      }
    };

    const initSession = async () => {
      const {
        data: { session },
        error
      } = await clientDB.auth.getSession();

      if (session) {
        loadProfile(session);
      } else {
        console.log("No session on initial load");
      }
    };

    initSession();

    // Subscribe to session changes (handles refresh/login edge cases)
    const {
      data: { subscription }
    } = clientDB.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadProfile(session);
      }
    });

    // Cleanup the listener when component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <StickyNavBar />
      <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 font-sans">

        {/* PROFILE CARD */}
        <section className="relative max-w-md mx-auto bg-white p-12 rounded-xl shadow-md text-center">
          {/* Avatar - clicking opens modal */}
          <img
            src={selectedAvatar}
            alt="User Avatar"
            className="w-24 h-24 mx-auto object-contain mb-4 cursor-pointer"
            onClick={() => setShowModal(true)}
          />

          {/* Dynamic name, school, bio */}
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <p className="text-[#C27A49] text-sm">{school}</p>

          {/* Edit Profile Button */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => {
                setEditName(name);
                setEditSchool(school);
                setEditBio(bio);
                setShowEditModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
            >
              <span>Edit</span>
            </button>
          </div>

          {showEditInterests && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Edit Interests</h2>

                {/* Input to add new interest */}
                <div className="flex mb-4">
                  <input
                    type="text"
                    placeholder="Add interest..."
                    className="flex-grow border border-gray-300 p-2 rounded mr-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim() !== "") {
                        setEditInterests([...editInterests, e.target.value.trim()]);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                {/* Current interests (with delete buttons) */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {editInterests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#FFE2B6] px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() =>
                          setEditInterests(editInterests.filter((_, i) => i !== index))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setShowEditInterests(false)}
                    className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-2 py-0.5 rounded hover:bg-[#e3cba8] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setInterests(editInterests);
                      setShowEditInterests(false);
                    }}
                    className="bg-[#639751] text-white font-medium px-4 py-1 rounded hover:bg-[#6bb053] transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* BIO SECTION */}
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
          <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Bio</h2>
          <p className="text-sm text-[#5C3D2E] whitespace-pre-line">
            {bio}
          </p>
        </section>

        {/* TAGS */}
        <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
          <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">My Interests</h2>
          {/* Interests list */}
          <div className="flex flex-wrap gap-2 text-sm mb-4">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="bg-[#FFE2B6] px-4 py-2 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Edit button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowEditInterests(true)}
              className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
            >
              <span>Edit</span>
            </button>
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

        {/* AVATAR MODAL */}
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
                className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-6 py-2 rounded hover:bg-[#e3cba8] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Edit Profile</h2>
              <div className="mb-4">
                <label className="block text-sm text-[#8B4C24] mb-1">Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  maxLength={50}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-[#8B4C24] mb-1">School</label>
                <input
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  maxLength={100}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-[#8B4C24] mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-3 py-2 rounded hover:bg-[#e3cba8] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setName(editName);
                    setSchool(editSchool);
                    setBio(editBio);
                    setShowEditModal(false);
                  }}
                  className="bg-[#639751] text-white font-medium px-4 py-1.5 rounded hover:bg-[#6bb053] transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER & NAVIGATION */}
        <div className="mt-auto">
          <Footer />
        </div>
        <BottomNav />
      </main >
    </>
  );
}
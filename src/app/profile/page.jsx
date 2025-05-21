/**
 * page.jsx
 * Loaf Life – user profile page displaying avatar, name, bio, interests, and saved hacks.
 *
 * Refactored using modular components: ProfileCard, BioSection, InterestsSection, SavedHacksSection,
 * AvatarModal, and EditProfileModal.
 *
 * Portions of layout, styling, and component structure were assisted by ChatGPT for educational purposes.
 * Modified with assistance from ChatGPT o4-mini-high.
 * 
 * @author Aleen Dawood
 * @author https://chatgpt.com/*
 */

"use client";

import { useState, useEffect } from "react";
import { clientDB } from '@/supabaseClient';
import StickyNavBar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProfileCard from "@/components/profile/ProfileCard";
import BioSection from "@/components/profile/BioSection";
import InterestsSection from "@/components/profile/InterestsSection";
import SavedPostsSection from "@/components/profile/SavedPostsSection";
import AvatarModal from "@/components/profile/AvatarModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import SkeletonLoaf from "@/components/profile/SkeletonLoaf";
import Toast from "@/components/profile/Toast";
import { motion } from 'framer-motion';


export default function ProfilePage() {
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditInterests, setShowEditInterests] = useState(false);

  // Profile data states
  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar1.png");
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editBio, setEditBio] = useState("");
  const [errors, setErrors] = useState({});

  // Interests
  const [interests, setInterests] = useState([]);
  const [editInterests, setEditInterests] = useState([]);

  // Saved content
  const [savedPosts, setSavedPosts] = useState([]);

  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (toastVisible) {
      const timeout = setTimeout(() => setToastVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastVisible]);

  const MAX_SELECTION = 5;

  // Interests list (emojis + labels)
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

  // Load profile info from Supabase
  const loadProfile = async (session) => {
    setIsLoading(true);

    const { data, error } = await clientDB
      .from("user_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
      return;
    }

    if (data) {
      setName(data.name || "");
      setSchool(data.school || "");
      setBio(data.bio || "");
      setSelectedAvatar(data.avatar_url || "/images/avatars/avatar1.png");

      // Convert stored labels back to emoji-tag objects
      const interestObjs = (data.interests || [])
        .map(label => PREDEFINED_INTERESTS.find(i => i.label === label))
        .filter(Boolean);

      setInterests(interestObjs);
      setEditInterests(interestObjs);
    }

    setIsLoading(false);
  };

  // Validation logic for edit form
  const isFormValid =
    editName.trim() &&
    editSchool.trim() &&
    editBio.trim() &&
    editName.length <= 50 &&
    editSchool.length <= 100 &&
    editBio.length <= 200;

  // Save profile data to Supabase
  const handleSaveProfile = async () => {
    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
    if (sessionError || !session?.user) return console.error("No session, cannot save.");

    const { error } = await clientDB.from("user_profiles").upsert({
      id: session.user.id,
      name: editName.trim(),
      school: editSchool.trim(),
      bio: editBio.trim(),
      avatar_url: selectedAvatar,
      interests: editInterests.map(i => i.label),
    });

    if (error) return console.error("Error saving profile:", error);

    // Sync local UI with updated values
    setName(editName);
    setSchool(editSchool);
    setBio(editBio);
    setShowEditModal(false);
    setToastMessage("Profile updated!");
    setToastType("success");
    setToastVisible(true);
  };

  // Save updated interests
  const handleSaveInterests = async () => {
    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
    if (sessionError || !session?.user) return console.error("No session, cannot save interests.");

    const { error } = await clientDB.from("user_profiles").update({ interests: editInterests.map(i => i.label) }).eq("id", session.user.id);
    if (error) return console.error("Error saving interests:", error);

    setInterests(editInterests);
    setShowEditInterests(false);
    setToastMessage("Interests updated!");
    setToastType("success");
    setToastVisible(true);
  };

  // Load saved hacks and deals
  const loadSavedPosts = async (session) => {
    try {
      const { data: saved } = await clientDB
        .from("saved_items")
        .select("hack_id, deal_id, event_id")
        .eq("user_id", session.user.id);

      const hackIds = (saved || [])
        .filter(item => item.hack_id)
        .map(item => item.hack_id);

      const dealIds = (saved || [])
        .filter(item => item.deal_id)
        .map(item => item.deal_id);

      const eventIds = (saved || [])
        .filter(item => item.event_id)
        .map(item => item.event_id);

      const [hacksResult, dealsResult, eventsResult] = await Promise.all([
        clientDB.from("hacks").select("id, title, description, tags, upvotes, downvotes").in("id", hackIds),
        clientDB.from("deals").select("id, title, location, price").in("id", dealIds),
        clientDB.from("events").select("id, title, location, upvotes, downvotes, tags, user_id, created_at").in("id", eventIds)
      ]);

      const hacks = hacksResult.data?.map(h => ({ ...h, type: 'hack' })) || [];
      const deals = dealsResult.data?.map(d => ({ ...d, type: 'deal' })) || [];
      const events = eventsResult.data?.map(e => ({ ...e, type: 'event' })) || [];

      setSavedPosts([...hacks, ...deals, ...events]);
    } catch (err) {
      console.error("Error loading saved posts:", err);
    }
  };

  // Save avatar selection to Supabase
  const handleSaveAvatar = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);

    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
    if (sessionError || !session?.user) return console.error("No session, cannot save avatar.");

    const { error: updateError } = await clientDB
      .from("user_profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Error saving avatar:", updateError.message);
    } else {
      setToastMessage("Avatar updated!");
      setToastType("success");
      setToastVisible(true);
    }
  };

  // On first load, get session and load profile & saved posts
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await clientDB.auth.getSession();
      if (session) {
        await loadProfile(session);
        await loadSavedPosts(session);
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  return (
    <>
      <StickyNavBar />

      {/* Toast animation with toaster image */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          visible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      )}

      <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 font-sans">
        {isLoading ? (
          <SkeletonLoaf />
        ) : (
          <>
            <ProfileCard
              selectedAvatar={selectedAvatar}
              name={name}
              school={school}
              onEditClick={() => {
                // Populate edit fields before showing modal
                setEditName(name);
                setEditSchool(school);
                setEditBio(bio);
                setShowEditModal(true);
                setErrors({
                  name: !name.trim() ? "Name is required" : "",
                  school: !school.trim() ? "School is required" : "",
                  bio: !bio.trim() ? "Bio is required" : ""
                });
              }}
              onAvatarClick={() => setShowModal(true)}
            />

            <BioSection bio={bio} />

            <InterestsSection
              interests={interests}
              editInterests={editInterests}
              setEditInterests={setEditInterests}
              showEditInterests={showEditInterests}
              setShowEditInterests={setShowEditInterests}
              onSaveInterests={handleSaveInterests}
              predefinedInterests={PREDEFINED_INTERESTS}
              maxSelection={MAX_SELECTION}
            />

            <SavedPostsSection posts={savedPosts} />
          </>
        )}

        {/* Avatar and profile modals */}
        {showModal && (
          <AvatarModal
            selectedAvatar={selectedAvatar}
            onSave={handleSaveAvatar}
            onClose={() => setShowModal(false)}
          />
        )}

        {showEditModal && (
          <EditProfileModal
            editName={editName}
            setEditName={setEditName}
            editSchool={editSchool}
            setEditSchool={setEditSchool}
            editBio={editBio}
            setEditBio={setEditBio}
            errors={errors}
            setErrors={setErrors}
            isFormValid={isFormValid}
            onCancel={() => setShowEditModal(false)}
            onSave={handleSaveProfile}
          />
        )}
        <div className="mt-auto">
          <Footer />
        </div>
        <BottomNav />
      </main>
    </>
  );
}

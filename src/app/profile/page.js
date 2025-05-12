// /**
//  * page.jsx
//  * Loaf Life – user profile page displaying avatar, name, bio, interests, and saved hacks.
//  *
//  * Includes layout and positioning of profile card, user tags, and a functional "Edit Profile" button.
//  * Tailwind CSS used for styling and responsiveness.
//  *
//  * Portions of the layout, styling, and component structure were assisted by ChatGPT for learning purposes.
//  *
//  * Modified with assistance from ChatGPT o4-mini-high.
//  * @author https://chatgpt.com/*
//  */
// "use client";

// // Import dependencies
// import { clientDB } from '@/services/supabaseClient';
// import Footer from "@/components/Footer";
// import StickyNavBar from "@/components/StickyNavbar";
// import { useState } from "react";
// import AvatarSelector from "@/components/AvatarSelector";
// import BottomNav from '@/components/BottomNav'
// import { useEffect } from "react";

// // Main profile page component
// export default function ProfilePage() {

//   // === PROFILE STATE ===
//   const [showModal, setShowModal] = useState(false); // Avatar modal toggle
//   const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar1.png"); // default avatar
//   const [name, setName] = useState("");
//   const [school, setSchool] = useState("");
//   const [bio, setBio] = useState("");

//   // === EDIT PROFILE MODAL STATE ===
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editName, setEditName] = useState(name);
//   const [editSchool, setEditSchool] = useState(school);
//   const [editBio, setEditBio] = useState(bio);
//   const [errors, setErrors] = useState({});

//   // === INTERESTS STATE ===
//   const [interests, setInterests] = useState([]);
//   const [editInterests, setEditInterests] = useState([]);
//   const [showEditInterests, setShowEditInterests] = useState(false);

//   // === PREDEFINED VALUES FOR INTERESTS ===
//   const MAX_SELECTION = 5;
//   const PREDEFINED_INTERESTS = [
//     { emoji: "🎮", label: "Gaming" },
//     { emoji: "👨‍🍳", label: "Cooking" },
//     { emoji: "💻", label: "Coding" },
//     { emoji: "📸", label: "Photography" },
//     { emoji: "📖", label: "Reading" },
//     { emoji: "🎬", label: "Movies" },
//     { emoji: "🎨", label: "Art" },
//     { emoji: "🎵", label: "Music" },
//     { emoji: "📈", label: "Investing" },
//     { emoji: "🧘‍♀️", label: "Yoga" },
//     { emoji: "🎯", label: "Hacks" },
//     { emoji: "🚴‍♀️", label: "Cycling" },
//     { emoji: "⚽", label: "Football" },
//     { emoji: "🏋️", label: "Fitness" },
//     { emoji: "🗣️", label: "Public Speaking" },
//     { emoji: "📚", label: "Study Groups" },
//     { emoji: "🌍", label: "Sustainability" },
//     { emoji: "💼", label: "Entrepreneurship" },
//     { emoji: "🏞️", label: "Hiking" },
//     { emoji: "🧠", label: "Mental Health" },
//     { emoji: "🐶", label: "Animal Care" },
//     { emoji: "🧩", label: "Board Games" },
//     { emoji: "🎭", label: "Comedy" },
//     { emoji: "🎮", label: "Esports" },
//   ];

//   // === FETCH PROFILE FROM SUPABASE ON MOUNT ===
//   useEffect(() => {
//     const loadProfile = async (session) => {
//       const { data, error } = await clientDB
//         .from("user_profiles")
//         .select("*")
//         .eq("id", session.user.id)
//         .single();

//       if (error) {
//         console.error("Error fetching profile:", error);
//         return;
//       }

//       if (data) {
//         setName(data.name || "");
//         setSchool(data.school || "");
//         setBio(data.bio || "");
//         setSelectedAvatar(data.avatar_url || "/images/avatars/avatar1.png");
//         setInterests(
//           (data.interests || []).map((label) =>
//             PREDEFINED_INTERESTS.find((i) => i.label === label)
//           ).filter(Boolean)
//         );
//         setEditInterests(
//           (data.interests || []).map((label) =>
//             PREDEFINED_INTERESTS.find((i) => i.label === label)
//           ).filter(Boolean)
//         );
//       }
//     };

//     const initSession = async () => {
//       const {
//         data: { session },
//         error
//       } = await clientDB.auth.getSession();

//       if (session) {
//         loadProfile(session);
//       } else {
//         console.log("No session on initial load");
//       }
//     };

//     initSession();

//     // Subscribe to session changes (handles refresh/login edge cases)
//     const {
//       data: { subscription }
//     } = clientDB.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         loadProfile(session);
//       }
//     });

//     // Cleanup the listener when component unmounts
//     return () => subscription.unsubscribe();
//   }, []);

//   // Check if fields are not empty and within character limits
//   const isFormValid =
//     editName.trim() &&
//     editSchool.trim() &&
//     editBio.trim() &&
//     editName.length <= 50 &&
//     editSchool.length <= 100 &&
//     editBio.length <= 200;

//   return (
//     <>
//       <StickyNavBar />
//       <main className="min-h-screen bg-[#F5E3C6] text-[#8B4C24] px-6 py-10 font-sans">

//         {/* PROFILE CARD */}
//         <section className="relative max-w-md mx-auto bg-white p-12 rounded-xl shadow-md text-center">
//           {/* Avatar - clicking opens modal */}
//           <img
//             src={selectedAvatar}
//             alt="User Avatar"
//             className="w-24 h-24 mx-auto object-contain mb-4 cursor-pointer"
//             onClick={() => setShowModal(true)}
//           />

//           {/* Dynamic name, school, bio */}
//           <h1 className="text-2xl font-bold mb-1">{name}</h1>
//           <p className="text-[#C27A49] text-sm">{school}</p>

//           {/* Edit Profile Button */}
//           <div className="absolute bottom-4 right-4">
//             <button
//               onClick={() => {
//                 setEditName(name);
//                 setEditSchool(school);
//                 setEditBio(bio);
//                 setShowEditModal(true);
//                 setErrors({
//                   name: !name.trim() ? "Name is required" : "",
//                   school: !school.trim() ? "School is required" : "",
//                   bio: !bio.trim() ? "Bio is required" : ""
//                 });
//               }}
//               className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
//             >
//               <span>Edit</span>
//             </button>
//           </div>

//           {showEditInterests && (
//             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-lg">
//                 <h2 className="text-lg font-bold text-[#8B4C24] mb-4 text-center">Choose up to 5 Interests</h2>

//                 {/* Predefined Tags */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 justify-items-center">
//                   {PREDEFINED_INTERESTS.map((interest) => {
//                     const isSelected = editInterests.some((i) => i.label === interest.label);

//                     return (
//                       <button
//                         key={interest.label}
//                         type="button"
//                         onClick={() => {
//                           if (isSelected) {
//                             setEditInterests(editInterests.filter((i) => i.label !== interest.label));
//                           } else if (editInterests.length < MAX_SELECTION) {
//                             setEditInterests([...editInterests, interest]);
//                           }
//                         }}
//                         className={`flex items-center justify-center px-4 py-1.5 text-sm rounded-full border transition duration-200 ease-in-out shadow-sm whitespace-nowrap
//                           ${isSelected
//                             ? "bg-[#D0F0C0] text-[#23472D] border-[#7DC383]"
//                             : "bg-white text-[#4B3E2A] border-gray-300 hover:bg-[#f4f4f4]"}`}
//                       >
//                         <span className="mr-1">{interest.emoji}</span> {interest.label}
//                       </button>
//                     );
//                   })}

//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-between mt-4">
//                   <button
//                     onClick={() => setShowEditInterests(false)}
//                     className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-4 py-1.5 rounded hover:bg-[#e3cba8] transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={async () => {
//                       const {
//                         data: { session },
//                         error: sessionError
//                       } = await clientDB.auth.getSession();

//                       if (sessionError || !session?.user) {
//                         console.error("No session, cannot save interests.");
//                         return;
//                       }

//                       const { error: updateError } = await clientDB
//                         .from("user_profiles")
//                         .update({ interests: editInterests.map((i) => i.label) })
//                         .eq("id", session.user.id);

//                       if (updateError) {
//                         console.error("Error saving interests:", updateError);
//                       } else {
//                         setInterests(editInterests);
//                         setShowEditInterests(false);
//                       }
//                     }}
//                     className="bg-[#639751] text-white font-medium px-6 py-1.5 rounded hover:bg-[#6bb053] transition"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* BIO SECTION */}
//         <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
//           <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Bio</h2>
//           <p className="text-sm text-[#5C3D2E] whitespace-pre-line">
//             {bio}
//           </p>
//         </section>

//         {/* TAGS */}
//         <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6">
//           <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">My Interests</h2>
//           {/* Interests list */}
//           <div className="flex flex-wrap gap-2 text-sm mb-4">
//             {interests.map((interest, index) => (
//               <span
//                 key={index}
//                 className="bg-[#FFE2B6] px-4 py-2 rounded-full flex items-center gap-1"
//               >
//                 <span>{interest.emoji}</span>
//                 <span>{interest.label}</span>
//               </span>
//             ))}
//           </div>

//           {/* Edit button */}
//           <div className="flex justify-end">
//             <button
//               onClick={() => setShowEditInterests(true)}
//               className="flex items-center gap-1 px-3 py-1 border border-[#8B4C24] text-[#8B4C24] text-sm rounded-md hover:bg-[#F5E3C6] transition"
//             >
//               <span>Edit</span>
//             </button>
//           </div>
//         </section>

//         {/* SAVED HACKS */}
//         <section className="max-w-md mx-auto bg-white p-4 rounded-lg mt-6 mb-10">
//           <h2 className="font-semibold text-left text-lg text-[#8B4C24] mb-2">Saved Hacks</h2>
//           <ul className="space-y-2">
//             <li className="bg-[#FFE2B6] p-3 rounded-md">Cheap Eats List</li>
//             <li className="bg-[#FFE2B6] p-3 rounded-md">Student Discounts</li>
//             <li className="bg-[#FFE2B6] p-3 rounded-md">Free Events</li>
//           </ul>
//         </section>

//         {/* AVATAR MODAL */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg max-w-md w-full">
//               <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Choose an Avatar</h2>
//               <AvatarSelector
//                 selectedAvatar={selectedAvatar}
//                 onSelect={(avatar) => {
//                   setSelectedAvatar(avatar);
//                   setShowModal(false);
//                 }}
//               />
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-6 py-2 rounded hover:bg-[#e3cba8] transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {showEditModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg max-w-md w-full">
//               <h2 className="text-lg font-bold text-[#8B4C24] mb-4">Edit Profile</h2>
//               <div className="mb-4">
//                 <label className="block text-sm text-[#8B4C24] mb-1">Name</label>
//                 <input
//                   value={editName}
//                   onChange={(e) => {
//                     setEditName(e.target.value);
//                     setErrors((prev) => ({
//                       ...prev,
//                       name: e.target.value.trim() ? "" : "Name is required"
//                     }));
//                   }}
//                   className={`w-full border p-2 rounded ${editName.length > 50 ? "border-red-500" : "border-gray-300"}`}
//                   maxLength={50}
//                 />
//                 <div className="flex justify-between mt-1 text-xs">
//                   <span className="text-gray-500">{editName.length}/50 characters</span>
//                   {errors.name && <span className="text-red-500">{errors.name}</span>}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm text-[#8B4C24] mb-1">School</label>
//                 <input
//                   value={editSchool}
//                   onChange={(e) => {
//                     setEditSchool(e.target.value);
//                     setErrors((prev) => ({
//                       ...prev,
//                       school: e.target.value.trim() ? "" : "School is required"
//                     }));
//                   }}
//                   className={`w-full border p-2 rounded ${editSchool.length > 100 ? "border-red-500" : "border-gray-300"}`}
//                   maxLength={100}
//                 />
//                 <div className="flex justify-between mt-1 text-xs">
//                   <span className="text-gray-500">{editSchool.length}/100 characters</span>
//                   {errors.school && <span className="text-red-500">{errors.school}</span>}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm text-[#8B4C24] mb-1">Bio</label>
//                 <textarea
//                   value={editBio}
//                   onChange={(e) => {
//                     setEditBio(e.target.value);
//                     setErrors((prev) => ({
//                       ...prev,
//                       bio: e.target.value.trim() ? "" : "Bio is required"
//                     }));
//                   }}
//                   className={`w-full border p-2 rounded ${editBio.length > 200 ? "border-red-500" : "border-gray-300"}`}
//                   rows={3}
//                   maxLength={200}
//                   placeholder="Tell us something about yourself..."
//                 />
//                 <div className="flex justify-between mt-1 text-xs">
//                   <span className="text-gray-500">{editBio.length}/200 characters</span>
//                   {errors.bio && <span className="text-red-500">{errors.bio}</span>}
//                 </div>
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="bg-[#E6D2B5] text-[#5C3D2E] font-medium px-3 py-2 rounded hover:bg-[#e3cba8] transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   disabled={!isFormValid}
//                   onClick={async () => {
//                     const {
//                       data: { session },
//                       error: sessionError
//                     } = await clientDB.auth.getSession();

//                     if (sessionError || !session?.user) {
//                       console.error("No session, cannot save.");
//                       return;
//                     }

//                     const { error: updateError } = await clientDB
//                       .from("user_profiles")
//                       .upsert({
//                         id: session.user.id,
//                         name: editName.trim(),
//                         school: editSchool.trim(),
//                         bio: editBio.trim(),
//                         avatar_url: selectedAvatar,
//                         interests: editInterests.map((i) => i.label),
//                       });

//                     if (updateError) {
//                       console.error("Error saving profile:", updateError.message || updateError);
//                     } else {
//                       setName(editName);
//                       setSchool(editSchool);
//                       setBio(editBio);
//                       setShowEditModal(false);
//                     }
//                   }}
//                   className={`font-medium px-4 py-1.5 rounded transition
//                    ${!isFormValid
//                       ? "bg-gray-400 text-white cursor-not-allowed"
//                       : "bg-[#639751] text-white hover:bg-[#6bb053]"}`}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* FOOTER & NAVIGATION */}
//         <div className="mt-auto">
//           <Footer />
//         </div>
//         <BottomNav />
//       </main >
//     </>
//   );
// }

/**
 * page.jsx
 * Loaf Life – user profile page displaying avatar, name, bio, interests, and saved hacks.
 *
 * Refactored using modular components: ProfileCard, BioSection, InterestsSection, SavedHacksSection,
 * AvatarModal, and EditProfileModal.
 *
 * Portions of layout, styling, and component structure were assisted by ChatGPT for educational purposes.
 * Modified with assistance from ChatGPT o4-mini-high.
 * @author https://chatgpt.com/*
 */
"use client";

import { useState, useEffect } from "react";
import { clientDB } from '@/services/supabaseClient';
import StickyNavBar from "@/components/StickyNavbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProfileCard from "@/components/ProfileCard";
import BioSection from "@/components/BioSection";
import InterestsSection from "@/components/InterestsSection";
import SavedHacksSection from "@/components/SavedHacksSection";
import AvatarModal from "@/components/AvatarModal";
import EditProfileModal from "@/components/EditProfileModal";
import SkeletonLoaf from "@/components/SkeletonLoaf";

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditInterests, setShowEditInterests] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState("/images/avatars/avatar1.png");
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");

  const [editName, setEditName] = useState("");
  const [editSchool, setEditSchool] = useState("");
  const [editBio, setEditBio] = useState("");
  const [errors, setErrors] = useState({});

  const [interests, setInterests] = useState([]);
  const [editInterests, setEditInterests] = useState([]);

  const MAX_SELECTION = 5;
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
    { emoji: "🎮", label: "Esports" },
  ];

  useEffect(() => {
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
        const interestObjs = (data.interests || [])
          .map(label => PREDEFINED_INTERESTS.find(i => i.label === label))
          .filter(Boolean);
        setInterests(interestObjs);
        setEditInterests(interestObjs);
      }

      setIsLoading(false);
    };

    const initSession = async () => {
      const { data: { session } } = await clientDB.auth.getSession();
      if (session) {
        loadProfile(session);
      } else {
        setIsLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = clientDB.auth.onAuthStateChange((_event, session) => {
      if (session) loadProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isFormValid = editName.trim() && editSchool.trim() && editBio.trim() && editName.length <= 50 && editSchool.length <= 100 && editBio.length <= 200;

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

    setName(editName);
    setSchool(editSchool);
    setBio(editBio);
    setShowEditModal(false);
  };

  const handleSaveInterests = async () => {
    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
    if (sessionError || !session?.user) return console.error("No session, cannot save interests.");

    const { error } = await clientDB.from("user_profiles").update({ interests: editInterests.map(i => i.label) }).eq("id", session.user.id);
    if (error) return console.error("Error saving interests:", error);

    setInterests(editInterests);
    setShowEditInterests(false);
  };

  const handleSaveAvatar = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);

    const { data: { session }, error: sessionError } = await clientDB.auth.getSession();
    if (sessionError || !session?.user) {
      console.error("No session, cannot save avatar.");
      return;
    }

    const { error: updateError } = await clientDB
      .from("user_profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", session.user.id);

    if (updateError) {
      console.error("Error saving avatar:", updateError.message);
    }
  };

  return (
    <>
      <StickyNavBar />
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

            <SavedHacksSection hacks={["Cheap Eats List", "Student Discounts", "Free Events"]} />
          </>
        )}

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

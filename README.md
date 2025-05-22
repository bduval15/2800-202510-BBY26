# 🥖 Loaf Life (by bby26)

Loaf Life is a mobile-first web application designed for students to find free or affordable campus-related resources like food events, student discounts, quick gigs, and creative life-hacks.

---

## 📌 Overview

Students often rely on scattered sources like bulletin boards or Facebook groups for useful, money-saving opportunities. Loaf Life brings these into one place via:
- A categorized interactive map.
- Peer-submitted deals, hacks and events
- Saveable content via user profiles.

---

## 👥 Team Members

- **Natalia Arseniuk** – Set 2D  
- **Aleen Dawood** – Set 2D  
- **Brady Duval** – Set 2D  
- **Nathan Oloresisimo** – Set 2D  
- **Conner Ponton** – Set 2D  

---

## ⚙️ Tech Stack

| Layer     | Technology           |
|----------|-----------------------|
| Frontend | React (Next.js)       |
| Styling  | Tailwind CSS          |
| Backend  | Supabase (Auth + DB)  |
| Hosting  | Vercel                |

---

## 🧩 Core Features (MVP)

### 🗺️ Interactive Map
- Add/edit/delete pins (Free Food, Discounts, Gigs)
- Filters by category and distance
- Popups with detailed info and “Save” button

### 💡 Hacks/Events/Deals Page
- Static markdown-style posts
- Save favorites to a "Pocket Cheatsheet"

### 🧾 Submissions
- Simple forms for tips or opportunities
- Upload photo/link + location + category

### 🔐 User Auth + Profile
- Supabase email/password login
- Dashboard: submissions & saved items

---

## 🗂️ Project Structure
```
BBY26REPO/
├── public/
│   ├── images/
│   │   ├── avatars/
│   │   │   ├── avatar1.png
│   │   │   ├── avatar2.png
│   │   │   └── ... (up to avatar9.png)
│   │   ├── loafs/
│   │   │   ├── loaf-bg.png
│   │   │   ├── loafs-holding-hands.png
│   │   │   ├── sad-loaf.png
│   │   │   ├── toast-happy.png
│   │   │   ├── toast-neutral.png
│   │   │   └── toast-sad.png
│   │   ├── map/
│   │   │   ├── mapLoaf2.png
│   │   │   ├── mapLoaf3.png
│   │   │   ├── mapPinBlue.png
│   │   │   ├── mapPinPurple.png
│   │   │   └── mapPinRed.png
│   │   ├── skeleton/
│   │   │   └── Skeleton.PNG
│   │   ├── threads/
│   │   │   ├── dealsThread.png
│   │   │   ├── eventsThread.png
│   │   │   ├── hacksThread.png
│   │   │   └── savingsThread.png
│   │   ├── leaflet/
│   │   │  ├── marker-icon-2x.png
│   │   │  ├── marker-icon.png
│   │   │  └── marker-shadow.png
│   │   ├── 404loaf.png
│   │   ├── browse.png
│   │   ├── hamburger.png
│   │   ├── live.png
│   │   ├── logo.png
│   │   ├── profile.png
│   │   ├── save.png
│   │   └── toaster.png
│   │ 
├── src/
│   ├── app/
│   │   ├── about-page/
│   │   │   └── page.jsx
│   │   ├── add-form/
│   │   │   └── page.jsx
│   │   ├── deals-page/
│   │   │   ├── [dealId]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── events-page/
│   │   │   ├── [eventId]/
│   │   │   │   ├── [edit]/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── hacks-page/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.jsx
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx
│   │   ├── login-page/
│   │   │   └── page.jsx
│   │   ├── main-feed-page/
│   │   │   └── page.jsx
│   │   ├── map-page/
│   │   │   └── page.jsx
│   │   ├── onboarding/
│   │   │   └── page.jsx
│   │   ├── profile/
│   │   │   └── page.jsx
│   │   ├── layout.js
│   │   ├── not-found.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── buttons/
│   │   │   ├── AllButton.jsx
│   │   │   ├── Bookmark.jsx
│   │   │   ├── CommentCount.jsx
│   │   │   └── VoteButtons.jsx
│   │   ├── cards/
│   │   │   ├── BaseCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── DealCard.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── HackCard.jsx
│   │   ├── forms/
│   │   │   ├── AddCommentForm.jsx
│   │   │   └── AddPostForm.jsx
│   │   ├── mapComponents/
│   │   │   ├── EventMap.jsx
│   │   │   ├── EventMap.module.css
│   │   │   ├── EventPopup.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── LocateControl.jsx
│   │   │   ├── LocationAutoComplete.jsx
│   │   │   ├── ShowOnMapButton.jsx
│   │   │   └── ZoomToEvent.jsx
│   │   ├── profile/
│   │   │   ├── AvatarModal.jsx
│   │   │   ├── AvatarSelector.jsx
│   │   │   ├── BioSection.jsx
│   │   │   ├── EditProfileModal.jsx
│   │   │   ├── InterestsSection.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── SavedPostsSection.jsx
│   │   │   └── SkeletonLoad.jsx
│   │   ├── sections/
│   │   │   └── CommentSection.jsx
│   │   └── skeletons/
│   │       └── CommentSkeleton.jsx
│   ├── lib/
│   │   └── tags.js
│   └── utils/
│       ├── AI/
│       │   └── huggingFaceHelper.js
│       ├── formatting/
│       │   ├── formatDate.js
│       │   └── formatTimeAgo.js
│       └── content/
│       |   ├── tagEmojis.js
│       |   └── toTitleCase.js
|       ├── supabaseClient.js
|       ├── middleware.js
|       └── supabaseServer.js+
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.js
├── README.md
└── supabaseDoc.md
```
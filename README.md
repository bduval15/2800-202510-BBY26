## 👥 Team Members

- **Natalia Arseniuk** – Set 2D  
- **Aleen Dawood** – Set 2D  
- **Brady Duval** – Set 2D  
- **Nathan Oloresisimo** – Set 2D  
- **Conner Ponton** – Set 2D  

# 🥖 Loaf Life (by bby26)

Loaf Life is a mobile-first web application designed for students to find free or affordable campus-related resources like food events, student discounts, quick gigs, and creative life-hacks.

---

## 📌 Overview

Students often rely on scattered sources like bulletin boards or Facebook groups for useful, money-saving opportunities. Loaf Life brings these into one place via:
- A categorized interactive map.
- Peer-submitted tips and hacks.
- Saveable content via user profiles.

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

### 💡 Hacks Page
- Static markdown-style hack posts
- Save favorites to a "Pocket Cheatsheet"

### 🧾 Submissions
- Simple forms for tips or opportunities
- Upload photo/link + location + category

### 🔐 User Auth + Profile
- Supabase email/password login
- Dashboard: submissions & saved items

---

## 🗂️ Project Structure
BBY26REPO/
│
├── public/ # Static assets (e.g., images, favicon)
│
├── src/ # Application source code
│ ├── app/ # Next.js App Router directory
│ │ ├── authentication/ # Auth pages (login, register)
│ │ ├── hacks-page/ # Static or dynamic tips/hacks
│ │ ├── login-page/ # Login form/page
│ │ ├── map/ # Interactive map and pin components
│ │ ├── profile/ # User dashboard
│ │ ├── favicon.ico # App icon
│ │ ├── globals.css # Global styles
│ │ ├── layout.js # App layout wrapper
│ │ └── page.js # Root landing page
│ │
│ ├── components/ # Reusable UI components
│ ├── contexts/ # React context providers (e.g., AuthContext)
│ ├── hooks/ # Custom React hooks
│ ├── layouts/ # Page-specific layouts
│ ├── services/ # API call logic (e.g., Supabase interactions)
│ └── utils/ # Utility functions/helpers
│
├── .gitignore # Git ignored files
├── about.html # Project description (optional static page)
├── eslint.config.mjs # Linting rules
├── jsconfig.json # JS path aliases/settings
├── next.config.mjs # Next.js config
├── package.json # NPM dependencies and scripts
├── package-lock.json # Dependency tree
├── postcss.config.mjs # PostCSS config
├── tailwind.config.js # Tailwind CSS setup
└── README.md # Project overview and guide
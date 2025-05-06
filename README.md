## About Us
**Team Name:**  
BBY-26  

**Team Members:**
- Arseniuk, Natalia 2D
- Dawood, Aleen 2D
- Duval, Brady 2D
- Oloresisimo, Nathan 2D
- Ponton, Conner 2D



**Project Structure**
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
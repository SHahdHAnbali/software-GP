# 🖼️ Virtual Art Gallery

An immersive full-stack web application featuring a 3D virtual gallery experience built with React, Three.js, and Supabase.

---

## ✨ Features

- **3D Immersive Gallery** — Walk through a virtual gallery using WASD + mouse controls (PointerLock API)
- **Artist Dashboard** — Upload artworks, manage collection, position works in 3D space
- **Gallery Layout Editor** — 2D drag-and-drop interface to set artwork positions in the gallery
- **AI Descriptions** — Generate evocative artwork descriptions via OpenAI (Supabase Edge Function)
- **Authentication** — Register as artist or visitor, protected routes by role
- **Realtime Updates** — New artworks appear live in the gallery via Supabase Realtime
- **Explore Page** — 2D grid browsing with search and filtering
- **Profile Management** — Update bio, gallery name, and avatar

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| 3D Rendering | React Three Fiber, Three.js, Drei |
| State | React Context API |
| HTTP | Axios + Supabase JS Client |
| Backend | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| AI Feature | Supabase Edge Function → OpenAI API |
| Deployment | Vercel / Netlify (frontend), Supabase (backend) |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/virtual-art-gallery.git
cd virtual-art-gallery
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **Anon Key** from Settings → API

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database

1. Open your Supabase project → SQL Editor
2. Copy and run the entire contents of `supabase/schema.sql`
3. This will create all tables, RLS policies, and storage buckets

### 5. Deploy the Edge Function (AI Feature)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Set OpenAI secret
supabase secrets set OPENAI_API_KEY=sk-your-openai-key

# Deploy function
supabase functions deploy generate-description
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Database Schema

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | References auth.users |
| username | text | Unique username |
| user_type | text | 'artist' or 'visitor' |
| gallery_name | text | Artist's gallery name |
| bio | text | User biography |
| profile_pic | text | Avatar URL |
| created_at | timestamptz | Auto |

### `artworks`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Artwork title |
| description | text | Artwork description |
| image_url | text | Public storage URL |
| artist_id | uuid | References profiles.id |
| dimensions | text | e.g. "60 × 80 cm" |
| materials | text | e.g. "Oil on canvas" |
| year | integer | Year created |
| price | numeric | Price in USD |
| artwork_type | text | Category |
| position_x/y/z | numeric | 3D position in gallery |
| rotation_x/y/z | numeric | 3D rotation (radians) |
| scale_x/y/z | numeric | Display scale |

---

## 🎮 Gallery Controls

| Action | Control |
|--------|---------|
| Enter free-look | Click in gallery |
| Move forward/back | W/S or Arrow Up/Down |
| Strafe left/right | A/D or Arrow Left/Right |
| Look around | Mouse movement |
| View artwork details | Click on artwork |
| Exit free-look | Escape |

---

## 🔐 Security (RLS)

- **Artists** can only INSERT/UPDATE/DELETE their own artworks
- **Visitors** can only SELECT artworks and profiles
- **All users** can only UPDATE their own profile
- Storage policies ensure users can only manage files in their own folder

---

## 📁 Project Structure

```
virtual-art-gallery/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Navbar, ProtectedRoute
│   │   ├── gallery/      # 3D scene, artwork frames, modals
│   │   └── dashboard/    # Upload form, layout editor
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── GalleryContext.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── GalleryPage.jsx   # 3D gallery
│   │   ├── ExplorePage.jsx   # 2D grid browser
│   │   └── DashboardPage.jsx # Artist dashboard
│   ├── lib/
│   │   └── supabase.js
│   └── styles/
│       └── globals.css
├── supabase/
│   ├── schema.sql           # Full database schema
│   ├── config.toml          # Local dev config
│   └── functions/
│       └── generate-description/
│           └── index.ts     # AI edge function
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
npm run build

# Deploy to Vercel
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Frontend (Netlify)

```bash
npm run build
# Deploy dist/ folder to Netlify
# Set env vars in Site Settings → Environment Variables
```

### Backend

Supabase is already hosted — no additional deployment needed. Just ensure:
1. Your production domain is added to Supabase Auth → URL Configuration → Site URL
2. Edge Function is deployed with the OpenAI key secret

---

## 📜 License

MIT License — Built as a Graduation Project

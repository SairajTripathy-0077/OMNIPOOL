# OmniPool: Full-Stack AI-Driven Resource & Skill Allocation Engine

A MERN-stack scaffold for an intelligent P2P ecosystem matching platform that uses RAG (Retrieval-Augmented Generation) to match community-owned hardware and human skills against natural-language project descriptions.

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS Version**: The user requested Tailwind CSS. I'll use **Tailwind CSS v4** (latest) with the `@tailwindcss/vite` plugin. This is the simplest integration path with Vite. Confirm if v3 is preferred instead.

> [!IMPORTANT]
> **State Management**: The plan uses **Zustand** for lightweight global state (auth context, parsed results). Confirm if React Context is preferred.

> [!WARNING]
> **Gemini API Key**: The scaffold will include real Gemini SDK integration code (`@google/generative-ai`), but all calls are gated behind `GEMINI_API_KEY` in `.env`. Without a valid key, AI endpoints will return graceful mock responses during development.

> [!IMPORTANT]
> **MongoDB Atlas Vector Search**: The scaffold will include the aggregation pipeline code for `$vectorSearch` as a ready-to-use utility. However, the actual Atlas Vector Search **index** must be created manually in the Atlas UI (or via Atlas CLI) — this cannot be automated in code alone. The plan includes documentation for this step.

---

## Proposed Changes

### Phase 1 — Project Scaffolding & Monorepo Structure

```
OMNIPOOL/
├── client/                  # React + Vite + TypeScript frontend
├── server/                  # Express + Node.js backend
├── docker-compose.yml
├── Dockerfile.client
├── Dockerfile.server
├── .env.example
├── .gitignore
└── README.md
```

#### [NEW] `.env.example`
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/omnipool
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
VECTOR_SEARCH_INDEX_NAME=default
EMBEDDING_DIMENSIONS=768
```

#### [NEW] `docker-compose.yml`
- Services: `client` (Vite dev), `server` (Express), `mongo` (MongoDB 7)
- Volumes for hot-reload on both client and server
- Network linking between services

#### [NEW] `Dockerfile.client` / `Dockerfile.server`
- Multi-stage builds for production readiness
- Dev-mode configurations for local iteration

#### [NEW] `.gitignore`
- Standard Node.js + Vite ignores, `.env`, `node_modules`, `dist`

---

### Phase 2 — Backend Foundation (`server/`)

```
server/
├── package.json
├── src/
│   ├── index.js              # Express entry point
│   ├── config/
│   │   ├── db.js             # MongoDB connection via Mongoose
│   │   └── gemini.js         # Gemini AI client initialization
│   ├── models/
│   │   ├── User.js           # User profile schema
│   │   ├── HardwareItem.js   # Hardware inventory schema
│   │   └── ProjectRequest.js # Project request schema
│   ├── routes/
│   │   ├── ai.routes.js      # POST /api/ai/parse-project & /api/ai/match-resources
│   │   ├── hardware.routes.js
│   │   ├── user.routes.js
│   │   └── project.routes.js
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── hardware.controller.js
│   │   ├── user.controller.js
│   │   └── project.controller.js
│   ├── services/
│   │   ├── gemini.service.js     # LLM parsing logic
│   │   ├── embedding.service.js  # Generate embeddings via Gemini
│   │   └── vectorSearch.service.js # MongoDB Atlas Vector Search queries
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── auth.js           # Placeholder JWT auth middleware
│   └── utils/
│       └── mockData.js       # Fallback mock responses when no API key
```

#### [NEW] `server/src/models/User.js`
```javascript
// Mongoose schema fields:
// - name: String (required)
// - email: String (required, unique)
// - password: String (hashed)
// - skills: [String]
// - skills_embedding: [Number]  ← 768-dim vector
// - project_history: [ObjectId → ProjectRequest]
// - location: { type: { type: String }, coordinates: [Number] }
// - avatar_url: String
// - bio: String
// - availability: Boolean (default: true)
// - createdAt, updatedAt (timestamps)
```

#### [NEW] `server/src/models/HardwareItem.js`
```javascript
// Mongoose schema fields:
// - name: String (required)
// - description: String (required)
// - owner_id: ObjectId → User (required)
// - location: { type: { type: String }, coordinates: [Number] }
// - availability_status: Enum ['available', 'in-use', 'maintenance'] (default: 'available')
// - category: Enum ['compute', 'sensor', 'networking', 'storage', 'display', 'power', 'other']
// - specs: Map (flexible key-value for hardware specs)
// - item_description_embedding: [Number] ← 768-dim vector
// - image_url: String
// - createdAt, updatedAt (timestamps)
```

#### [NEW] `server/src/models/ProjectRequest.js`
```javascript
// Mongoose schema fields:
// - title: String (required)
// - raw_description: String (required)
// - user_id: ObjectId → User (required)
// - extrapolated_BOM: [{ hardware_name: String, quantity: Number, notes: String }]
// - required_skills: [String]
// - matched_hardware: [ObjectId → HardwareItem]
// - matched_mentors: [ObjectId → User]
// - status: Enum ['draft', 'parsed', 'matching', 'matched', 'in_progress', 'completed']
// - createdAt, updatedAt (timestamps)
```

#### [NEW] `server/src/services/gemini.service.js`
- **`parseProjectDescription(rawText)`**: Sends raw text to Gemini 1.5 Pro with structured JSON output schema enforced via `responseMimeType: 'application/json'` + `responseSchema`. Returns `{ extrapolated_BOM, required_skills }`.
- Uses `@google/generative-ai` SDK with `SchemaType` for type-safe responses.

#### [NEW] `server/src/services/embedding.service.js`
- **`generateEmbedding(text)`**: Uses Gemini's `embedding-001` model (or `text-embedding-004`) to convert text → 768-dim float array.
- Called on skill save, hardware registration, and during match queries.

#### [NEW] `server/src/services/vectorSearch.service.js`
- **`searchHardware(queryEmbedding, filters)`**: Runs `$vectorSearch` aggregation on `HardwareItem` collection.
- **`searchMentors(queryEmbedding, filters)`**: Runs `$vectorSearch` aggregation on `User` collection.
- Both use `$vectorSearch` → `$project` with `vectorSearchScore` → rank by score.
- Includes keyword fallback using `$text` search when vector search index is not configured.

#### [NEW] AI Route Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/parse-project` | POST | Accepts `{ raw_description }`, returns `{ extrapolated_BOM, required_skills }` |
| `/api/ai/match-resources` | POST | Accepts parsed output, returns `{ matched_hardware[], matched_mentors[] }` |

#### [NEW] CRUD Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/users` | GET/POST | List users / Register |
| `/api/users/:id` | GET/PUT | Get / Update profile |
| `/api/hardware` | GET/POST | List all / Add hardware |
| `/api/hardware/:id` | GET/PUT/DELETE | Manage single item |
| `/api/projects` | GET/POST | List / Create project request |
| `/api/projects/:id` | GET/PUT | Get / Update project |

---

### Phase 3 — Frontend Foundation (`client/`)

```
client/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                # @import "tailwindcss"
│   ├── store/
│   │   └── useStore.ts          # Zustand store
│   ├── api/
│   │   └── client.ts            # Axios/fetch wrapper
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Modal.tsx
│   │   ├── dashboard/
│   │   │   ├── ProjectInput.tsx    # "I'm Building..." textarea
│   │   │   ├── BOMPanel.tsx        # Bill of Materials results
│   │   │   ├── SkillsPanel.tsx     # Required skills results
│   │   │   ├── HardwareMatches.tsx # Nearby hardware matches
│   │   │   └── MentorMatches.tsx   # Available mentors
│   │   ├── hardware/
│   │   │   ├── HardwareForm.tsx
│   │   │   └── HardwareCard.tsx
│   │   └── skills/
│   │       ├── SkillSelector.tsx
│   │       └── SkillBadge.tsx
│   └── pages/
│       ├── LandingPage.tsx
│       ├── UserDashboard.tsx
│       ├── HardwareRegistryPage.tsx
│       └── SkillsProfilePage.tsx
```

**Routing**: React Router v6 with 4 routes:
- `/` → `LandingPage`
- `/dashboard` → `UserDashboard`
- `/hardware` → `HardwareRegistryPage`
- `/skills` → `SkillsProfilePage`

---

### Phase 4 — Landing Page (`LandingPage.tsx`)

Premium, modern intro page with:
- **Hero Section**: Animated gradient background, headline "The Community Hardware & Skill Exchange", subtext explaining P2P matching, CTA button → `/dashboard`
- **Features Section**: 3-column grid with glassmorphism cards:
  - 🔧 "Share Hardware" — List idle devices for your community
  - 🧠 "AI-Powered Matching" — Describe your project, get instant BOM + skill matches
  - 👥 "Find Mentors" — Connect with nearby experts
- **How It Works**: 3-step visual flow with animated connecting lines
- **Stats Banner**: Animated counters (placeholder numbers)
- **Footer**: Links, branding

**Design Language**: Dark mode default, indigo/violet/cyan accent palette, glassmorphism cards, smooth scroll animations with Intersection Observer, micro-interactions on hover.

---

### Phase 5 — User Dashboard (`UserDashboard.tsx`)

The core interactive page:

1. **"I'm Building..." Input** — Large, prominent textarea with pulsing border animation. Submit button triggers `POST /api/ai/parse-project`.
2. **Loading State** — Skeleton loaders + shimmer effect during AI processing.
3. **Result Panels** (appear dynamically with staggered animation):
   - **Calculated BOM Panel** — Table/card view of hardware items with quantities
   - **Required Skills Panel** — Badge/chip display of identified skills
   - **Matching Hardware Nearby** — Cards showing available community hardware with owner info, distance, availability status
   - **Matching Mentors Available** — Cards showing mentor profiles with skill overlap score, availability indicator

Each panel has a distinct icon and accent color. Results flow vertically with a masonry-like layout.

---

### Phase 6 — Hardware Registry & Skills Profile Pages

#### `HardwareRegistryPage.tsx`
- **Add Hardware Form**: Name, description, category dropdown, specs (dynamic key-value fields), image URL
- **My Hardware List**: Card grid of user's registered hardware with edit/delete, availability toggle
- Submission calls `POST /api/hardware` and triggers embedding generation on the backend

#### `SkillsProfilePage.tsx`
- **Skill Selection**: Searchable multi-select with popular skills (pre-populated: Python, React, Embedded Systems, ML, CAD, Soldering, etc.)
- **Custom Skill Input**: Freeform text field to add custom skills
- **Skill Proficiency**: Optional proficiency slider (beginner → expert)
- **Bio/Description**: Rich text area for detailed expertise description
- Submission calls `PUT /api/users/:id` and triggers skills embedding generation

---

### Phase 7 — Docker & Deployment Config

#### [NEW] `Dockerfile.client`
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

#### [NEW] `Dockerfile.server`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

#### [NEW] `docker-compose.yml`
```yaml
services:
  client:
    build: { context: ., dockerfile: Dockerfile.client }
    ports: ["5173:80"]
    depends_on: [server]
  server:
    build: { context: ., dockerfile: Dockerfile.server }
    ports: ["5000:5000"]
    env_file: .env
    depends_on: [mongo]
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo-data:/data/db]
volumes:
  mongo-data:
```

---

## Open Questions

> [!IMPORTANT]
> 1. **Tailwind v3 vs v4?** — Plan uses v4 with `@tailwindcss/vite` plugin. Want v3 with `tailwind.config.js` instead?
> 2. **Zustand vs React Context?** — Plan uses Zustand. Prefer Context API?
> 3. **Authentication scope?** — The scaffold includes placeholder JWT auth middleware. Should I implement a full auth flow (login/register pages, JWT tokens, protected routes) or just the middleware stubs?
> 4. **Google Fonts preference?** — Plan uses **Inter** + **JetBrains Mono** (code). Any preference?

---

## Verification Plan

### Automated Tests
1. **Backend**:
   - `npm run dev` in `/server` — verify Express starts on port 5000
   - `curl POST /api/ai/parse-project` with sample text — verify structured JSON response (mock or real depending on API key)
   - All CRUD endpoints return proper status codes
2. **Frontend**:
   - `npm run dev` in `/client` — verify Vite dev server starts on port 5173
   - All 4 routes render without errors
   - Browser subagent walkthrough of the landing page and dashboard flow
3. **Docker**:
   - `docker-compose up --build` — all 3 services start cleanly

### Manual Verification
- Visual review of landing page aesthetics (screenshot capture)
- Dashboard "I'm Building..." flow end-to-end walkthrough
- Hardware registration form submission
- Skills profile editing

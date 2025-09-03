# Notes Frontend (Qwik)

Modern, minimalistic Qwik app for managing personal notes with:
- User authentication (login/register)
- Create, edit, delete notes
- View notes in a responsive grid
- Search and tag filtering
- Modal dialogs for editing
- Light theme with primary #1976d2, secondary #424242, accent #ffb300

## Environment
Copy `.env.example` to `.env` and set:
- VITE_API_BASE_URL: Base URL of the backend API (e.g., https://api.example.com)

The app uses localStorage for an `auth_token` issued by the backend on login/register.

## Scripts
- npm start — dev server (SSR mode)
- npm run build — prod build
- npm run preview — preview production build

## Structure
- src/lib/api.ts — HTTP client and types
- src/lib/auth.ts — auth context and actions
- src/components/ui — Header and Sidebar
- src/components/notes — NoteCard and NoteModal
- src/routes — pages and layout

## API Contracts (expected)
- POST /auth/login {email,password} -> {token,user}
- POST /auth/register {email,password} -> {token,user}
- GET /notes[?q=&tag=] -> Note[]
- POST /notes -> Note
- PUT /notes/:id -> Note
- DELETE /notes/:id -> 204

Adjust paths in src/lib/api.ts if backend differs.

## Styling
Global CSS defines theme variables, card, grid, buttons, etc. The layout uses:
- Header (navigation + auth)
- Sidebar (tags)
- Main content: search, action bar, notes grid


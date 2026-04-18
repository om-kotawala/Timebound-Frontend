# TimeBound — Smart Daily Task Tracker

Production-ready React frontend built from the SRS specification.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (lazy + Suspense) |
| State Management | Redux Toolkit + createSelector memoization |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 + custom design system |
| Charts | Recharts (Area, Bar charts) |
| Calendar | react-calendar |
| HTTP Client | Axios with JWT interceptors |
| Notifications | react-hot-toast |

## Project Structure

```
src/
├── components/
│   ├── layout/      # Sidebar, AppLayout
│   ├── tasks/       # TaskForm, TaskCard, FilterBar, EditModal
│   └── ui/          # ProgressRing, StatCard, Modal, Spinner, EmptyState
├── hooks/           # useTasks, useAuth, useProfile (custom Redux hooks)
├── pages/           # LoginPage, DashboardPage, CalendarPage, ProgressPage, ProfilePage
├── store/
│   ├── slices/      # authSlice, tasksSlice, profileSlice, progressSlice
│   └── index.js     # configureStore
├── services/        # api.js (Axios instance + all API calls)
├── utils/           # helpers, date formatters, progress calculators
└── constants/       # priorities, colors, config
```

## Key Features Implemented

- ✅ OTP-based authentication (email → OTP → JWT)
- ✅ Redux Toolkit with memoized selectors (createSelector)
- ✅ Demo mode (works without a backend — data in localStorage)
- ✅ Task CRUD with priority sorting (Important > Urgent > Medium)
- ✅ Auto-lock enforcement at 11:59 PM deadline
- ✅ Calendar view with task history
- ✅ Progress analytics: Daily, Monthly, Yearly
- ✅ Recharts visualizations (Area + Bar charts)
- ✅ Profile management
- ✅ Code-split pages with React.lazy

## Getting Started

```bash
npm install
cp .env.example .env          # set VITE_API_URL
npm run dev
```

Open http://localhost:5173 and click **Try Demo Mode** to explore without a backend.

## Connecting to Backend

Edit `.env`:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

Change `demoMode: true` → `false` in `src/store/slices/tasksSlice.js`.

## Performance Optimizations

- `React.memo` on every presentational component
- `useMemo` / `useCallback` throughout all pages and hooks
- `createSelector` for all derived state in Redux
- `React.lazy` + `Suspense` for route-level code splitting
- Minimal re-renders via fine-grained slice selectors

# BloodLink — Frontend

The React + Vite frontend for **BloodLink**, a platform that connects hospitals
with blood donors in real time.

## Features

- **Role-based authentication** — sign up and sign in as a **Donor**,
  **Hospital**, or **Admin**, with role-aware navigation and route guards.
- **Donor experience**
  - Dashboard with donation stats, eligibility, and availability control
  - Browse open blood requests and respond to them
  - Share location (browser geolocation) so nearby requests can find you
  - View your full donation history
- **Hospital experience**
  - Dashboard with request and donation statistics
  - Create blood requests (blood group, units, patient details, urgency)
  - View donor responses and select the chosen donor
  - Find matching donors, complete donations, and cancel requests
  - Browse donation records
- **Admin experience** — platform-wide statistics (donors, hospitals, blood
  banks, requests, donations).
- **Notifications** — an in-app notification bell with unread badge, mark-as-
  read, and mark-all-as-read, driven by the backend notification API.
- **Profile management** — edit account and role-specific details (donor or
  hospital fields) with a responsive, accessible UI.

## Tech stack

- React 19 + Vite
- Axios (with JWT request interceptor and 401 handling)
- Hash-based router (no external routing dependency)
- Plain CSS design system (light/dark aware)

## Getting started

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# production build
npm run build

# preview the production build
npm run preview

# lint
npm run lint
```

## API configuration

The app calls the backend through a relative `/api` base URL. In development,
`vite.config.js` proxies `/api` requests to `http://localhost:5000`, where the
Express backend runs. To point at a different backend, set the `VITE_API_URL`
environment variable.

> The backend must be running and a PostgreSQL database available for full
> functionality.

## Project structure

```
src/
  main.jsx              # entry point
  App.jsx               # providers + hash router + route guards
  index.css             # design tokens & shared primitive styles
  App.css               # app shell & page styles
  contexts/
    AuthContext.jsx     # session, login/register/logout, profile
    ToastContext.jsx    # global toast notifications
  router/useRoute.js    # lightweight hash router hook
  services/api.js       # axios instance with auth interceptor
  lib/constants.js      # blood groups, genders, urgencies, formatters
  components/
    Layout.jsx          # navbar, nav, notifications, footer
    NotificationBell.jsx
    BloodRequestCard.jsx
    ui.jsx              # Button, Card, StatCard, Badge, Modal, etc.
  pages/
    Landing.jsx, Login.jsx, Register.jsx
    RequestDetail.jsx, DonationHistory.jsx, Profile.jsx
    donor/              DonorDashboard.jsx, OpenRequests.jsx
    hospital/           HospitalDashboard.jsx, MyRequests.jsx, CreateRequest.jsx
    admin/              AdminDashboard.jsx
```

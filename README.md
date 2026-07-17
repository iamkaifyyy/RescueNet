# RescueNet 🌐🚨

RescueNet is a next-generation Emergency Response & Operations Control (EOC) platform. It provides emergency responders, coordinators, and citizens with real-time situational awareness, interactive mapping, and incident management capabilities to coordinate search, rescue, and relief operations during natural or human-made disasters.

---

## 🌟 Key Features

### 1. **Interactive 3D Globe & Map View**
- High-fidelity **3D Globe Projection** powered by MapLibre GL.
- Real-time visualization of active emergencies (fires, floods, earthquakes, and accidents).
- Live USGS earthquake feeds integrated seamlessly.
- Multiple map style options including **Dark OSINT**, **Default Road Map**, **Satellite Imagery**, and **Terrain Topography**.

### 2. **Emergency Operations Center (EOC) Dashboard**
- Dynamic incident listings with sorting, filtering, and real-time status tracking.
- Interactive terminal logging displaying live feeds of system activities, API syncs, and telemetry alerts.
- Live system status cards (Active Alerts, Response Teams Dispatched, Open Volunteer Missions, Active Assistance Requests).

### 3. **Assistance Requests & Dispatch**
- Citizens can report incidents and request assistance.
- Responders can track, triage, and dispatch resources to high-priority requests.

### 4. **Volunteer & Rescue Portal**
- Create and coordinate volunteer missions.
- Monitor responder counts and sign up for ongoing missions.

### 5. **Nearby Emergency Services Lookup**
- Locate nearby critical infrastructure including hospitals, shelters, fire stations, and police stations with distance calculation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (TypeScript) + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS + Lucide Icons
- **Mapping**: MapLibre GL (with 3D projection & custom raster tilesets)
- **State & Routing**: React Router DOM v7
- **Aesthetics**: Glassmorphism dashboard panel design, real-time dark/light mode toggle

### Backend
- **Runtime**: Node.js + TypeScript + Express
- **Databases**:
  - **PostgreSQL** (via Prisma ORM) for structured user and incident profiles.
  - **MongoDB** (via Mongoose) for unstructured emergency feeds and audit logs.
- **Real-Time Communication**: Socket.io for live updates.
- **Authentication**: JSON Web Tokens (JWT) + BCrypt password hashing.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- PostgreSQL Database
- MongoDB Database (optional / depending on telemetry configurations)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/iamkaifyyy/RescueNet.git
   cd RescueNet
   ```

2. **Install Workspace Dependencies:**
   Install dependencies for the root, frontend, and backend packages:
   ```bash
   npm install
   npm run install-all # Or run npm install inside both /frontend and /backend directories
   ```

---

## ⚙️ Environment Variables Config

Create a `.env` file in the `backend/` directory:

```env


---

## 🏃 Running the Application

You can run both frontend and backend concurrently from the root directory using:

```bash
# Starts both frontend (Vite) and backend (Express) concurrently
npm run dev
```

Alternatively, you can run them individually:

### Start Backend Server
```bash
cd backend
npm run dev
```

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

---

## 📦 Project Structure

```
RescueNet/
├── backend/            # Express + Prisma + Mongoose server
│   ├── prisma/         # PostgreSQL schema and migration scripts
│   ├── src/            # Express controllers, routes, and database clients
│   └── tsconfig.json
├── frontend/           # React + Vite client app
│   ├── src/            # Components, pages, map controls, and theme state
│   ├── index.html
│   └── vite.config.ts
├── package.json        # Workspace configuration scripts
└── README.md
```

---

## 🛡️ License

This project is licensed under the MIT License. See the LICENSE file for details.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";

// Import routers
import authRouter from "./routes/auth";
import incidentsRouter from "./routes/incidents";
import requestsRouter from "./routes/requests";
import missionsRouter from "./routes/missions";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes Registration
app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/missions", missionsRouter);

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Database Seeding Route (Neon Tech Postgres Init)
app.post("/api/seed", async (req: any, res: any) => {
  try {
    // Check if seeding is already completed
    const incidentCount = await prisma.incident.count();
    const requestCount = await prisma.assistanceRequest.count();
    const missionCount = await prisma.volunteerMission.count();

    if (incidentCount > 0 || requestCount > 0 || missionCount > 0) {
      return res.json({ message: "Database already seeded. Skipping initialization." });
    }

    // Seed Incidents
    await prisma.incident.createMany({
      data: [
        {
          title: "Wildfire: Canyon Crest",
          disasterType: "fire",
          place: "Los Angeles, CA",
          severity: "high",
          description: "Fast-moving brush fire threatening residential area. Dry winds are accelerating spread.",
          lng: -118.2437,
          lat: 34.0522,
          reportedBy: "LA Fire Command",
          status: "active"
        },
        {
          title: "Earthquake Mag 6.2",
          disasterType: "earthquake",
          place: "Tokyo, Japan",
          severity: "high",
          description: "Strong tremor felt. Transit lines temporarily suspended for inspection.",
          lng: 139.6917,
          lat: 35.6895,
          reportedBy: "JMA Auto Alert",
          status: "active"
        },
        {
          title: "Coastal Surge Inundation",
          disasterType: "flood",
          place: "Miami, FL",
          severity: "medium",
          description: "Severe high-tide surge coupled with heavy rain. Streets flooded up to 2 feet.",
          lng: -80.1918,
          lat: 25.7617,
          reportedBy: "Citizen Report",
          status: "active"
        },
        {
          title: "Hazmat Spill & Pileup",
          disasterType: "accident",
          place: "London, UK",
          severity: "medium",
          description: "Tanker collision on freeway. Containment crews active to prevent storm drain runoff.",
          lng: -0.1278,
          lat: 51.5074,
          reportedBy: "Highway Agency",
          status: "resolved"
        }
      ]
    });

    // Seed Requests
    await prisma.assistanceRequest.createMany({
      data: [
        {
          disasterType: "flood",
          title: "Fresh Water Shortage",
          description: "Potable drinking water and food packets needed for 20 shelter occupants.",
          location: "Miami Coastal Zone",
          status: "pending",
          severity: "critical"
        },
        {
          disasterType: "fire",
          title: "Elderly Transport Help",
          description: "Assistance needed to evacuate 3 residents with mobility restrictions.",
          location: "Los Angeles - Canyon Crest",
          status: "dispatched",
          severity: "high"
        },
        {
          disasterType: "accident",
          title: "Emergency Trauma Kits",
          description: "Requesting immediate delivery of sterile gauze, bandages, and burn ointments.",
          location: "London M4 Junction",
          status: "resolved",
          severity: "medium"
        }
      ]
    });

    // Seed Volunteer Missions
    await prisma.volunteerMission.createMany({
      data: [
        {
          title: "Sandbag Wall Construction",
          location: "Miami Coastal Zone",
          description: "Help construct barriers near vulnerable coastal properties before next high tide.",
          status: "open",
          volunteersCount: 3,
          volunteersNeeded: 10
        },
        {
          title: "Water Supply Logistics",
          location: "Miami Shelter B",
          description: "Coordinate and distribute fresh drinking water canisters to affected individuals.",
          status: "open",
          volunteersCount: 5,
          volunteersNeeded: 5
        },
        {
          title: "Emergency Center Admin",
          location: "LA Dispatch HQ",
          description: "Manage incoming non-emergency phone calls and coordinate volunteer registrations.",
          status: "open",
          volunteersCount: 1,
          volunteersNeeded: 3
        }
      ]
    });

    res.status(201).json({ message: "Neon Tech database successfully initialized with simulation seed telemetry." });
  } catch (err) {
    console.error("Seeding failed:", err);
    res.status(500).json({ error: "Failed to seed database" });
  }
});

app.listen(PORT, () => {
  console.log(`RescueNet EOC Backend running on port ${PORT}`);
});

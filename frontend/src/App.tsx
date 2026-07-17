import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { FloatingNav } from "./components/floating-navbar";
import Overview from "./pages/Overview";
import AssistanceRequests from "./pages/AssistanceRequests";
import NearbyServices from "./pages/NearbyServices";
import VolunterPortal from "./pages/VolunterPortal";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./components/VercelDashboard.css";
import { API_BASE_URL } from "./config";

// Seed active services
const SERVICES_DATA = [
  { id: "srv-1", name: "Metro General Hospital", type: "Hospital", address: "100 Medical Plaza, City Center", phone: "+1 (555) 019-2834", distance: "1.2 km", coordinates: [-118.25, 34.058] as [number, number] },
  { id: "srv-2", name: "Red Cross Emergency Shelter", type: "Shelter", address: "High School Gym, North Sector", phone: "+1 (555) 019-5829", distance: "2.4 km", coordinates: [-118.235, 34.048] as [number, number] },
  { id: "srv-3", name: "Central Fire Station", type: "Fire Station", address: "450 Broadway St", phone: "+1 (555) 019-9911", distance: "0.8 km", coordinates: [-118.245, 34.051] as [number, number] },
  { id: "srv-4", name: "District Police Headquarters", type: "Police Station", address: "12 Elm Street", phone: "+1 (555) 019-7733", distance: "1.5 km", coordinates: [-118.240, 34.054] as [number, number] },
  { id: "srv-5", name: "St. Jude Relief Camp", type: "Shelter", address: "Stadium Sector 4", phone: "+1 (555) 019-4455", distance: "5.1 km", coordinates: [139.76, 35.68] as [number, number] }
];

// Seed initial custom disasters
const INITIAL_INCIDENTS = [
  {
    type: "Feature",
    id: "incident-1",
    geometry: {
      type: "Point",
      coordinates: [-118.2437, 34.0522]
    },
    properties: {
      id: "incident-1",
      disasterType: "fire",
      title: "Wildfire: Canyon Crest",
      place: "Los Angeles, CA",
      severity: "high",
      description: "Fast-moving brush fire threatening residential area. Dry winds are accelerating spread.",
      time: Date.now() - 3600000,
      reportedBy: "LA Fire Command",
      status: "active"
    }
  },
  {
    type: "Feature",
    id: "incident-2",
    geometry: {
      type: "Point",
      coordinates: [139.6917, 35.6895]
    },
    properties: {
      id: "incident-2",
      disasterType: "earthquake",
      title: "Earthquake Mag 6.2",
      place: "Tokyo, Japan",
      severity: "high",
      mag: 6.2,
      description: "Strong tremor felt. Transit lines temporarily suspended for inspection.",
      time: Date.now() - 7200000,
      reportedBy: "JMA Auto Alert",
      status: "active"
    }
  },
  {
    type: "Feature",
    id: "incident-3",
    geometry: {
      type: "Point",
      coordinates: [-80.1918, 25.7617]
    },
    properties: {
      id: "incident-3",
      disasterType: "flood",
      title: "Coastal Surge Inundation",
      place: "Miami, FL",
      severity: "medium",
      description: "Severe high-tide surge coupled with heavy rain. Streets flooded up to 2 feet.",
      time: Date.now() - 10800000,
      reportedBy: "Citizen Report",
      status: "active"
    }
  },
  {
    type: "Feature",
    id: "incident-4",
    geometry: {
      type: "Point",
      coordinates: [-0.1278, 51.5074]
    },
    properties: {
      id: "incident-4",
      disasterType: "accident",
      title: "Hazmat Spill & Pileup",
      place: "London, UK",
      severity: "medium",
      description: "Tanker collision on freeway. Containment crews active to prevent storm drain runoff.",
      time: Date.now() - 14400000,
      reportedBy: "Highway Agency",
      status: "resolved"
    }
  }
];

// Seed initial assistance requests
const INITIAL_REQUESTS = [
  { id: "req-1", disasterType: "flood", title: "Fresh Water Shortage", description: "Potable drinking water and food packets needed for 20 shelter occupants.", location: "Miami Coastal Zone", status: "pending", severity: "critical", time: Date.now() - 3600000 },
  { id: "req-2", disasterType: "fire", title: "Elderly Transport Help", description: "Assistance needed to evacuate 3 residents with mobility restrictions.", location: "Los Angeles - Canyon Crest", status: "dispatched", severity: "high", time: Date.now() - 7200000 },
  { id: "req-3", disasterType: "accident", title: "Emergency Trauma Kits", description: "Requesting immediate delivery of sterile gauze, bandages, and burn ointments.", location: "London M4 Junction", status: "resolved", severity: "medium", time: Date.now() - 10800000 }
];

// Seed initial volunteer missions
const INITIAL_MISSIONS = [
  { id: "mis-1", title: "Sandbag Wall Construction", location: "Miami Coastal Zone", description: "Help construct barriers near vulnerable coastal properties before next high tide.", status: "open", volunteersCount: 3, volunteersNeeded: 10 },
  { id: "mis-2", title: "Water Supply Logistics", location: "Miami Shelter B", description: "Coordinate and distribute fresh drinking water canisters to affected individuals.", status: "open", volunteersCount: 5, volunteersNeeded: 5 },
  { id: "mis-3", title: "Emergency Center Admin", location: "LA Dispatch HQ", description: "Manage incoming non-emergency phone calls and coordinate volunteer registrations.", status: "open", volunteersCount: 1, volunteersNeeded: 3 }
];

export default function App() {
  const [incidents, setIncidents] = useState<any[]>(INITIAL_INCIDENTS);
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([]);
  const [assistanceRequests, setAssistanceRequests] = useState<any[]>(INITIAL_REQUESTS);
  const [volunteerMissions, setVolunteerMissions] = useState<any[]>(INITIAL_MISSIONS);
  
  const { user } = useAuth();
  const userRole = user?.role || "citizen";
  
  // Filter states
  const [filters, setFilters] = useState({
    earthquake: true,
    flood: true,
    fire: true,
    accident: true
  });

  // Focus location for flying the 3D map
  const [focusLocation, setFocusLocation] = useState<[number, number] | null>(null);

  // Form states - volunteer signup success
  const [volSuccessMsg, setVolSuccessMsg] = useState<string>("");

  // Live updates terminal log state
  const [terminalLogs, setTerminalLogs] = useState<any[]>([
    { time: Date.now() - 15000000, tag: "info", text: "EOC dashboard initialized successfully." },
    { time: Date.now() - 14400000, tag: "success", text: "Syncing USGS Earthquake feeds. Filter threshold set to mag > 5.0." },
    { time: Date.now() - 10800000, tag: "alert", text: "Coastal surge reported in Miami, FL. Flooding warnings active." },
    { time: Date.now() - 7200000, tag: "warning", text: "Wildfire reported near Los Angeles Canyon Crest. Level Red alert." }
  ]);

  // Automated broadcasting simulation toggle
  const [simulationActive, setSimulationActive] = useState<boolean>(true);
  
  // Sidebars toggle on mobile
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);

  const location = useLocation();

  // Listen to navigation state redirects (e.g. locating facilities from the Services page)
  useEffect(() => {
    if (location.state && (location.state as any).focusCoords) {
      setFocusLocation((location.state as any).focusCoords);
      // Clear location state history so it doesn't refly on subsequent standard navigation/reloads
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch initial telemetry lists from Neon Tech Postgres (via Express Backend)
  useEffect(() => {
    const fetchNeonData = async () => {
      try {
        // Fetch Incidents
        const incRes = await fetch(`${API_BASE_URL}/api/incidents`);
        if (incRes.ok) {
          const incData = await incRes.json();
          // Format Postgres Incident rows to GeoJSON Feature format
          const geojsonIncidents = incData.map((inc: any) => ({
            type: "Feature",
            id: inc.id,
            geometry: {
              type: "Point",
              coordinates: [inc.lng, inc.lat]
            },
            properties: {
              id: inc.id,
              disasterType: inc.disasterType,
              title: inc.title,
              place: inc.place,
              severity: inc.severity,
              description: inc.description,
              time: new Date(inc.createdAt).getTime(),
              reportedBy: inc.reportedBy,
              status: inc.status
            }
          }));
          setIncidents(prev => {
            // Keep USGS ones and filter out custom/sim ones, replace with Postgres database ones
            const usgs = prev.filter(i => i.id.startsWith("usgs"));
            return [...geojsonIncidents, ...usgs];
          });
        }

        // Fetch Requests
        const reqRes = await fetch(`${API_BASE_URL}/api/requests`);
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setAssistanceRequests(reqData);
        }

        // Fetch Missions
        const misRes = await fetch(`${API_BASE_URL}/api/missions`);
        if (misRes.ok) {
          const misData = await misRes.json();
          setVolunteerMissions(misData);
        }

        addLog("success", "Connected to Neon Tech Postgres. Synced live EOC telemetry feed.");
      } catch (err) {
        console.error("Neon DB fetch failed", err);
        addLog("warning", "Could not connect to Neon Tech server. Operating in local sandbox mode.");
      }
    };

    fetchNeonData();
  }, []);

  // Fetch USGS Earthquakes on mount
  useEffect(() => {
    const fetchUSGSEarthquakes = async () => {
      const endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query";
      const params = new URLSearchParams({
        format: "geojson",
        starttime: "2026-07-01",
        endtime: "2026-07-17",
        minmagnitude: "5",
        orderby: "time"
      });

      try {
        const res = await fetch(`${endpoint}?${params}`);
        const data = await res.json();
        
        // Parse USGS earthquakes and tag them as 'earthquake'
        const usgsIncidents = data.features.map((f: any) => ({
          type: "Feature",
          id: f.id,
          geometry: f.geometry,
          properties: {
            id: f.id,
            disasterType: "earthquake",
            title: f.properties.title || `Earthquake Mag ${f.properties.mag}`,
            place: f.properties.place || "Unknown Seaboard",
            severity: f.properties.mag >= 7.0 ? "critical" : f.properties.mag >= 6.0 ? "high" : "medium",
            mag: f.properties.mag,
            description: `Seismic activity registered at magnitude ${f.properties.mag}. Primary USGS reports recorded.`,
            time: f.properties.time,
            reportedBy: "USGS Auto Alert",
            status: "active"
          }
        }));

        setIncidents(prev => {
          // Filter out existing USGS ones to avoid duplicates
          const nonUSGS = prev.filter(inc => !inc.id.startsWith("usgs"));
          // Merge
          const merged = [...nonUSGS, ...usgsIncidents.map((u: any, idx: number) => ({ ...u, id: `usgs-${idx}` }))];
          return merged;
        });

        addLog("success", `Fetched ${usgsIncidents.length} recent major earthquakes from USGS.`);
      } catch (err) {
        console.error("USGS fetch failed", err);
        addLog("warning", "USGS network request failed. Using local historical seismic data.");
      }
    };

    fetchUSGSEarthquakes();
  }, []);

  // Filter incidents based on checkbox choices
  useEffect(() => {
    const filtered = incidents.filter(inc => {
      const type = inc.properties.disasterType;
      if (type === "earthquake" && !filters.earthquake) return false;
      if (type === "flood" && !filters.flood) return false;
      if (type === "fire" && !filters.fire) return false;
      if (type === "accident" && !filters.accident) return false;
      return true;
    });
    setFilteredIncidents(filtered);
  }, [incidents, filters]);

  // Live Simulator Alert Generator loop
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // List of random disaster setups
      const types = ["fire", "flood", "accident"];
      const selectedType = types[Math.floor(Math.random() * types.length)];

      const cities = [
        { name: "San Francisco, CA", coords: [-122.4194, 37.7749] },
        { name: "Sydney, Australia", coords: [151.2093, -33.8688] },
        { name: "Tokyo, Japan", coords: [139.6917, 35.6895] },
        { name: "Paris, France", coords: [2.3522, 48.8566] },
        { name: "Rio de Janeiro, Brazil", coords: [-43.1729, -22.9068] },
        { name: "Cape Town, South Africa", coords: [18.4241, -33.9249] }
      ];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const descriptions: Record<string, string[]> = {
        fire: [
          "Commercial building fire. Smoke hazard in vicinity.",
          "Electric transformer explosion triggering warehouse fire.",
          "Forest perimeter brush fire. Fire suppression planes deployed."
        ],
        flood: [
          "Severe drainage failure causing waist-deep flooding.",
          "Reservoir spillway overflowing. Residential street alerts issued.",
          "Coastal roadway washout due to atmospheric river."
        ],
        accident: [
          "Expressway congestion pileup with minor fuel leakage.",
          "Freight rail derailment causing structural blockages.",
          "Grid blackout accident causing localized transport disruptions."
        ]
      };
      
      const descArray = descriptions[selectedType];
      const selectedDesc = descArray[Math.floor(Math.random() * descArray.length)];
      const severities = ["low", "medium", "high", "critical"];
      const severity = severities[Math.floor(Math.random() * severities.length)];

      const newSimIncident = {
        type: "Feature",
        id: `sim-${Date.now()}`,
        geometry: {
          type: "Point",
          coordinates: [
            city.coords[0] + (Math.random() - 0.5) * 0.4,
            city.coords[1] + (Math.random() - 0.5) * 0.4
          ]
        },
        properties: {
          id: `sim-${Date.now()}`,
          disasterType: selectedType,
          title: `Simulated: ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} emergency`,
          place: city.name,
          severity: severity,
          description: selectedDesc,
          time: Date.now(),
          reportedBy: "Simulator Broadcast",
          status: "active"
        }
      };

      setIncidents(prev => [newSimIncident, ...prev]);
      addLog("alert", `New incident broadcast: ${selectedType.toUpperCase()} in ${city.name}. Severity: ${severity.toUpperCase()}.`);
    }, 18000); // Trigger every 18 seconds

    return () => clearInterval(interval);
  }, [simulationActive]);

  // Helper to add terminal log entries
  const addLog = (tag: "info" | "alert" | "success" | "warning", text: string) => {
    setTerminalLogs(prev => [
      { time: Date.now(), tag, text },
      ...prev.slice(0, 49) // Cap logs at 50
    ]);
  };

  // Toggle filter option
  const handleToggleFilter = (key: "earthquake" | "flood" | "fire" | "accident") => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Submit emergency report callback
  const onSubmitReport = async (data: {
    type: string;
    title: string;
    place: string;
    description: string;
    severity: string;
    lng: number;
    lat: number;
  }) => {
    const payload = {
      title: data.title,
      disasterType: data.type,
      place: data.place,
      severity: data.severity,
      description: data.description,
      lng: data.lng,
      lat: data.lat,
      reportedBy: userRole === "citizen" ? "Verified Citizen" : "NGO Dispatch"
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedIncident = await res.json();
        const newIncident = {
          type: "Feature",
          id: savedIncident.id,
          geometry: {
            type: "Point",
            coordinates: [savedIncident.lng, savedIncident.lat]
          },
          properties: {
            id: savedIncident.id,
            disasterType: savedIncident.disasterType,
            title: savedIncident.title,
            place: savedIncident.place,
            severity: savedIncident.severity,
            description: savedIncident.description,
            time: new Date(savedIncident.createdAt).getTime(),
            reportedBy: savedIncident.reportedBy,
            status: savedIncident.status
          }
        };
        setIncidents(prev => [newIncident, ...prev]);
        setFocusLocation([savedIncident.lng, savedIncident.lat]);
        addLog("success", `Incident successfully logged to Neon Tech database: ${savedIncident.title}.`);
        return;
      }
    } catch (err) {
      console.warn("Postgres connection failed, falling back to local state", err);
    }

    // Fallback: local-only in-memory storage
    const newIncidentLocal = {
      type: "Feature",
      id: `custom-${Date.now()}`,
      geometry: {
        type: "Point",
        coordinates: [data.lng, data.lat]
      },
      properties: {
        id: `custom-${Date.now()}`,
        disasterType: data.type,
        title: data.title,
        place: data.place,
        severity: data.severity,
        description: data.description,
        time: Date.now(),
        reportedBy: userRole === "citizen" ? "Verified Citizen" : "NGO Dispatch",
        status: "active"
      }
    };
    setIncidents(prev => [newIncidentLocal, ...prev]);
    setFocusLocation([data.lng, data.lat]);
    addLog("warning", `Logged in local sandbox mode: ${data.title}`);
  };

  // Submit assistance request callback
  const onSubmitAssistance = async (data: {
    type: string;
    title: string;
    description: string;
    location: string;
    severity: string;
  }) => {
    const payload = {
      disasterType: data.type,
      title: data.title,
      description: data.description,
      location: data.location,
      severity: data.severity
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedReq = await res.json();
        setAssistanceRequests(prev => [savedReq, ...prev]);
        addLog("success", `Distress request saved to Neon: ${savedReq.title}`);
        return;
      }
    } catch (err) {
      console.warn("Postgres save failed, using local fallback", err);
    }

    // Fallback
    const newRequestLocal = {
      id: `req-${Date.now()}`,
      disasterType: data.type,
      title: data.title,
      description: data.description,
      location: data.location,
      status: "pending",
      severity: data.severity,
      time: Date.now()
    };
    setAssistanceRequests(prev => [newRequestLocal, ...prev]);
    addLog("warning", `Logged request in local sandbox mode: ${data.title}`);
  };

  // Dispatch assistance (Responder UI)
  const handleDispatchAid = async (reqId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${reqId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dispatched" })
      });
      if (res.ok) {
        setAssistanceRequests(prev => 
          prev.map(r => r.id === reqId ? { ...r, status: "dispatched" } : r)
        );
        const req = assistanceRequests.find(r => r.id === reqId);
        addLog("success", `Neon EOC Dispatch: Responders assigned to: ${req?.title}.`);
        return;
      }
    } catch (err) {
      console.warn("Neon status update failed, using local state", err);
    }

    setAssistanceRequests(prev => 
      prev.map(r => r.id === reqId ? { ...r, status: "dispatched" } : r)
    );
    const req = assistanceRequests.find(r => r.id === reqId);
    addLog("warning", `Dispatched aid (local sandbox): ${req?.title}`);
  };

  // Mark request resolved (Responder UI)
  const handleResolveRequest = async (reqId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/requests/${reqId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" })
      });
      if (res.ok) {
        setAssistanceRequests(prev => 
          prev.map(r => r.id === reqId ? { ...r, status: "resolved" } : r)
        );
        const req = assistanceRequests.find(r => r.id === reqId);
        addLog("success", `Neon EOC: Request marked resolved: ${req?.title}.`);
        return;
      }
    } catch (err) {
      console.warn("Neon status update failed, using local state", err);
    }

    setAssistanceRequests(prev => 
      prev.map(r => r.id === reqId ? { ...r, status: "resolved" } : r)
    );
    const req = assistanceRequests.find(r => r.id === reqId);
    addLog("warning", `Resolved request (local sandbox): ${req?.title}`);
  };

  // Resolve active disaster (Responder UI)
  const handleResolveDisaster = async (incId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/incidents/${incId}/resolve`, {
        method: "PATCH"
      });
      if (res.ok) {
        setIncidents(prev => 
          prev.map(inc => inc.id === incId ? { ...inc, properties: { ...inc.properties, status: "resolved" } } : inc)
        );
        const inc = incidents.find(i => i.id === incId);
        addLog("success", `Neon EOC: Disaster incident marked resolved: ${inc?.properties?.title}.`);
        return;
      }
    } catch (err) {
      console.warn("Neon incident resolve failed, using local state", err);
    }

    setIncidents(prev => 
      prev.map(inc => inc.id === incId ? { ...inc, properties: { ...inc.properties, status: "resolved" } } : inc)
    );
    const inc = incidents.find(i => i.id === incId);
    addLog("warning", `Disaster resolved (local sandbox): ${inc?.properties?.title}`);
  };

  // Volunteer sign up callback
  const onVolunteerSignup = (name: string, skill: string) => {
    setVolSuccessMsg(`Thank you, ${name}. Your application has been logged into the responder volunteer registry.`);
    addLog("success", `Volunteer registered: ${name} (specialty: ${skill}).`);
    
    setTimeout(() => {
      setVolSuccessMsg("");
    }, 5000);
  };

  // Accept a volunteer mission
  const handleAcceptMission = async (missionId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/missions/${missionId}/accept`, {
        method: "PATCH"
      });
      if (res.ok) {
        setVolunteerMissions(prev => 
          prev.map(m => m.id === missionId ? { ...m, volunteersCount: m.volunteersCount + 1 } : m)
        );
        const mission = volunteerMissions.find(m => m.id === missionId);
        addLog("success", `Volunteer enrolled in Neon mission: "${mission?.title}".`);
        return;
      }
    } catch (err) {
      console.warn("Neon mission signup failed, using local state", err);
    }

    setVolunteerMissions(prev => 
      prev.map(m => m.id === missionId ? { ...m, volunteersCount: m.volunteersCount + 1 } : m)
    );
    const mission = volunteerMissions.find(m => m.id === missionId);
    addLog("warning", `Volunteer enrolled (local sandbox): "${mission?.title}".`);
  };

  // Locate service node coordinates on the map
  const onLocateService = (coordinates: [number, number]) => {
    setFocusLocation(coordinates);
    const srv = SERVICES_DATA.find(s => s.coordinates[0] === coordinates[0] && s.coordinates[1] === coordinates[1]);
    addLog("info", `Globe focused on facility: ${srv?.name || "Emergency Station"}.`);
  };

  return (
    <div className="v-dashboard">
      
      {/* Navigation Header */}
      <FloatingNav 
        pendingRequestsCount={assistanceRequests.filter(r => r.status === "pending").length}
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={setLeftSidebarOpen}
        addLog={addLog}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Dashboard Routes */}
        <Route path="/overview" element={
          <ProtectedRoute>
            <Overview
              filters={filters}
              handleToggleFilter={handleToggleFilter}
              incidents={incidents}
              filteredIncidents={filteredIncidents}
              assistanceRequests={assistanceRequests}
              volunteerMissions={volunteerMissions}
              services={SERVICES_DATA}
              simulationActive={simulationActive}
              setSimulationActive={setSimulationActive}
              onInjectIncident={() => {}}
              leftSidebarOpen={leftSidebarOpen}
              setLeftSidebarOpen={setLeftSidebarOpen}
              focusLocation={focusLocation}
              setFocusLocation={setFocusLocation}
              terminalLogs={terminalLogs}
              setTerminalLogs={setTerminalLogs}
            />
          </ProtectedRoute>
        } />
        <Route path="/assistance-requests" element={
          <ProtectedRoute>
            <AssistanceRequests
              assistanceRequests={assistanceRequests}
              userRole={userRole}
              onSubmitAssistance={onSubmitAssistance}
              onDispatchAid={handleDispatchAid}
              onResolveRequest={handleResolveRequest}
            />
          </ProtectedRoute>
        } />
        <Route path="/nearby-services" element={
          <ProtectedRoute>
            <NearbyServices
              services={SERVICES_DATA}
            />
          </ProtectedRoute>
        } />
        <Route path="/volunteers-portal" element={
          <ProtectedRoute>
            <VolunterPortal
              volunteerMissions={volunteerMissions}
              onAcceptMission={handleAcceptMission}
              onVolunteerSignup={onVolunteerSignup}
              volSuccessMsg={volSuccessMsg}
            />
          </ProtectedRoute>
        } />
      </Routes>
      
    </div>
  );
}

import React from "react";
import MapComponent from "../MapComponent";
import LeftSidebar from "../components/LeftSidebar";
import LogTerminal from "../components/LogTerminal";
import Icons from "../components/DisasterIcons";

interface OverviewProps {
  filters: any;
  handleToggleFilter: (key: any) => void;
  incidents: any[];
  filteredIncidents: any[];
  assistanceRequests: any[];
  volunteerMissions: any[];
  services: any[];
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  onInjectIncident: () => void;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  focusLocation: [number, number] | null;
  setFocusLocation: (loc: [number, number] | null) => void;
  terminalLogs: any[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Overview({
  filters,
  handleToggleFilter,
  incidents,
  filteredIncidents,
  assistanceRequests,
  volunteerMissions,
  services,
  simulationActive,
  setSimulationActive,
  onInjectIncident,
  leftSidebarOpen,
  setLeftSidebarOpen,
  focusLocation,
  setFocusLocation,
  terminalLogs,
  setTerminalLogs,
}: OverviewProps) {
  return (
    <div className={`v-main-content ${leftSidebarOpen ? "left-sidebar-open" : ""}`}>
      {/* Left Sidebar - Filters & Simulation Controls */}
      <LeftSidebar
        filters={filters}
        onToggleFilter={handleToggleFilter}
        incidents={incidents}
        pendingRequestsCount={assistanceRequests.filter((r) => r.status !== "resolved").length}
        servicesCount={services.length}
        missionsCount={volunteerMissions.length}
        simulationActive={simulationActive}
        setSimulationActive={setSimulationActive}
        onInjectIncident={onInjectIncident}
        isOpen={leftSidebarOpen}
      />

      {/* Center Pane - Globe & Map + Real-time Logs Feed Overlay */}
      <main className="v-map-pane">
        {/* Map Overlay Top Left showing count */}
        <div className="v-map-overlay-top">
          <button
            className="v-map-overlay-btn cursor-pointer"
            onClick={() => setFocusLocation([0, 0])}
          >
            <Icons.globe size={14} />
            <span>Center Globe</span>
          </button>
          <div
            className="v-map-overlay-btn"
            style={{ background: "rgba(16, 185, 129, 0.8)", cursor: "default" }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#fff",
                display: "inline-block",
                animation: "pulse 1.5s infinite",
              }}
            ></span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {filteredIncidents.length} active events filtered
            </span>
          </div>
        </div>

        {/* Interactive Globe Map */}
        <MapComponent
          earthquakes={filteredIncidents}
          focusLocation={focusLocation}
        />

        {/* Bottom Left Heatmap Severity Legend */}
        <div className="v-map-legend">
          <div className="v-legend-title">Risk Severity Scale</div>
          <div className="v-legend-item">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ee0000",
              }}
            ></span>
            <span>Critical Risk (Level 4)</span>
          </div>
          <div className="v-legend-item">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#ff4d4d",
              }}
            ></span>
            <span>High Risk (Level 3)</span>
          </div>
          <div className="v-legend-item">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#f5a623",
              }}
            ></span>
            <span>Medium Risk (Level 2)</span>
          </div>
          <div className="v-legend-item">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#0070f3",
              }}
            ></span>
            <span>Flood Warnings / Low Risk</span>
          </div>
          <div className="v-legend-item">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#7928ca",
              }}
            ></span>
            <span>Seismic Activity (USGS)</span>
          </div>
        </div>

        {/* Bottom Right Live Logs Terminal Feed */}
        <LogTerminal
          logs={terminalLogs}
          simulationActive={simulationActive}
          onClear={() => setTerminalLogs([])}
        />
      </main>
    </div>
  );
}

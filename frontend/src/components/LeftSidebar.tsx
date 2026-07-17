import Icons from "./DisasterIcons";

interface LeftSidebarProps {
  filters: {
    earthquake: boolean;
    flood: boolean;
    fire: boolean;
    accident: boolean;
  };
  onToggleFilter: (key: "earthquake" | "flood" | "fire" | "accident") => void;
  incidents: any[];
  pendingRequestsCount: number;
  servicesCount: number;
  missionsCount: number;
  simulationActive: boolean;
  setSimulationActive: (active: boolean) => void;
  onInjectIncident: () => void;
  isOpen: boolean;
}

export default function LeftSidebar({
  filters,
  onToggleFilter,
  incidents,
  pendingRequestsCount,
  servicesCount,
  missionsCount,
  simulationActive,
  setSimulationActive,
  onInjectIncident,
  isOpen
}: LeftSidebarProps) {
  
  // Count disasters by type helper
  const getDisasterCount = (type: string) => {
    return incidents.filter(inc => inc.properties.disasterType === type).length;
  };

  return (
    <aside className={`v-left-sidebar ${isOpen ? "open" : ""}`}>
      {/* Calamity Filters */}
      <div className="v-sidebar-section">
        <div className="v-sidebar-section-title">
          <span>Filter Calamities</span>
          <Icons.settings size={12} />
        </div>
        <div className="v-filter-list">
          <div 
            className={`v-filter-item ${filters.earthquake ? "active" : ""}`}
            onClick={() => onToggleFilter("earthquake")}
          >
            <div className="v-filter-item-left">
              <div className={`v-disaster-checkbox ${filters.earthquake ? "checked" : ""}`}>
                {filters.earthquake && <Icons.check size={10} />}
              </div>
              <div className="v-disaster-color-dot earthquake" />
              <span>Earthquakes</span>
            </div>
            <span className="v-disaster-count">{getDisasterCount("earthquake")}</span>
          </div>

          <div 
            className={`v-filter-item ${filters.fire ? "active" : ""}`}
            onClick={() => onToggleFilter("fire")}
          >
            <div className="v-filter-item-left">
              <div className={`v-disaster-checkbox ${filters.fire ? "checked" : ""}`}>
                {filters.fire && <Icons.check size={10} />}
              </div>
              <div className="v-disaster-color-dot fire" />
              <span>Wildfires</span>
            </div>
            <span className="v-disaster-count">{getDisasterCount("fire")}</span>
          </div>

          <div 
            className={`v-filter-item ${filters.flood ? "active" : ""}`}
            onClick={() => onToggleFilter("flood")}
          >
            <div className="v-filter-item-left">
              <div className={`v-disaster-checkbox ${filters.flood ? "checked" : ""}`}>
                {filters.flood && <Icons.check size={10} />}
              </div>
              <div className="v-disaster-color-dot flood" />
              <span>Floods</span>
            </div>
            <span className="v-disaster-count">{getDisasterCount("flood")}</span>
          </div>

          <div 
            className={`v-filter-item ${filters.accident ? "active" : ""}`}
            onClick={() => onToggleFilter("accident")}
          >
            <div className="v-filter-item-left">
              <div className={`v-disaster-checkbox ${filters.accident ? "checked" : ""}`}>
                {filters.accident && <Icons.check size={10} />}
              </div>
              <div className="v-disaster-color-dot accident" />
              <span>Accidents</span>
            </div>
            <span className="v-disaster-count">{getDisasterCount("accident")}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="v-sidebar-section">
        <div className="v-sidebar-section-title">
          <span>Incident Metrics</span>
        </div>
        <div className="v-metrics-grid">
          <div className="v-metric-card">
            <div className="v-metric-label">Active Calamities</div>
            <div className="v-metric-value">{incidents.filter(i => i.properties.status === "active").length}</div>
          </div>
          <div className="v-metric-card">
            <div className="v-metric-label">Unresolved Aid</div>
            <div className="v-metric-value">{pendingRequestsCount}</div>
          </div>
          <div className="v-metric-card">
            <div className="v-metric-label">Emergency Stations</div>
            <div className="v-metric-value">{servicesCount}</div>
          </div>
          <div className="v-metric-card">
            <div className="v-metric-label">Missions Active</div>
            <div className="v-metric-value">{missionsCount}</div>
          </div>
        </div>
      </div>

      {/* Simulation Widget */}
      <div className="v-sidebar-section" style={{ flexGrow: 1 }}>
        <div className="v-sidebar-section-title">
          <span>Calibrations & Simulation</span>
        </div>
        <div className="v-simulation-panel">
          <div className="v-sim-glow-text">AUTOMATED BROADCAST ACTIVE</div>
          <p style={{ fontSize: "11px", color: "var(--v-body)", lineHeight: "1.4", margin: "2px 0 8px" }}>
            Generates live emergency events and updates on the 3D globe to stress-test responder pipelines.
          </p>
          
          <div style={{ display: "flex", gap: "6px" }}>
            <button 
              className="v-btn-secondary"
              style={{ fontSize: "11px", padding: "6px 12px", flexGrow: 1 }}
              onClick={() => setSimulationActive(!simulationActive)}
            >
              {simulationActive ? "Pause Stream" : "Resume Stream"}
            </button>
            
            <button 
              className="v-btn-primary"
              style={{ fontSize: "11px", padding: "6px 12px" }}
              onClick={onInjectIncident}
            >
              Inject Crisis
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

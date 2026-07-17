import { useState } from "react";
import Icons from "./DisasterIcons";

interface RightSidebarProps {
  activeTab: string;
  userRole: "citizen" | "responder";
  filteredIncidentsCount: number;
  incidents: any[];
  onResolveIncident: (id: string) => void;
  assistanceRequests: any[];
  onDispatchAid: (id: string) => void;
  onResolveRequest: (id: string) => void;
  volunteerMissions: any[];
  onAcceptMission: (id: string) => void;
  services: any[];
  onLocateService: (coordinates: [number, number]) => void;
  onSubmitReport: (data: {
    type: string;
    title: string;
    place: string;
    description: string;
    severity: string;
    lng: number;
    lat: number;
  }) => void;
  onSubmitAssistance: (data: {
    type: string;
    title: string;
    description: string;
    location: string;
    severity: string;
  }) => void;
  onVolunteerSignup: (name: string, skill: string) => void;
  volSuccessMsg: string;
  isOpen: boolean;
}

export default function RightSidebar({
  activeTab,
  userRole,
  filteredIncidentsCount,
  incidents,
  onResolveIncident,
  assistanceRequests,
  onDispatchAid,
  onResolveRequest,
  volunteerMissions,
  onAcceptMission,
  services,
  onLocateService,
  onSubmitReport,
  onSubmitAssistance,
  onVolunteerSignup,
  volSuccessMsg,
  isOpen
}: RightSidebarProps) {
  
  // Local Form State - Incident Report
  const [reportType, setReportType] = useState<string>("fire");
  const [reportTitle, setReportTitle] = useState<string>("");
  const [reportPlace, setReportPlace] = useState<string>("");
  const [reportDesc, setReportDesc] = useState<string>("");
  const [reportSeverity, setReportSeverity] = useState<string>("medium");
  const [reportLng, setReportLng] = useState<string>("-118.24");
  const [reportLat, setReportLat] = useState<string>("34.05");

  // Local Form State - Assistance Request
  const [reqType, setReqType] = useState<string>("flood");
  const [reqTitle, setReqTitle] = useState<string>("");
  const [reqDesc, setReqDesc] = useState<string>("");
  const [reqLocation, setReqLocation] = useState<string>("");
  const [reqSeverity, setReqSeverity] = useState<string>("medium");

  // Local Form State - Volunteer Signup
  const [volName, setVolName] = useState<string>("");
  const [volSkill, setVolSkill] = useState<string>("general");

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportPlace || !reportDesc) {
      alert("Please fill in all incident fields.");
      return;
    }

    const lngVal = parseFloat(reportLng);
    const latVal = parseFloat(reportLat);

    if (isNaN(lngVal) || isNaN(latVal)) {
      alert("Please enter valid coordinate values.");
      return;
    }

    onSubmitReport({
      type: reportType,
      title: reportTitle,
      place: reportPlace,
      description: reportDesc,
      severity: reportSeverity,
      lng: lngVal,
      lat: latVal
    });

    // Reset Form
    setReportTitle("");
    setReportDesc("");
    setReportPlace("");
  };

  const handleAssistanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc || !reqLocation) {
      alert("Please fill in all assistance fields.");
      return;
    }

    onSubmitAssistance({
      type: reqType,
      title: reqTitle,
      description: reqDesc,
      location: reqLocation,
      severity: reqSeverity
    });

    // Reset Form
    setReqTitle("");
    setReqDesc("");
    setReqLocation("");
  };

  const handleVolSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName) {
      alert("Please enter your name.");
      return;
    }
    onVolunteerSignup(volName, volSkill);
    setVolName("");
  };

  return (
    <aside className={`v-right-sidebar ${isOpen ? "open" : ""}`}>
      
      {/* Tab 1: Overview and Incident List */}
      {activeTab === "overview" && (
        <>
          <div className="v-right-sidebar-header">
            <div className="v-right-sidebar-title">
              <Icons.globe size={16} />
              <span>Overview & Reports.</span>
            </div>
            <span className="v-disaster-count">{filteredIncidentsCount} events active</span>
          </div>
          
          <div className="v-right-sidebar-content">
            {userRole === "citizen" ? (
              /* CITIZEN INTERFACE: Report Form */
              <div className="v-tab-panel">
                <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Report disaster situation.</h3>
                  <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                    If you are witnessing a real-time emergency, report it below. Ensure your reports are accurate for responders.
                  </p>
                </div>

                <form onSubmit={handleIncidentSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="v-form-group">
                    <label className="v-form-label">CALAMITY TYPE</label>
                    <select 
                      className="v-form-select"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="fire">Fire Emergency</option>
                      <option value="flood">Severe Flood</option>
                      <option value="accident">Severe Accident / Spill</option>
                      <option value="earthquake">Seismic tremor</option>
                    </select>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">INCIDENT TITLE</label>
                    <input 
                      type="text" 
                      className="v-form-input" 
                      placeholder="e.g. Chemical Spill near Factory Gate"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">LOCATION DESCRIPTION</label>
                    <input 
                      type="text" 
                      className="v-form-input" 
                      placeholder="e.g. 5th Avenue, industrial district"
                      value={reportPlace}
                      onChange={(e) => setReportPlace(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="v-form-group">
                      <label className="v-form-label">LONGITUDE (X)</label>
                      <input 
                        type="text" 
                        className="v-form-input" 
                        style={{ fontFamily: "var(--font-mono)" }}
                        placeholder="-118.24"
                        value={reportLng}
                        onChange={(e) => setReportLng(e.target.value)}
                      />
                    </div>
                    <div className="v-form-group">
                      <label className="v-form-label">LATITUDE (Y)</label>
                      <input 
                        type="text" 
                        className="v-form-input" 
                        style={{ fontFamily: "var(--font-mono)" }}
                        placeholder="34.05"
                        value={reportLat}
                        onChange={(e) => setReportLat(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">RISK SEVERITY</label>
                    <select 
                      className="v-form-select"
                      value={reportSeverity}
                      onChange={(e) => setReportSeverity(e.target.value)}
                    >
                      <option value="low">Low Risk - Advisory</option>
                      <option value="medium">Medium Risk - Warning</option>
                      <option value="high">High Risk - Danger</option>
                      <option value="critical">Critical - Evacuations Recommended</option>
                    </select>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">DETAILS & DESCRIPTION</label>
                    <textarea 
                      className="v-form-textarea" 
                      placeholder="Provide details on casualties, road blockages, structural damages, or immediate danger..."
                      value={reportDesc}
                      onChange={(e) => setReportDesc(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="v-btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                    <Icons.plus size={14} />
                    Broadcast Incident Alert
                  </button>
                </form>
              </div>
            ) : (
              /* RESPONDER INTERFACE: Active Incidents List Table */
              <div className="v-tab-panel">
                <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Multi-agency incident response.</h3>
                  <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                    EOC authorities command dashboard. Review active calamities, direct assistance dispatch, or declare situations resolved.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {incidents.length === 0 ? (
                    <div style={{ color: "var(--v-mute)", textAlign: "center", padding: "20px" }}>No active incidents on record.</div>
                  ) : (
                    incidents.slice(0, 10).map((inc) => (
                      <div 
                        key={inc.id} 
                        style={{ 
                          border: "1px solid var(--v-hairline)", 
                          borderRadius: "8px", 
                          padding: "12px",
                          backgroundColor: inc.properties.status === "resolved" ? "var(--v-canvas-soft-2)" : "var(--v-canvas)",
                          opacity: inc.properties.status === "resolved" ? 0.75 : 1
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: inc.properties.status === "resolved" ? "var(--v-mute)" : "var(--v-error-deep)" }}>
                            {inc.properties.disasterType}
                          </span>
                          <span className={`v-request-badge ${inc.properties.status === "resolved" ? "resolved" : "pending"}`}>
                            {inc.properties.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 2px", color: "var(--v-ink)" }}>{inc.properties.title}</h4>
                        <p style={{ fontSize: "11px", color: "var(--v-body)", marginBottom: "8px" }}>{inc.properties.description}</p>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "var(--v-mute)", borderTop: "1px solid var(--v-hairline)", paddingTop: "8px", marginTop: "8px" }}>
                          <span>📍 {inc.properties.place}</span>
                          {inc.properties.status === "active" ? (
                            <button 
                              className="v-btn-secondary" 
                              style={{ padding: "2px 8px", fontSize: "10px" }}
                              onClick={() => onResolveIncident(inc.id)}
                            >
                              Mark Resolved
                            </button>
                          ) : (
                            <span>Checked</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab 2: Assistance Requests */}
      {activeTab === "requests" && (
        <>
          <div className="v-right-sidebar-header">
            <div className="v-right-sidebar-title">
              <Icons.alert size={16} />
              <span>Assistance Center.</span>
            </div>
            <span className="v-disaster-count">{assistanceRequests.filter(r => r.status !== "resolved").length} active</span>
          </div>
          
          <div className="v-right-sidebar-content">
            {userRole === "citizen" ? (
              /* CITIZEN: Request Form */
              <div className="v-tab-panel">
                <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Request emergency relief.</h3>
                  <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                    If you need food, shelter, rescue assistance, or medical aid, log your request with local coordination groups.
                  </p>
                </div>

                <form onSubmit={handleAssistanceSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="v-form-group">
                    <label className="v-form-label">DISASTER ASSOCIATED</label>
                    <select 
                      className="v-form-select"
                      value={reqType}
                      onChange={(e) => setReqType(e.target.value)}
                    >
                      <option value="flood">Coastal surge / Flooding</option>
                      <option value="fire">Wildfire evacuation</option>
                      <option value="accident">Chemical or transport collision</option>
                      <option value="earthquake">Earthquake debris</option>
                    </select>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">REQUEST SUMMARY</label>
                    <input 
                      type="text" 
                      className="v-form-input" 
                      placeholder="e.g. Clean drinking water and baby food"
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">SPECIFIC ADDRESS/LOCATION</label>
                    <input 
                      type="text" 
                      className="v-form-input" 
                      placeholder="e.g. Block C, Flat 405, Riverside Towers"
                      value={reqLocation}
                      onChange={(e) => setReqLocation(e.target.value)}
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">URGENCY SEVERITY</label>
                    <select 
                      className="v-form-select"
                      value={reqSeverity}
                      onChange={(e) => setReqSeverity(e.target.value)}
                    >
                      <option value="low">Low urgency (Assistance for later)</option>
                      <option value="medium">Medium urgency (Needs dispatch soon)</option>
                      <option value="high">High urgency (Urgent need within hours)</option>
                      <option value="critical">Critical (Immediate life-safety danger)</option>
                    </select>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">DESCRIPTION OF SPECIFIC NEEDS</label>
                    <textarea 
                      className="v-form-textarea" 
                      placeholder="Explain what supplies are needed, number of people, medical conditions..."
                      value={reqDesc}
                      onChange={(e) => setReqDesc(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="v-btn-primary" style={{ width: "100%", marginTop: "8px" }}>
                    <Icons.plus size={14} />
                    Submit Assistance Request
                  </button>
                </form>
              </div>
            ) : (
              /* RESPONDER: Action List of requests */
              <div className="v-tab-panel">
                <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Manage citizen distress queue.</h3>
                  <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                    Authorize responders dispatch or close tickets once relief teams confirm delivery.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {assistanceRequests.map((req) => (
                    <div key={req.id} className="v-request-card">
                      <div className="v-request-header">
                        <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--v-mute)" }}>
                          {req.disasterType}
                        </span>
                        <span className={`v-request-badge ${req.status}`}>
                          {req.status}
                        </span>
                      </div>
                      
                      <div className="v-request-body">
                        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                          {req.title}
                          {req.severity === "critical" && (
                            <span style={{ marginLeft: "6px", background: "var(--v-error-soft)", color: "var(--v-error-deep)", padding: "1px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 700 }}>
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <div>{req.description}</div>
                      </div>

                      <div className="v-request-meta">
                        <span>📍 {req.location}</span>
                        <span>{new Date(req.time).toLocaleTimeString()}</span>
                      </div>

                      {req.status !== "resolved" && (
                        <div className="v-request-actions">
                          {req.status === "pending" && (
                            <button 
                              className="v-btn-primary" 
                              style={{ padding: "4px 12px", fontSize: "11px", flexGrow: 1 }}
                              onClick={() => onDispatchAid(req.id)}
                            >
                              Dispatch Aid Team
                            </button>
                          )}
                          <button 
                            className="v-btn-secondary" 
                            style={{ padding: "4px 12px", fontSize: "11px", flexGrow: 1 }}
                            onClick={() => onResolveRequest(req.id)}
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab 3: Nearby Services Locator */}
      {activeTab === "services" && (
        <>
          <div className="v-right-sidebar-header">
            <div className="v-right-sidebar-title">
              <Icons.service size={16} />
              <span>Nearby Infrastructure Services.</span>
            </div>
          </div>
          
          <div className="v-right-sidebar-content">
            <div className="v-tab-panel">
              <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Locate emergency facilities.</h3>
                <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                  Quick access list of nearby medical nodes, emergency shelters, and public stations. Click a card to focus the 3D globe coordinates.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {services.map((srv) => (
                  <div 
                    key={srv.id} 
                    className="v-service-card"
                    onClick={() => onLocateService(srv.coordinates)}
                  >
                    <div className="v-service-icon">
                      {srv.type === "Hospital" ? <Icons.building size={18} /> : <Icons.service size={18} />}
                    </div>
                    <div className="v-service-details">
                      <div className="v-service-name">{srv.name}</div>
                      <div className="v-service-info">{srv.type} • {srv.address}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                        <span className="v-service-distance">Distance: {srv.distance}</span>
                        <span style={{ fontSize: "10px", color: "var(--v-link)", textDecoration: "underline", fontWeight: 500 }}>Locate on Globe</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 4: Volunteers Portal */}
      {activeTab === "volunteers" && (
        <>
          <div className="v-right-sidebar-header">
            <div className="v-right-sidebar-title">
              <Icons.volunteer size={16} />
              <span>Volunteer Relief Coordination.</span>
            </div>
          </div>
          
          <div className="v-right-sidebar-content">
            <div className="v-tab-panel">
              
              {/* Signup Form */}
              <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Volunteer registration.</h3>
                <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                  Sign up to volunteer and aid in coordination efforts. Responders will contact you based on skills and location proximity.
                </p>
              </div>

              {volSuccessMsg ? (
                <div style={{ padding: "12px", background: "#d1fae5", border: "1px solid #10b981", borderRadius: "6px", color: "#065f46", fontSize: "12px" }}>
                  {volSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleVolSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
                  <div className="v-form-group">
                    <label className="v-form-label">YOUR FULL NAME</label>
                    <input 
                      type="text" 
                      className="v-form-input" 
                      placeholder="e.g. Sarah Jenkins"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">SPECIALTY SKILLSET</label>
                    <select 
                      className="v-form-select"
                      value={volSkill}
                      onChange={(e) => setVolSkill(e.target.value)}
                    >
                      <option value="general">General Support (Cleanups, Sandbags)</option>
                      <option value="medical">Medical / First-Aid Certified</option>
                      <option value="logistics">Logistics / Supply Truck Driver</option>
                      <option value="comms">Communications / Amateur Radio Operator</option>
                    </select>
                  </div>

                  <button type="submit" className="v-btn-primary" style={{ width: "100%" }}>
                    Register to Volunteer Network
                  </button>
                </form>
              )}

              {/* Active Missions */}
              <div style={{ borderBottom: "1px solid var(--v-hairline)", paddingBottom: "12px", marginTop: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>Active relief missions.</h3>
                <p style={{ fontSize: "12px", color: "var(--v-body)" }}>
                  Apply directly to coordinated volunteer operations below.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {volunteerMissions.map((m) => (
                  <div key={m.id} style={{ border: "1px solid var(--v-hairline)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--v-ink)" }}>{m.title}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--v-mute)" }}>
                        {m.volunteersCount}/{m.volunteersNeeded} filled
                      </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--v-body)", marginBottom: "8px" }}>{m.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", color: "var(--v-mute)" }}>
                      <span>📍 {m.location}</span>
                      <button 
                        className="v-btn-secondary" 
                        style={{ padding: "2px 8px", fontSize: "10px" }}
                        onClick={() => onAcceptMission(m.id)}
                        disabled={m.volunteersCount >= m.volunteersNeeded}
                      >
                        {m.volunteersCount >= m.volunteersNeeded ? "Full" : "Accept Mission"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}

    </aside>
  );
}

import React, { useState } from "react";
import Icons from "../components/DisasterIcons";
import { cn } from "@/lib/utils";

interface AssistanceRequestsProps {
  assistanceRequests: any[];
  userRole: "citizen" | "responder";
  onSubmitAssistance: (data: {
    type: string;
    title: string;
    description: string;
    location: string;
    severity: string;
  }) => void;
  onDispatchAid: (id: string) => void;
  onResolveRequest: (id: string) => void;
}

export default function AssistanceRequests({
  assistanceRequests,
  userRole,
  onSubmitAssistance,
  onDispatchAid,
  onResolveRequest,
}: AssistanceRequestsProps) {
  // Citizen Form States
  const [reqType, setReqType] = useState<string>("flood");
  const [reqTitle, setReqTitle] = useState<string>("");
  const [reqDesc, setReqDesc] = useState<string>("");
  const [reqLocation, setReqLocation] = useState<string>("");
  const [reqSeverity, setReqSeverity] = useState<string>("medium");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqDesc || !reqLocation) {
      alert("Please fill in all required fields.");
      return;
    }

    onSubmitAssistance({
      type: reqType,
      title: reqTitle,
      description: reqDesc,
      location: reqLocation,
      severity: reqSeverity,
    });

    setFormSubmitted(true);
    setReqTitle("");
    setReqDesc("");
    setReqLocation("");

    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  // Helper Stats for Responders
  const totalRequests = assistanceRequests.length;
  const pendingRequests = assistanceRequests.filter((r) => r.status === "pending").length;
  const dispatchedRequests = assistanceRequests.filter((r) => r.status === "dispatched").length;
  const resolvedRequests = assistanceRequests.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#f3f4f6] pt-24 px-6 md:px-12 pb-12 flex flex-col items-center overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 dark:border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Icons.alert className="text-red-500" size={24} />
              Assistance Center
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Coordinating emergency relief and responder logistics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 border border-neutral-200/50 dark:border-white/5">
              Role: {userRole.toUpperCase()}
            </span>
          </div>
        </div>

        {userRole === "citizen" ? (
          /* CITIZEN LAYOUT */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl shadow-sm">
                <h2 className="text-base font-semibold mb-4 border-b border-neutral-100 dark:border-white/5 pb-2">
                  Request Emergency Relief
                </h2>
                
                {formSubmitted && (
                  <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium">
                    Your request has been logged successfully. Dispatch centers are monitoring.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                      placeholder="e.g. Emergency medication and clean water"
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">SPECIFIC ADDRESS/LOCATION</label>
                    <input
                      type="text"
                      className="v-form-input"
                      placeholder="e.g. Apt 104, Blue Ridge Condos, South Area"
                      value={reqLocation}
                      onChange={(e) => setReqLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">URGENCY SEVERITY</label>
                    <select
                      className="v-form-select"
                      value={reqSeverity}
                      onChange={(e) => setReqSeverity(e.target.value)}
                    >
                      <option value="low">Low Urgency (Non-emergency assistance)</option>
                      <option value="medium">Medium Urgency (Need support within 24h)</option>
                      <option value="high">High Urgency (Need support within hours)</option>
                      <option value="critical">Critical (Immediate life-safety danger)</option>
                    </select>
                  </div>

                  <div className="v-form-group">
                    <label className="v-form-label">DESCRIPTION OF SPECIFIC NEEDS</label>
                    <textarea
                      className="v-form-textarea"
                      placeholder="Specify materials needed, number of stranded individuals, age groups, or medical concerns..."
                      value={reqDesc}
                      onChange={(e) => setReqDesc(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="v-btn-primary w-full mt-2 cursor-pointer">
                    <Icons.plus size={14} />
                    Log Assistance Request
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Feed */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <h2 className="text-base font-semibold border-b border-neutral-200 dark:border-white/10 pb-2">
                Active Coordination Feed ({assistanceRequests.filter(r => r.status !== "resolved").length})
              </h2>
              
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[550px] pr-2">
                {assistanceRequests.length === 0 ? (
                  <div className="text-neutral-500 text-center py-12">No active assistance requests recorded.</div>
                ) : (
                  assistanceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-5 rounded-2xl shadow-sm flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                          {req.disasterType}
                        </span>
                        <span className={cn("v-request-badge", req.status)}>
                          {req.status}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                          {req.title}
                          {req.severity === "critical" && (
                            <span className="bg-red-500/10 text-red-500 text-[9px] font-extrabold px-2 py-0.5 rounded border border-red-500/20 uppercase">
                              Critical
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {req.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-white/5 pt-3 mt-1">
                        <span>📍 {req.location}</span>
                        <span>{new Date(req.time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESPONDER LAYOUT */
          <div className="flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-4 rounded-xl shadow-sm">
                <div className="text-xs text-neutral-400">Total Requests Logged</div>
                <div className="text-2xl font-mono font-bold mt-1 text-neutral-800 dark:text-neutral-200">{totalRequests}</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-4 rounded-xl shadow-sm">
                <div className="text-xs text-neutral-400">Pending Dispatch</div>
                <div className="text-2xl font-mono font-bold mt-1 text-amber-500">{pendingRequests}</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-4 rounded-xl shadow-sm">
                <div className="text-xs text-neutral-400">Active Dispatches</div>
                <div className="text-2xl font-mono font-bold mt-1 text-violet-500">{dispatchedRequests}</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-4 rounded-xl shadow-sm">
                <div className="text-xs text-neutral-400">Resolved Requests</div>
                <div className="text-2xl font-mono font-bold mt-1 text-emerald-500">{resolvedRequests}</div>
              </div>
            </div>

            {/* List and Actions */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100 dark:border-white/5 flex justify-between items-center">
                <h2 className="text-base font-semibold">Active Citizens Distress Queue</h2>
                <span className="text-xs text-neutral-400 font-mono">Real-time status updates</span>
              </div>
              
              <div className="overflow-x-auto">
                {assistanceRequests.length === 0 ? (
                  <div className="text-neutral-500 text-center py-16">Distress queue is currently empty.</div>
                ) : (
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 font-mono text-[10px] uppercase border-b border-neutral-100 dark:border-white/5">
                        <th className="p-4">Type</th>
                        <th className="p-4">Incident Request</th>
                        <th className="p-4">Severity</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                      {assistanceRequests.map((req) => (
                        <tr
                          key={req.id}
                          className="hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-neutral-400 uppercase">
                            {req.disasterType}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                              {req.title}
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">
                              {req.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                                req.severity === "critical"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : req.severity === "high"
                                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                                  : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                              )}
                            >
                              {req.severity}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500 dark:text-neutral-400">
                            {req.location}
                          </td>
                          <td className="p-4">
                            <span className={cn("v-request-badge", req.status)}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-400 font-mono text-[10px]">
                            {new Date(req.time).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            {req.status !== "resolved" ? (
                              <div className="flex gap-2 justify-end">
                                {req.status === "pending" && (
                                  <button
                                    onClick={() => onDispatchAid(req.id)}
                                    className="v-btn-primary px-3 py-1.5 text-[10px] rounded-lg cursor-pointer"
                                  >
                                    Dispatch Team
                                  </button>
                                )}
                                <button
                                  onClick={() => onResolveRequest(req.id)}
                                  className="v-btn-secondary px-3 py-1.5 text-[10px] rounded-lg cursor-pointer"
                                >
                                  Resolve
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-emerald-500 font-medium">
                                Resolved ✓
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

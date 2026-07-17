import React, { useState } from "react";
import Icons from "../components/DisasterIcons";
import { cn } from "@/lib/utils";

interface VolunterPortalProps {
  volunteerMissions: any[];
  onAcceptMission: (id: string) => void;
  onVolunteerSignup: (name: string, skill: string) => void;
  volSuccessMsg: string;
}

export default function VolunterPortal({
  volunteerMissions,
  onAcceptMission,
  onVolunteerSignup,
  volSuccessMsg,
}: VolunterPortalProps) {
  // Local Form States
  const [volName, setVolName] = useState<string>("");
  const [volSkill, setVolSkill] = useState<string>("general");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName) {
      alert("Please enter your name.");
      return;
    }
    onVolunteerSignup(volName, volSkill);
    setVolName("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#f3f4f6] pt-24 px-6 md:px-12 pb-12 flex flex-col items-center overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 dark:border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Icons.volunteer className="text-violet-500" size={24} />
              Volunteers Portal
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Join emergency relief missions and assist with disaster response logistics.
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 border border-neutral-200/50 dark:border-white/5">
            Volunteering Network Active
          </span>
        </div>

        {/* Two-Column Setup */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Enrollment Form */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl shadow-sm">
              <h2 className="text-base font-semibold mb-4 border-b border-neutral-100 dark:border-white/5 pb-2">
                Volunteer Enrollment
              </h2>
              
              {volSuccessMsg ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs leading-relaxed font-medium">
                  {volSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Register below to join our emergency response coordination database. Responders will contact you based on skillset compatibility.
                  </p>

                  <div className="v-form-group">
                    <label className="v-form-label">YOUR FULL NAME</label>
                    <input
                      type="text"
                      className="v-form-input"
                      placeholder="e.g. Sarah Jenkins"
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      required
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

                  <button type="submit" className="v-btn-primary w-full mt-2 cursor-pointer">
                    Submit Registration
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Missions Grid */}
          <div className="w-full lg:w-7/12 flex flex-col gap-4">
            <h2 className="text-base font-semibold border-b border-neutral-200 dark:border-white/10 pb-2">
              Active Relief Missions ({volunteerMissions.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteerMissions.map((m) => {
                const percentFilled = Math.min(100, Math.round((m.volunteersCount / m.volunteersNeeded) * 100));
                const isFull = m.volunteersCount >= m.volunteersNeeded;

                return (
                  <div
                    key={m.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 leading-snug">
                          {m.title}
                        </h3>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold whitespace-nowrap">
                          {m.volunteersCount}/{m.volunteersNeeded} Filled
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex flex-col gap-3 mt-1">
                      {/* Progress Bar Container */}
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300", 
                            isFull ? "bg-emerald-500" : "bg-violet-500"
                          )}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1">
                        <span>📍 {m.location}</span>
                        <button
                          className={cn(
                            "px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border",
                            isFull 
                              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-200/50 dark:border-white/5 cursor-not-allowed" 
                              : "v-btn-secondary"
                          )}
                          onClick={() => onAcceptMission(m.id)}
                          disabled={isFull}
                        >
                          {isFull ? "Mission Filled" : "Accept Mission"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

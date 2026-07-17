import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import Icons from "../components/DisasterIcons";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mock public announcements/calamity news feed
  const publicAlerts = [
    {
      id: "pub-1",
      tag: "CRITICAL",
      type: "fire",
      title: "Wildfire Advisory: Los Angeles Canyon Crest",
      desc: "Evacuation warnings issued for Sector 4 and surrounding areas. Heavy wind gusts spreading smoke plumes southward. First responders are on-site.",
      time: "10 mins ago"
    },
    {
      id: "pub-2",
      tag: "WARNING",
      type: "flood",
      title: "Coastal Surge Warning: Miami Seaboard",
      desc: "Tidal surges expected to reach 3 feet above normal levels. Residents in low-lying sectors are advised to install barriers and construct sandbag walls.",
      time: "45 mins ago"
    },
    {
      id: "pub-3",
      tag: "INFO",
      type: "earthquake",
      title: "Seismic Activity Log: Tokyo Metro Area",
      desc: "USGS registered a magnitude 6.2 tremor offshore. High-speed transit lines temporarily halted for structural safety validations. No current tsunami warnings.",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#f3f4f6] pt-24 pb-16 px-6 md:px-12 flex flex-col items-center overflow-y-auto">
      
      {/* Premium Hero Section */}
      <header className="max-w-4xl w-full text-center flex flex-col items-center gap-6 mt-8 md:mt-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/5 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          PUBLIC TELEMETRY PORTAL ACTIVE
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-500 dark:from-white dark:via-neutral-300 dark:to-neutral-500 bg-clip-text text-transparent leading-none">
          Unified Disaster Relief & Incident Coordination
        </h1>
        
        <p className="max-w-2xl text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          RescueNet coordinates citizen incident reports, emergency assistance queues, volunteer mobilization pipelines, and responder logistics on an interactive telemetry mapping interface.
        </p>

        {/* Hero Actions using shadcn Button */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {isAuthenticated ? (
            <Button 
              size="lg"
              className="cursor-pointer font-semibold shadow-md bg-neutral-950 text-white dark:bg-white dark:text-black rounded-xl px-6 py-5 hover:opacity-90 transition-opacity"
              onClick={() => navigate("/overview")}
            >
              Enter Dashboard
              <Icons.globe size={16} className="ml-1" />
            </Button>
          ) : (
            <>
              <Button 
                size="lg"
                className="cursor-pointer font-semibold shadow-md bg-neutral-950 text-white dark:bg-white dark:text-black rounded-xl px-6 py-5 hover:opacity-90 transition-opacity"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <Icons.check size={16} className="ml-1" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="cursor-pointer font-semibold rounded-xl px-6 py-5"
                onClick={() => navigate("/login")}
              >
                Account Log In
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-5xl w-full flex flex-col gap-12 mt-20">
        
        {/* Calamity News Hub (Public Data) */}
        <section className="flex flex-col gap-6">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Icons.bell className="text-red-500 animate-bounce" size={20} />
              Emergency Broadcast Center
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Public disaster-related announcements and critical calamity advisory bulletins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publicAlerts.map((alert) => {
              const isCritical = alert.tag === "CRITICAL";
              const isWarning = alert.tag === "WARNING";
              
              return (
                <div 
                  key={alert.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isCritical 
                          ? "bg-red-500/10 text-red-500 border-red-500/20" 
                          : isWarning 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}>
                        {alert.tag}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">{alert.time}</span>
                    </div>

                    <h3 className="font-semibold text-xs leading-snug text-neutral-800 dark:text-neutral-100">
                      {alert.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {alert.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-neutral-400 border-t border-neutral-100 dark:border-white/5 pt-3">
                    {alert.type === "fire" && <Icons.fire size={11} className="text-red-500" />}
                    {alert.type === "flood" && <Icons.flood size={11} className="text-blue-500" />}
                    {alert.type === "earthquake" && <Icons.earthquake size={11} className="text-violet-500" />}
                    <span>Active Calamity Warning</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Showcase Grid */}
        <section className="flex flex-col gap-6 mt-4">
          <div className="border-b border-neutral-200 dark:border-white/10 pb-4">
            <h2 className="text-xl font-bold tracking-tight">
              Coordinate & Mitigate Disasters
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Secure coordination interfaces mapped directly onto regional response networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl flex gap-4">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 h-10 w-10 flex items-center justify-center shrink-0 border border-violet-500/20">
                <Icons.globe size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-xs text-neutral-800 dark:text-neutral-100">
                  Interactive 3D Telemetry Map
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Observe earthquake feeds synced directly from USGS, alongside custom disaster markers plotted dynamically by responders. Requires authentication.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl flex gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 h-10 w-10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Icons.alert size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-xs text-neutral-800 dark:text-neutral-100">
                  Citizen Distress Intake Channels
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Report emergency situations, dispatch supplies (medical, food, transport), and mark resolved status on live distress queues. Requires authentication.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl flex gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 h-10 w-10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Icons.service size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-xs text-neutral-800 dark:text-neutral-100">
                  Nearby Emergency Infrastructure
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Locate hospitals, emergency shelters, and fire/police stations. Seamlessly fly to coordinate details on the 3D globe. Requires authentication.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl flex gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 h-10 w-10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Icons.volunteer size={20} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-xs text-neutral-800 dark:text-neutral-100">
                  Relief Mission Mobilization
                </h3>
                <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Join active missions, monitor sign-up status bars, and register credentials into the global responder database. Requires authentication.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Explorer Restriction Notice */}
        <section className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 p-6 rounded-2xl text-center flex flex-col items-center gap-3">
          <Icons.responder className="text-neutral-400 dark:text-neutral-500" size={24} />
          <h3 className="font-bold text-xs text-neutral-700 dark:text-neutral-300">Explore Dashboard Coordination Channels</h3>
          <p className="max-w-xl text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            All active dispatcher telemetry tools, telemetry logs, maps, and assistance reporting are locked behind our identity network. Log in or create an account to start contributing to disaster response coordination.
          </p>
          <Button 
            variant="ghost" 
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white font-medium cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Access Account Credentials →
          </Button>
        </section>

      </main>

    </div>
  );
}

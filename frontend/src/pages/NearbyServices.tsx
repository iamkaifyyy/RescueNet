import React from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../components/DisasterIcons";

interface NearbyServicesProps {
  services: any[];
}

export default function NearbyServices({ services }: NearbyServicesProps) {
  const navigate = useNavigate();

  const handleLocateOnGlobe = (coordinates: [number, number]) => {
    // Navigate to the protected overview dashboard and pass coordinates via React Router navigation state
    navigate("/overview", { state: { focusCoords: coordinates } });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#000000] text-[#171717] dark:text-[#f3f4f6] pt-24 px-6 md:px-12 pb-12 flex flex-col items-center overflow-y-auto">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 dark:border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Icons.service className="text-blue-500" size={24} />
              Nearby Emergency Services
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Critical infrastructure, emergency shelters, and first responder stations.
            </p>
          </div>
          <span className="text-[11px] font-mono font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 border border-neutral-200/50 dark:border-white/5">
            {services.length} Facilities Active
          </span>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const isHospital = srv.type === "Hospital";
            const isShelter = srv.type === "Shelter";
            const isFire = srv.type === "Fire Station";
            
            return (
              <div 
                key={srv.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Block */}
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
                    {isHospital ? (
                      <Icons.building size={20} />
                    ) : (
                      <Icons.service size={20} />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-neutral-800 dark:text-neutral-100 leading-tight">
                      {srv.name}
                    </h3>
                    <span className="inline-block text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-400 mt-1">
                      {srv.type}
                    </span>
                    
                    <div className="mt-4 flex flex-col gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px]">📍</span>
                        <span>{srv.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[11px]">📞</span>
                        <span>{srv.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Distance & Globe Link */}
                <div className="flex justify-between items-center border-t border-neutral-100 dark:border-white/5 pt-4">
                  <span className="font-mono text-xs text-neutral-400 font-medium">
                    Distance: {srv.distance}
                  </span>
                  
                  <button
                    onClick={() => handleLocateOnGlobe(srv.coordinates)}
                    className="flex items-center gap-1 text-xs text-blue-500 font-semibold hover:underline cursor-pointer transition-colors"
                  >
                    <Icons.globe size={12} />
                    Locate on Globe
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Icons from "./DisasterIcons";
import { ModeToggle } from "./mode-toggle";

interface FloatingNavProps {
  pendingRequestsCount: number;
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  addLog: (tag: "info" | "alert" | "success" | "warning", text: string) => void;
  className?: string;
}

export const FloatingNav = ({
  pendingRequestsCount,
  leftSidebarOpen,
  setLeftSidebarOpen,
  addLog,
  className,
}: FloatingNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Compute activeTab directly from the React Router path
  const activeTab = 
    location.pathname === "/assistance-requests"
      ? "requests"
      : location.pathname === "/nearby-services"
      ? "services"
      : location.pathname === "/volunteers-portal"
      ? "volunteers"
      : location.pathname === "/overview"
      ? "overview"
      : "landing";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -50,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className={cn(
          "fixed top-4 inset-x-0 mx-auto z-[5000] flex justify-center w-[95%] max-w-7xl",
          className
        )}
      >
        <div className="flex items-center justify-between w-full rounded-full border border-neutral-200/80 bg-white/85 px-6 py-2 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/80">
          
          {/* Brand/Logo Section */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer select-none border border-transparent hover:border-neutral-200 dark:hover:border-white/10 group active:scale-95"
              onClick={() => {
                if (isAuthenticated) {
                  setLeftSidebarOpen(!leftSidebarOpen);
                  if (location.pathname !== "/overview") {
                    navigate("/overview");
                  }
                } else {
                  navigate("/");
                }
              }}
              title={isAuthenticated ? "Toggle Left Sidebar" : "Go to Landing Page"}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-950 text-white font-extrabold text-xs dark:bg-white dark:text-black transition-all duration-200 group-hover:rotate-12">
                ▲
              </span>
              <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white">
                RescueNet
              </span>
              {isAuthenticated && location.pathname === "/overview" && (
                <div className="flex h-4 w-4 items-center justify-center rounded-md text-neutral-400 dark:text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-1">
                  <Icons.menu size={12} />
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-neutral-200 dark:bg-white/10 hidden md:block" />
            <span className="hidden md:inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-mono font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/5">
              production
            </span>
          </div>

          {/* Navigation Tabs (Only visible when authenticated) */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                  activeTab === "overview"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
                onClick={() => navigate("/overview")}
              >
                <Icons.globe size={14} />
                <span className="hidden sm:inline">Overview</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer relative",
                  activeTab === "requests"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
                onClick={() => navigate("/assistance-requests")}
              >
                <Icons.alert size={14} />
                <span className="hidden sm:inline">Assistance Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-100 px-1.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                  activeTab === "services"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
                onClick={() => navigate("/nearby-services")}
              >
                <Icons.service size={14} />
                <span className="hidden sm:inline">Nearby Services</span>
              </button>

              <button
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer",
                  activeTab === "volunteers"
                    ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                )}
                onClick={() => navigate("/volunteers-portal")}
              >
                <Icons.volunteer size={14} />
                <span className="hidden sm:inline">Volunteers Portal</span>
              </button>
            </nav>
          )}

          {/* Right Section: Authentication controls & Theme Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Authenticated Role Badge */}
                <span className="hidden md:inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-mono font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/5 uppercase">
                  {user?.role === "responder" ? "🚨 Responder" : "👤 Citizen"}
                </span>

                <ModeToggle />

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    addLog("info", `User logged out of system: ${user?.email}`);
                    navigate("/login");
                  }}
                  className="cursor-pointer text-xs font-semibold rounded-xl border-neutral-200/80 dark:border-white/10"
                >
                  Log Out
                </Button>

                {/* Mobile Left Sidebar Toggle Trigger */}
                {isAuthenticated && location.pathname === "/overview" && (
                  <button
                    onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                    className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all cursor-pointer"
                    title="Toggle Map Filters"
                  >
                    <Icons.list size={16} />
                  </button>
                )}

                {/* Mobile Navigation Drawer Trigger */}
                {isAuthenticated && (
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all cursor-pointer"
                    title="Toggle Menu"
                  >
                    {mobileMenuOpen ? <Icons.x size={16} /> : <Icons.menu size={16} />}
                  </button>
                )}
              </>
            ) : (
              <>
                <ModeToggle />

                {/* Public Actions - Login & Sign Up (using shadcn/ui button components) */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-xs font-semibold rounded-xl"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    className="cursor-pointer text-xs font-semibold rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {mobileMenuOpen && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[105%] left-0 right-0 bg-white/95 dark:bg-black/95 border border-neutral-200/80 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col p-4 gap-2.5 md:hidden z-[6000]"
              >
                <button
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                    activeTab === "overview"
                      ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                  )}
                  onClick={() => {
                    navigate("/overview");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icons.globe size={16} />
                  Overview
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer relative",
                    activeTab === "requests"
                      ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                  )}
                  onClick={() => {
                    navigate("/assistance-requests");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icons.alert size={16} />
                  Assistance Requests
                  {pendingRequestsCount > 0 && (
                    <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[10px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                    activeTab === "services"
                      ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                  )}
                  onClick={() => {
                    navigate("/nearby-services");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icons.service size={16} />
                  Nearby Services
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                    activeTab === "volunteers"
                      ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
                  )}
                  onClick={() => {
                    navigate("/volunteers-portal");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icons.volunteer size={16} />
                  Volunteers Portal
                </button>
                
                <div className="h-px bg-neutral-200 dark:bg-white/10 my-1" />
                
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                    {user?.role === "responder" ? "🚨 Responder" : "👤 Citizen"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      addLog("info", `User logged out of system: ${user?.email}`);
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer text-xs font-semibold rounded-xl border-neutral-200/80 dark:border-white/10"
                  >
                    Log Out
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

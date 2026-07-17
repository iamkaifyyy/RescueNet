import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import Icons from "../components/DisasterIcons";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all credentials fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Authenticate and redirect to /overview
    login(email, password, role).then((success) => {
      if (success) {
        navigate("/overview");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#f3f4f6] pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md w-full max-w-md flex flex-col gap-6">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white font-extrabold text-lg dark:bg-white dark:text-black shadow-md">
            ▲
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-2">Log In to RescueNet</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Access secure emergency response and dispatch telemetry.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase font-mono">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase font-mono">
              INTERFACE VIEW MODE
            </label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-50 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200 dark:border-white/10">
              <button
                type="button"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold select-none cursor-pointer transition-all ${
                  role === "citizen"
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
                }`}
                onClick={() => setRole("citizen")}
              >
                <Icons.citizen size={12} />
                Citizen
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold select-none cursor-pointer transition-all ${
                  role === "responder"
                    ? "bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white"
                }`}
                onClick={() => setRole("responder")}
              >
                <Icons.responder size={12} />
                Responder
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="cursor-pointer font-semibold shadow-md bg-neutral-950 text-white dark:bg-white dark:text-black rounded-xl py-2 mt-2 w-full hover:opacity-90 transition-opacity"
          >
            Sign In to Account
          </Button>
        </form>

        <div className="border-t border-neutral-100 dark:border-white/5 pt-4 text-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

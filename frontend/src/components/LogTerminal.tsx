import { useEffect, useRef } from "react";
import Icons from "./DisasterIcons";

interface LogTerminalProps {
  logs: any[];
  simulationActive: boolean;
  onClear: () => void;
}

export default function LogTerminal({
  logs,
  simulationActive,
  onClear
}: LogTerminalProps) {
  const logTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = 0; // Auto-scroll to top (newest logs first)
    }
  }, [logs]);

  return (
    <div className="v-log-terminal-container">
      <div style={{
        padding: "8px 12px",
        borderBottom: "1px solid #1f2028",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#e5e7eb", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
          <Icons.sync size={12} style={{ animation: simulationActive ? "spin 3s linear infinite" : "none" }} />
          LIVE_UPDATES_STREAM.log
        </span>
        <button 
          onClick={onClear}
          style={{ background: "none", border: "none", color: "#6b7280", fontSize: "10px", cursor: "pointer", fontFamily: "var(--font-mono)" }}
        >
          CLEAR
        </button>
      </div>
      <div className="v-log-terminal" ref={logTerminalRef}>
        {logs.length === 0 ? (
          <div style={{ color: "#4d4d4d", fontStyle: "italic", textAlign: "center", padding: "12px" }}>No logs stream in buffer. Toggle simulation.</div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="v-log-entry">
              <span className="v-log-timestamp">[{new Date(log.time).toLocaleTimeString()}]</span>
              <span className={`v-log-tag ${log.tag}`}>{log.tag}</span>
              <span>{log.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

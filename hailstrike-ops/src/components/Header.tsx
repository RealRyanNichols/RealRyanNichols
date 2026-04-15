"use client";

import { INDUSTRY_MODES, type IndustryMode } from "@/lib/industry-modes";

interface HeaderProps {
  industryMode: IndustryMode;
  onModeChange: (mode: IndustryMode) => void;
  showRadar: boolean;
  onToggleRadar: () => void;
  alertCount: number;
  reportCount: number;
}

export default function Header({
  industryMode,
  onModeChange,
  showRadar,
  onToggleRadar,
  alertCount,
  reportCount,
}: HeaderProps) {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-4 z-[1001] relative">
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
          HS
        </div>
        <h1 className="text-white font-bold text-lg hidden sm:block">
          HailStrike<span className="text-cyan-400">Ops</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-gray-300">
            <span className="text-white font-semibold">{alertCount}</span>{" "}
            Alerts
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-300">
            <span className="text-white font-semibold">{reportCount}</span>{" "}
            Reports
          </span>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={onToggleRadar}
        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
          showRadar
            ? "bg-cyan-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        Radar {showRadar ? "ON" : "OFF"}
      </button>

      <select
        value={industryMode}
        onChange={(e) => onModeChange(e.target.value as IndustryMode)}
        className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs text-white"
      >
        {Object.entries(INDUSTRY_MODES).map(([key, mode]) => (
          <option key={key} value={key}>
            {mode.icon} {mode.label}
          </option>
        ))}
      </select>
    </header>
  );
}

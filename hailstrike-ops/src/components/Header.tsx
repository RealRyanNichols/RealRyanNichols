"use client";

import { industryModes } from "@/lib/industry-modes";
import type { IndustryMode } from "@/lib/types";

interface HeaderProps {
  currentMode: IndustryMode;
  onModeChange: (mode: IndustryMode) => void;
  radarEnabled: boolean;
  onRadarToggle: () => void;
  eventCount: number;
}

export default function Header({
  currentMode,
  onModeChange,
  radarEnabled,
  onRadarToggle,
  eventCount,
}: HeaderProps) {
  return (
    <header className="bg-gray-950 border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-wrap gap-2 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <h1 className="text-lg font-bold text-white tracking-tight">
            HAILSTRIKE<span className="text-cyan-400"> OPS</span>
          </h1>
        </div>
        <span className="text-xs text-gray-500 hidden sm:block">
          Missouri Dent Bully
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Industry Mode Selector */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5">
          {industryModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`px-2 py-1 text-xs rounded-md transition-all ${
                currentMode === mode.id
                  ? "bg-cyan-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              title={mode.label}
            >
              <span className="hidden md:inline">{mode.icon} </span>
              <span className="hidden lg:inline">{mode.label}</span>
              <span className="lg:hidden">{mode.icon}</span>
            </button>
          ))}
        </div>

        {/* Radar Toggle */}
        <button
          onClick={onRadarToggle}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
            radarEnabled
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white"
          }`}
        >
          {radarEnabled ? "RADAR ON" : "RADAR OFF"}
        </button>

        {/* Event Count */}
        <div className="flex items-center gap-1.5 bg-gray-900 rounded-lg px-3 py-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              eventCount > 0 ? "bg-red-500 animate-pulse" : "bg-gray-600"
            }`}
          />
          <span className="text-xs text-gray-300">
            {eventCount} active
          </span>
        </div>
      </div>
    </header>
  );
}

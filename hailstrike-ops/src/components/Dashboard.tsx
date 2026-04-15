"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "./Header";
import StatsBar from "./StatsBar";
import EventDetailPanel from "./EventDetailPanel";
import type { IndustryMode } from "@/lib/industry-modes";

const StormMap = dynamic(() => import("./StormMap"), { ssr: false });

interface EventInfo {
  lat: number;
  lng: number;
  city: string;
  county: string;
  state: string;
  hailSize: number;
  source: string;
  damage: string;
  detail?: string;
}

export default function Dashboard() {
  const [industryMode, setIndustryMode] = useState<IndustryMode>("auto");
  const [showRadar, setShowRadar] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleEventClick = useCallback((event: EventInfo) => {
    setSelectedEvent(event);
  }, []);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [alertRes, reportRes] = await Promise.all([
          fetch("/api/weather/alerts"),
          fetch("/api/weather/reports"),
        ]);
        const alertData = await alertRes.json();
        const reportData = await reportRes.json();
        setAlertCount(alertData.features?.length || 0);
        setReportCount(reportData.reports?.length || 0);
        setLastUpdated(new Date());
      } catch (e) {
        console.error("Failed to fetch counts:", e);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Header
        industryMode={industryMode}
        onModeChange={setIndustryMode}
        showRadar={showRadar}
        onToggleRadar={() => setShowRadar((v) => !v)}
        alertCount={alertCount}
        reportCount={reportCount}
      />

      <div className="flex-1 relative">
        <StormMap onEventClick={handleEventClick} showRadar={showRadar} />

        {selectedEvent && (
          <EventDetailPanel
            event={selectedEvent}
            industryMode={industryMode}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>

      <StatsBar
        alertCount={alertCount}
        reportCount={reportCount}
        lastUpdated={lastUpdated}
      />
    </div>
  );
}

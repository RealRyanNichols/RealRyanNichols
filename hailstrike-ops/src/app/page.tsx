"use client";

import { useState, useCallback } from "react";
import Header from "@/components/Header";
import MapWrapper from "@/components/MapWrapper";
import EventDetailPanel from "@/components/EventDetailPanel";
import BusinessScout from "@/components/BusinessScout";
import IntelLog from "@/components/IntelLog";
import OutreachPanel from "@/components/OutreachPanel";
import AdCampaignBuilder from "@/components/AdCampaignBuilder";
import type { HailReport, IndustryMode } from "@/lib/types";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<HailReport | null>(null);
  const [industryMode, setIndustryMode] = useState<IndustryMode>("auto");
  const [radarEnabled, setRadarEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [savedEventId, setSavedEventId] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);

  const handleEventClick = useCallback((report: HailReport) => {
    setSelectedEvent(report);
    setActiveTab("overview");
    setSavedEventId(null);
    setEventCount((prev) => Math.max(prev, 1));
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedEvent(null);
    setSavedEventId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        currentMode={industryMode}
        onModeChange={setIndustryMode}
        radarEnabled={radarEnabled}
        onRadarToggle={() => setRadarEnabled(!radarEnabled)}
        eventCount={eventCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div
          className={`flex-1 relative transition-all ${
            selectedEvent ? "hidden md:block" : ""
          }`}
        >
          <MapWrapper
            onEventClick={handleEventClick}
            selectedEvent={selectedEvent}
            radarEnabled={radarEnabled}
          />

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-950/90 backdrop-blur rounded-lg p-3 z-[1000] text-xs space-y-1.5">
            <p className="text-gray-400 font-semibold text-[10px] uppercase">
              Legend
            </p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">Catastrophic (&ge;2.75&quot;)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-gray-300">Severe (&ge;1.0&quot;)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-300">Low (&lt;1.0&quot;)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-300">IEM Report</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded border-2 border-yellow-500 border-dashed" />
              <span className="text-gray-300">Radar Indicated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-400" />
              <span className="text-gray-300">Verified</span>
            </div>
          </div>

          {/* No Event Selected Message */}
          {!selectedEvent && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-950/90 backdrop-blur rounded-lg px-4 py-2 z-[1000]">
              <p className="text-gray-400 text-xs text-center">
                Click any hail event on the map to view details, scout
                businesses, and launch outreach
              </p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedEvent && (
          <div className="w-full md:w-96 lg:w-[420px] flex flex-col overflow-hidden border-l border-gray-800">
            <EventDetailPanel
              event={selectedEvent}
              onClose={handleClosePanel}
              onTabChange={setActiveTab}
              activeTab={activeTab}
              onEventSaved={setSavedEventId}
              savedEventId={savedEventId}
            />

            {/* Tab Content Below Detail Panel */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-950">
              {activeTab === "businesses" && (
                <BusinessScout
                  event={selectedEvent}
                  savedEventId={savedEventId}
                  industryMode={industryMode}
                />
              )}
              {activeTab === "intel" && (
                <IntelLog savedEventId={savedEventId} />
              )}
              {activeTab === "outreach" && (
                <OutreachPanel
                  event={selectedEvent}
                  savedEventId={savedEventId}
                  industryMode={industryMode}
                />
              )}
              {activeTab === "ads" && (
                <AdCampaignBuilder
                  event={selectedEvent}
                  savedEventId={savedEventId}
                  industryMode={industryMode}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

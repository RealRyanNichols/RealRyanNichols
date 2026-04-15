"use client";

import { useState, useEffect } from "react";
import type { HailReport, DemographicsData } from "@/lib/types";

interface EventDetailPanelProps {
  event: HailReport;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
  onEventSaved: (id: string) => void;
  savedEventId: string | null;
}

function getDamageColor(damage: string): string {
  switch (damage) {
    case "Catastrophic":
      return "text-red-400";
    case "Severe":
      return "text-orange-400";
    case "Moderate":
      return "text-yellow-400";
    default:
      return "text-green-400";
  }
}

function getSourceBadge(source: string): { color: string; label: string } {
  switch (source) {
    case "nws":
      return { color: "bg-yellow-600", label: "NWS" };
    case "spc":
      return { color: "bg-green-600", label: "SPC" };
    case "iem":
      return { color: "bg-blue-600", label: "IEM" };
    default:
      return { color: "bg-gray-600", label: source.toUpperCase() };
  }
}

export default function EventDetailPanel({
  event,
  onClose,
  onTabChange,
  activeTab,
  onEventSaved,
  savedEventId,
}: EventDetailPanelProps) {
  const [demographics, setDemographics] = useState<DemographicsData | null>(
    null
  );
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    // Fetch demographics for this location
    setLoadingDemo(true);
    fetch(`/api/weather/demographics?state=29`)
      .then((res) => res.json())
      .then((data) => {
        if (data.demographics && data.demographics.length > 0) {
          // Find closest county match
          const match = data.demographics.find(
            (d: DemographicsData) =>
              d.countyName
                ?.toLowerCase()
                .includes(event.county?.toLowerCase() || "")
          );
          setDemographics(match || data.demographics[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingDemo(false));
  }, [event.county]);

  const saveEvent = async () => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nwsAlertId: event.nwsAlertId || null,
          latitude: event.lat,
          longitude: event.lon,
          city: event.city,
          county: event.county,
          state: event.state,
          hailSize: event.size,
          source: event.source,
          sourceDetail: event.comments,
          damage: event.damage,
          windSpeed: event.windSpeed || null,
          verified: event.verified,
          swathGeoJSON: event.geometry || null,
          avgHomeValue: demographics?.medianHomeValue || null,
          medianIncome: demographics?.medianIncome || null,
          population: demographics?.population || null,
        }),
      });
      const data = await res.json();
      if (data.event) {
        onEventSaved(data.event.id);
      }
    } catch (err) {
      console.error("Save event error:", err);
    }
  };

  const srcBadge = getSourceBadge(event.source);
  const tabs = ["Overview", "Businesses", "Intel", "Outreach", "Ads"];

  return (
    <div className="bg-gray-950 border-l border-gray-800 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-800 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${srcBadge.color} text-white`}
            >
              {srcBadge.label}
            </span>
            {event.verified && (
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-500/30" title="Verified" />
            )}
            <span className={`text-xs font-bold ${getDamageColor(event.damage)}`}>
              {event.damage}
            </span>
          </div>
          <h2 className="text-white font-bold text-sm truncate">
            {event.city}, {event.state}
          </h2>
          <p className="text-gray-500 text-xs">
            {event.county} County | {event.size}&quot; hail
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase())}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.toLowerCase()
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Storm Details */}
            <div className="bg-gray-900 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Storm Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Hail Size</span>
                  <p className="text-white font-bold text-lg">{event.size}&quot;</p>
                </div>
                <div>
                  <span className="text-gray-500">Damage Level</span>
                  <p className={`font-bold text-lg ${getDamageColor(event.damage)}`}>
                    {event.damage}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Source</span>
                  <p className="text-white">{event.source.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Verified</span>
                  <p className={event.verified ? "text-green-400" : "text-yellow-400"}>
                    {event.verified ? "Yes" : "Unconfirmed"}
                  </p>
                </div>
                {event.windSpeed && (
                  <div>
                    <span className="text-gray-500">Wind Speed</span>
                    <p className="text-white">{event.windSpeed} mph</p>
                  </div>
                )}
                {event.hailThreat && (
                  <div>
                    <span className="text-gray-500">Threat Type</span>
                    <p className="text-white">{event.hailThreat}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-500">Coordinates</span>
                  <p className="text-white font-mono text-[10px]">
                    {event.lat.toFixed(4)}, {event.lon.toFixed(4)}
                  </p>
                </div>
              </div>
              {event.comments && (
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <span className="text-gray-500 text-xs">Comments</span>
                  <p className="text-gray-300 text-xs mt-0.5">{event.comments}</p>
                </div>
              )}
            </div>

            {/* Demographics */}
            <div className="bg-gray-900 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                Demographics
              </h3>
              {loadingDemo ? (
                <div className="text-gray-500 text-xs">Loading demographics...</div>
              ) : demographics ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Median Home Value</span>
                    <p className={`text-white font-bold ${
                      demographics.medianHomeValue && demographics.medianHomeValue >= 300000
                        ? "text-green-400"
                        : ""
                    }`}>
                      {demographics.medianHomeValue
                        ? `$${demographics.medianHomeValue.toLocaleString()}`
                        : "N/A"}
                    </p>
                    {demographics.medianHomeValue &&
                      demographics.medianHomeValue >= 300000 && (
                        <span className="text-[10px] text-green-500">
                          HIGH VALUE AREA
                        </span>
                      )}
                  </div>
                  <div>
                    <span className="text-gray-500">Median Income</span>
                    <p className="text-white font-bold">
                      {demographics.medianIncome
                        ? `$${demographics.medianIncome.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Population</span>
                    <p className="text-white font-bold">
                      {demographics.population
                        ? demographics.population.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">County</span>
                    <p className="text-white">{demographics.countyName || event.county}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-xs">No demographic data available</p>
              )}
            </div>

            {/* Save Event Button */}
            {!savedEventId ? (
              <button
                onClick={saveEvent}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition"
              >
                Save Event to Database
              </button>
            ) : (
              <div className="text-center text-green-400 text-xs py-2 bg-green-900/20 rounded-lg">
                Event saved (ID: {savedEventId.slice(0, 8)}...)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

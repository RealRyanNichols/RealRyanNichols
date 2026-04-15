"use client";

import { useState, useEffect, useCallback } from "react";
import type { HailReport, IndustryMode, BusinessResult } from "@/lib/types";
import { getIndustryMode } from "@/lib/industry-modes";

interface BusinessScoutProps {
  event: HailReport;
  savedEventId: string | null;
  industryMode: IndustryMode;
}

const STATUS_COLORS: Record<string, string> = {
  prospect: "bg-gray-600",
  contacted: "bg-yellow-600",
  "outreach sent": "bg-blue-600",
  hot: "bg-red-600",
  won: "bg-green-600",
};

const STATUS_OPTIONS = [
  "prospect",
  "contacted",
  "outreach sent",
  "hot",
  "won",
];

const HAIL_EXPERIENCE_OPTIONS = [
  "Never",
  "Outsources",
  "Has own",
  "Overwhelmed",
];

export default function BusinessScout({
  event,
  savedEventId,
  industryMode,
}: BusinessScoutProps) {
  const [businesses, setBusinesses] = useState<BusinessResult[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<BusinessResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchRadius, setSearchRadius] = useState(25000);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const modeConfig = getIndustryMode(industryMode);

  const searchBusinesses = useCallback(async () => {
    setLoading(true);
    setApiMessage(null);
    try {
      const res = await fetch("/api/businesses/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: event.lat,
          lon: event.lon,
          radius: searchRadius,
          types: modeConfig.googlePlaceTypes,
        }),
      });
      const data = await res.json();
      if (data.message) setApiMessage(data.message);
      setBusinesses(data.businesses || []);
    } catch (err) {
      console.error("Business search error:", err);
      setApiMessage("Search failed. Check API configuration.");
    }
    setLoading(false);
  }, [event.lat, event.lon, searchRadius, modeConfig.googlePlaceTypes]);

  // Load saved businesses
  useEffect(() => {
    if (savedEventId) {
      fetch(`/api/businesses?eventId=${savedEventId}`)
        .then((res) => res.json())
        .then((data) => setSavedBusinesses(data.businesses || []))
        .catch(console.error);
    }
  }, [savedEventId]);

  const saveBusiness = async (biz: BusinessResult) => {
    if (!savedEventId) return;
    try {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: savedEventId,
          name: biz.name,
          type: biz.type,
          address: biz.address,
          phone: biz.phone,
          website: biz.website,
          industryMode,
        }),
      });
      const data = await res.json();
      if (data.business) {
        setSavedBusinesses((prev) => [...prev, data.business]);
      }
    } catch (err) {
      console.error("Save business error:", err);
    }
  };

  const updateBusinessStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/businesses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSavedBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const copyContact = (biz: BusinessResult) => {
    const text = `${biz.name}\n${biz.address}\n${biz.phone || ""}\n${biz.website || ""}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-3">
      {/* Search Controls */}
      <div className="bg-gray-900 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">
            Business Scout — {modeConfig.label}
          </h3>
          <span className="text-[10px] text-gray-600">
            {modeConfig.businessTypes.join(", ")}
          </span>
        </div>
        <div className="flex gap-2">
          <select
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700"
          >
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={25000}>25 km</option>
            <option value={50000}>50 km</option>
          </select>
          <button
            onClick={searchBusinesses}
            disabled={loading}
            className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 text-white text-xs font-medium rounded transition"
          >
            {loading ? "Searching..." : "Scout Businesses"}
          </button>
        </div>
        {apiMessage && (
          <p className="text-yellow-400 text-[10px] mt-1">{apiMessage}</p>
        )}
      </div>

      {/* Search Results */}
      {businesses.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Found {businesses.length} businesses
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {businesses.map((biz, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded p-2 flex items-start justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-medium truncate">
                    {biz.name}
                  </p>
                  <p className="text-gray-500 text-[10px] truncate">
                    {biz.address}
                  </p>
                  {biz.phone && (
                    <p className="text-gray-400 text-[10px]">{biz.phone}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => copyContact(biz)}
                    className="px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] rounded transition"
                    title="Copy contact"
                  >
                    Copy
                  </button>
                  {savedEventId && (
                    <button
                      onClick={() => saveBusiness(biz)}
                      className="px-1.5 py-0.5 bg-cyan-700 hover:bg-cyan-600 text-white text-[10px] rounded transition"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Businesses Pipeline */}
      {savedBusinesses.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Pipeline ({savedBusinesses.length})
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {savedBusinesses.map((biz) => (
              <div key={biz.id} className="bg-gray-800 rounded p-2">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">
                      {biz.name}
                    </p>
                    <p className="text-gray-500 text-[10px] truncate">
                      {biz.address}
                    </p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded text-white ${
                      STATUS_COLORS[biz.status || "prospect"]
                    }`}
                  >
                    {(biz.status || "prospect").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <select
                    value={biz.status || "prospect"}
                    onChange={(e) =>
                      biz.id && updateBusinessStatus(biz.id, e.target.value)
                    }
                    className="bg-gray-700 text-white text-[10px] rounded px-1 py-0.5 border border-gray-600"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={biz.hailExperience || ""}
                    onChange={(e) =>
                      biz.id &&
                      fetch(`/api/businesses/${biz.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          hailExperience: e.target.value,
                        }),
                      })
                    }
                    className="bg-gray-700 text-white text-[10px] rounded px-1 py-0.5 border border-gray-600"
                  >
                    <option value="">Hail Exp.</option>
                    {HAIL_EXPERIENCE_OPTIONS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => copyContact(biz)}
                    className="px-1.5 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-[10px] rounded transition"
                  >
                    Copy
                  </button>
                  {biz.phone && (
                    <a
                      href={`tel:${biz.phone}`}
                      className="px-1.5 py-0.5 bg-green-700 hover:bg-green-600 text-white text-[10px] rounded transition"
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

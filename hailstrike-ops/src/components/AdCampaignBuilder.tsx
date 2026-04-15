"use client";

import { useState, useEffect } from "react";
import type { HailReport, IndustryMode } from "@/lib/types";
import { getIndustryMode, fillTemplate } from "@/lib/industry-modes";

interface AdCampaign {
  id: string;
  city: string;
  headline: string;
  body: string;
  radiusMiles: number;
  dailyBudget: number;
  status: string;
  autoApproved: boolean;
  leadsGenerated: number;
  metaCampaignId: string | null;
  createdAt: string;
}

interface AdCampaignBuilderProps {
  event: HailReport;
  savedEventId: string | null;
  industryMode: IndustryMode;
}

export default function AdCampaignBuilder({
  event,
  savedEventId,
  industryMode,
}: AdCampaignBuilderProps) {
  const modeConfig = getIndustryMode(industryMode);
  const templateData = {
    city: event.city,
    state: event.state,
    size: String(event.size),
    damage: event.damage,
  };

  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [headline, setHeadline] = useState(
    fillTemplate(modeConfig.adHeadline, templateData)
  );
  const [adBody, setAdBody] = useState(
    fillTemplate(modeConfig.adBody, templateData)
  );
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [dailyBudget, setDailyBudget] = useState(50);
  const [autoApprove, setAutoApprove] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (savedEventId) {
      fetch(`/api/ads?eventId=${savedEventId}`)
        .then((res) => res.json())
        .then((data) => setCampaigns(data.campaigns || []))
        .catch(console.error);
    }
  }, [savedEventId]);

  const createCampaign = async () => {
    if (!savedEventId) {
      setResult("Save the event first before creating ad campaigns.");
      return;
    }
    setCreating(true);
    setResult(null);
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: savedEventId,
          city: event.city,
          headline,
          adBody,
          lat: event.lat,
          lon: event.lon,
          radiusMiles,
          dailyBudget,
          autoApproved: autoApprove,
          industryMode,
          targeting: `${radiusMiles}mi radius around ${event.city}, ${event.state}`,
        }),
      });
      const data = await res.json();
      if (data.campaign) {
        setCampaigns((prev) => [data.campaign, ...prev]);
        setResult(
          data.campaign.metaCampaignId
            ? `Campaign created on Meta! ID: ${data.campaign.metaCampaignId}`
            : "Campaign saved locally. Configure META_ACCESS_TOKEN to push to Facebook."
        );
      }
    } catch (err) {
      setResult(`Failed: ${err}`);
    }
    setCreating(false);
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    active: "text-green-400",
    paused: "text-gray-400",
    completed: "text-blue-400",
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-lg p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Meta/Facebook Ad Campaign
        </h3>

        <div className="space-y-2">
          <div>
            <label className="text-gray-500 text-[10px]">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-500 text-[10px]">Ad Body</label>
            <textarea
              value={adBody}
              onChange={(e) => setAdBody(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-500 text-[10px]">
                Radius (miles)
              </label>
              <input
                type="number"
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(parseInt(e.target.value) || 25)}
                min={1}
                max={80}
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">
                Daily Budget ($)
              </label>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) =>
                  setDailyBudget(parseFloat(e.target.value) || 50)
                }
                min={5}
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="rounded bg-gray-700 border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
              Auto-approve (push to Meta immediately)
            </label>
          </div>

          <div className="bg-gray-800 rounded p-2 mt-2">
            <p className="text-gray-500 text-[10px] mb-1">Targeting Preview</p>
            <p className="text-gray-300 text-xs">
              {radiusMiles}mi radius around {event.city}, {event.state} (
              {event.lat.toFixed(2)}, {event.lon.toFixed(2)})
            </p>
            <p className="text-gray-500 text-[10px] mt-1">
              Ages 25-65 | Est. daily spend: ${dailyBudget}
            </p>
          </div>

          <button
            onClick={createCampaign}
            disabled={creating || !savedEventId}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs font-medium rounded transition"
          >
            {creating
              ? "Creating..."
              : autoApprove
              ? "Launch Campaign"
              : "Save Campaign Draft"}
          </button>

          {!savedEventId && (
            <p className="text-yellow-400 text-[10px] text-center">
              Save the event first before creating campaigns.
            </p>
          )}

          {result && (
            <div
              className={`p-2 rounded text-xs ${
                result.startsWith("Failed")
                  ? "bg-red-900/30 text-red-400"
                  : "bg-green-900/30 text-green-400"
              }`}
            >
              {result}
            </div>
          )}
        </div>
      </div>

      {/* Existing Campaigns */}
      {campaigns.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
            Campaigns ({campaigns.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded p-2">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-medium truncate">
                      {c.headline}
                    </p>
                    <p className="text-gray-500 text-[10px]">
                      {c.city} | {c.radiusMiles}mi | ${c.dailyBudget}/day
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      statusColors[c.status] || "text-gray-400"
                    }`}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
                {c.metaCampaignId && (
                  <p className="text-cyan-400 text-[10px] mt-1">
                    Meta ID: {c.metaCampaignId}
                  </p>
                )}
                <p className="text-gray-600 text-[10px]">
                  Leads: {c.leadsGenerated} |{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

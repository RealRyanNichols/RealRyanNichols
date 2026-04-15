"use client";

import { useState } from "react";
import type { BusinessResult } from "@/lib/types";
import type { IndustryMode } from "@/lib/industry-modes";
import { INDUSTRY_MODES, OUTREACH_TEMPLATES } from "@/lib/industry-modes";

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

interface EventDetailPanelProps {
  event: EventInfo | null;
  industryMode: IndustryMode;
  onClose: () => void;
}

type PanelTab = "info" | "businesses" | "outreach" | "intel" | "ads";

export default function EventDetailPanel({
  event,
  industryMode,
  onClose,
}: EventDetailPanelProps) {
  const [tab, setTab] = useState<PanelTab>("info");
  const [businesses, setBusinesses] = useState<BusinessResult[]>([]);
  const [loadingBiz, setLoadingBiz] = useState(false);
  const [bizError, setBizError] = useState("");

  // Intel form
  const [intelForm, setIntelForm] = useState({
    sourceName: "",
    sourcePhone: "",
    callerName: "",
    notes: "",
  });
  const [intelLogs, setIntelLogs] = useState<Array<{
    id: string;
    sourceName: string;
    sourcePhone?: string;
    callerName: string;
    notes: string;
    createdAt: string;
  }>>([]);
  const [intelMsg, setIntelMsg] = useState("");

  // Outreach
  const [outreachPhone, setOutreachPhone] = useState("");
  const [outreachEmail, setOutreachEmail] = useState("");
  const [outreachMsg, setOutreachMsg] = useState("");

  // Ads
  const [adForm, setAdForm] = useState({
    headline: "",
    body: "",
    radiusMiles: 25,
    dailyBudget: 50,
    autoApproved: false,
  });
  const [adMsg, setAdMsg] = useState("");

  if (!event) return null;

  const damageColor =
    event.damage === "Catastrophic"
      ? "text-red-500"
      : event.damage === "Severe"
        ? "text-orange-500"
        : event.damage === "Moderate"
          ? "text-yellow-500"
          : "text-green-500";

  const searchBusinesses = async () => {
    setLoadingBiz(true);
    setBizError("");
    try {
      const mode = INDUSTRY_MODES[industryMode];
      const res = await fetch("/api/businesses/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: event.lat,
          lng: event.lng,
          radius: 25000,
          types: mode.types,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setBizError(data.error);
      } else {
        setBusinesses(data.businesses || []);
      }
    } catch {
      setBizError("Failed to search businesses");
    }
    setLoadingBiz(false);
  };

  const submitIntel = async () => {
    if (!intelForm.sourceName || !intelForm.callerName || !intelForm.notes) return;
    setIntelMsg("");
    try {
      // We use a temp eventId since we don't persist hail events to DB automatically
      const res = await fetch("/api/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...intelForm, eventId: "temp-event" }),
      });
      const data = await res.json();
      if (data.error) {
        setIntelMsg(data.error);
      } else {
        setIntelMsg("Intel logged!");
        setIntelLogs((prev) => [data.log, ...prev]);
        setIntelForm({ sourceName: "", sourcePhone: "", callerName: "", notes: "" });
      }
    } catch {
      setIntelMsg("Failed to log intel");
    }
  };

  const sendSMS = async () => {
    if (!outreachPhone) return;
    const template = OUTREACH_TEMPLATES[industryMode].sms;
    const message = template
      .replace(/{name}/g, "there")
      .replace(/{size}/g, String(event.hailSize))
      .replace(/{city}/g, event.city);

    setOutreachMsg("Sending SMS...");
    try {
      const res = await fetch("/api/outreach/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: outreachPhone, message, area: event.city }),
      });
      const data = await res.json();
      setOutreachMsg(data.error || "SMS sent!");
    } catch {
      setOutreachMsg("Failed to send SMS");
    }
  };

  const sendEmail = async () => {
    if (!outreachEmail) return;
    const tpl = OUTREACH_TEMPLATES[industryMode].email;
    const subject = tpl.subject
      .replace(/{city}/g, event.city)
      .replace(/{size}/g, String(event.hailSize));
    const body = tpl.body
      .replace(/{name}/g, "there")
      .replace(/{size}/g, String(event.hailSize))
      .replace(/{city}/g, event.city)
      .replace(/{state}/g, event.state);

    setOutreachMsg("Sending email...");
    try {
      const res = await fetch("/api/outreach/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: outreachEmail, subject, body, area: event.city }),
      });
      const data = await res.json();
      setOutreachMsg(data.error || "Email sent!");
    } catch {
      setOutreachMsg("Failed to send email");
    }
  };

  const launchAd = async () => {
    if (!adForm.headline || !adForm.body) return;
    setAdMsg("Creating campaign...");
    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "temp-event",
          city: event.city,
          headline: adForm.headline,
          adBody: adForm.body,
          lat: event.lat,
          lng: event.lng,
          radiusMiles: adForm.radiusMiles,
          dailyBudget: adForm.dailyBudget,
          industryMode,
          autoApproved: adForm.autoApproved,
        }),
      });
      const data = await res.json();
      setAdMsg(data.error || `Campaign created! Status: ${data.campaign?.status}`);
    } catch {
      setAdMsg("Failed to create campaign");
    }
  };

  const tabs: { key: PanelTab; label: string }[] = [
    { key: "info", label: "Event" },
    { key: "businesses", label: "Scout" },
    { key: "outreach", label: "Outreach" },
    { key: "intel", label: "Intel" },
    { key: "ads", label: "Ads" },
  ];

  return (
    <div className="fixed right-0 top-14 bottom-0 w-full md:w-[420px] bg-gray-900 border-l border-gray-700 overflow-y-auto z-[1000] shadow-2xl">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white truncate">
          {event.city || "Event Detail"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl px-2"
        >
          ×
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              if (t.key === "businesses" && businesses.length === 0 && !loadingBiz) {
                searchBusinesses();
              }
            }}
            className={`flex-1 py-2 text-xs font-medium ${
              tab === t.key
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* INFO TAB */}
        {tab === "info" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded p-3">
                <div className="text-xs text-gray-400">Hail Size</div>
                <div className="text-2xl font-bold text-white">
                  {event.hailSize}&quot;
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-xs text-gray-400">Damage</div>
                <div className={`text-2xl font-bold ${damageColor}`}>
                  {event.damage}
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-xs text-gray-400">Source</div>
                <div className="text-lg font-semibold text-white">
                  {event.source}
                </div>
              </div>
              <div className="bg-gray-800 rounded p-3">
                <div className="text-xs text-gray-400">Location</div>
                <div className="text-sm text-white">
                  {event.lat.toFixed(3)}, {event.lng.toFixed(3)}
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400">Area</div>
              <div className="text-sm text-white">
                {event.county}
                {event.state ? `, ${event.state}` : ""}
              </div>
            </div>
            {event.detail && (
              <div className="bg-gray-800 rounded p-3">
                <div className="text-xs text-gray-400">Details</div>
                <div className="text-sm text-gray-300">{event.detail}</div>
              </div>
            )}
          </div>
        )}

        {/* BUSINESSES TAB */}
        {tab === "businesses" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {INDUSTRY_MODES[industryMode].icon}{" "}
                {INDUSTRY_MODES[industryMode].label} mode
              </span>
              <button
                onClick={searchBusinesses}
                disabled={loadingBiz}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm disabled:opacity-50"
              >
                {loadingBiz ? "Searching..." : "Re-scan"}
              </button>
            </div>
            {bizError && (
              <div className="text-red-400 text-sm bg-red-900/30 rounded p-2">
                {bizError}
              </div>
            )}
            {businesses.length === 0 && !loadingBiz && !bizError && (
              <div className="text-gray-500 text-sm text-center py-4">
                Click Re-scan to find businesses near this event
              </div>
            )}
            {businesses.map((biz, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded p-3 space-y-1"
              >
                <div className="font-semibold text-white text-sm">
                  {biz.name}
                </div>
                <div className="text-xs text-gray-400">{biz.address}</div>
                <div className="flex gap-2 mt-2">
                  {biz.phone && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(biz.phone!);
                      }}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-gray-200 rounded"
                      title={biz.phone}
                    >
                      Copy Phone
                    </button>
                  )}
                  {biz.website && (
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-cyan-300 rounded"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* OUTREACH TAB */}
        {tab === "outreach" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Send SMS
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+1 555-123-4567"
                  value={outreachPhone}
                  onChange={(e) => setOutreachPhone(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={sendSMS}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
                >
                  Send
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Send Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="shop@example.com"
                  value={outreachEmail}
                  onChange={(e) => setOutreachEmail(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={sendEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                >
                  Send
                </button>
              </div>
            </div>
            {outreachMsg && (
              <div className="text-sm text-cyan-300 bg-gray-800 rounded p-2">
                {outreachMsg}
              </div>
            )}
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-2">
                Template Preview ({INDUSTRY_MODES[industryMode].label})
              </div>
              <div className="text-xs text-gray-300 whitespace-pre-wrap">
                {OUTREACH_TEMPLATES[industryMode].sms
                  .replace(/{name}/g, "[Name]")
                  .replace(/{size}/g, String(event.hailSize))
                  .replace(/{city}/g, event.city)}
              </div>
            </div>
          </div>
        )}

        {/* INTEL TAB */}
        {tab === "intel" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400 mb-1">
              Log ground intel from phone calls
            </div>
            <input
              placeholder="Source name (gas station, shop...)"
              value={intelForm.sourceName}
              onChange={(e) =>
                setIntelForm((f) => ({ ...f, sourceName: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
            />
            <input
              placeholder="Source phone (optional)"
              value={intelForm.sourcePhone}
              onChange={(e) =>
                setIntelForm((f) => ({ ...f, sourcePhone: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
            />
            <input
              placeholder="Your name"
              value={intelForm.callerName}
              onChange={(e) =>
                setIntelForm((f) => ({ ...f, callerName: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
            />
            <textarea
              placeholder="What did they say? Hail size, duration, damage..."
              value={intelForm.notes}
              onChange={(e) =>
                setIntelForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white resize-none"
            />
            <button
              onClick={submitIntel}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm"
            >
              Log Intel
            </button>
            {intelMsg && (
              <div className="text-sm text-cyan-300">{intelMsg}</div>
            )}
            {intelLogs.map((log) => (
              <div key={log.id} className="bg-gray-800 rounded p-3 text-sm">
                <div className="text-white font-medium">{log.sourceName}</div>
                <div className="text-gray-400 text-xs">
                  by {log.callerName} &middot;{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </div>
                <div className="text-gray-300 mt-1">{log.notes}</div>
              </div>
            ))}
          </div>
        )}

        {/* ADS TAB */}
        {tab === "ads" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">
              Launch Meta/Facebook ad campaign targeting this hail zone
            </div>
            <input
              placeholder="Ad headline"
              value={adForm.headline}
              onChange={(e) =>
                setAdForm((f) => ({ ...f, headline: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
            />
            <textarea
              placeholder="Ad body text"
              value={adForm.body}
              onChange={(e) =>
                setAdForm((f) => ({ ...f, body: e.target.value }))
              }
              rows={3}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Radius (mi)</label>
                <input
                  type="number"
                  value={adForm.radiusMiles}
                  onChange={(e) =>
                    setAdForm((f) => ({
                      ...f,
                      radiusMiles: parseInt(e.target.value) || 25,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">
                  Daily Budget ($)
                </label>
                <input
                  type="number"
                  value={adForm.dailyBudget}
                  onChange={(e) =>
                    setAdForm((f) => ({
                      ...f,
                      dailyBudget: parseInt(e.target.value) || 50,
                    }))
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={adForm.autoApproved}
                onChange={(e) =>
                  setAdForm((f) => ({ ...f, autoApproved: e.target.checked }))
                }
                className="rounded"
              />
              Auto-approve (launch immediately)
            </label>
            <button
              onClick={launchAd}
              className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-sm"
            >
              Launch Campaign
            </button>
            {adMsg && (
              <div className="text-sm text-cyan-300 bg-gray-800 rounded p-2">
                {adMsg}
              </div>
            )}
            <div className="bg-gray-800 rounded p-3">
              <div className="text-xs text-gray-400 mb-1">
                Targeting Preview
              </div>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(
                  {
                    geo_locations: {
                      custom_locations: [
                        {
                          latitude: event.lat.toFixed(4),
                          longitude: event.lng.toFixed(4),
                          radius: adForm.radiusMiles,
                          distance_unit: "mile",
                        },
                      ],
                    },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

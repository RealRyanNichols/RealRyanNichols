"use client";

import { useState, useEffect } from "react";

interface IntelEntry {
  id: string;
  sourceName: string;
  sourcePhone: string;
  callerName: string;
  notes: string;
  createdAt: string;
}

interface IntelLogProps {
  savedEventId: string | null;
}

export default function IntelLog({ savedEventId }: IntelLogProps) {
  const [logs, setLogs] = useState<IntelEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    sourceName: "",
    sourcePhone: "",
    callerName: "Jason",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (savedEventId) {
      fetch(`/api/intel?eventId=${savedEventId}`)
        .then((res) => res.json())
        .then((data) => setLogs(data.logs || []))
        .catch(console.error);
    }
  }, [savedEventId]);

  const submitLog = async () => {
    if (!savedEventId || !form.sourceName || !form.notes) return;
    setSaving(true);
    try {
      const res = await fetch("/api/intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: savedEventId,
          ...form,
        }),
      });
      const data = await res.json();
      if (data.log) {
        setLogs((prev) => [data.log, ...prev]);
        setForm({ sourceName: "", sourcePhone: "", callerName: "Jason", notes: "" });
        setShowForm(false);
      }
    } catch (err) {
      console.error("Save intel error:", err);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase">
            Ground Intel Call Log
          </h3>
          {savedEventId && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-medium rounded transition"
            >
              {showForm ? "Cancel" : "+ New Call"}
            </button>
          )}
        </div>

        {!savedEventId && (
          <p className="text-yellow-400 text-xs">
            Save the event first to add intel logs.
          </p>
        )}

        {/* New Call Form */}
        {showForm && savedEventId && (
          <div className="bg-gray-800 rounded p-3 mb-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-500 text-[10px]">Business/Source Name *</label>
                <input
                  type="text"
                  value={form.sourceName}
                  onChange={(e) =>
                    setForm({ ...form, sourceName: e.target.value })
                  }
                  placeholder="e.g., Casey's Gas Station"
                  className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-500 text-[10px]">Phone</label>
                <input
                  type="tel"
                  value={form.sourcePhone}
                  onChange={(e) =>
                    setForm({ ...form, sourcePhone: e.target.value })
                  }
                  placeholder="(555) 555-5555"
                  className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">Who Called</label>
              <input
                type="text"
                value={form.callerName}
                onChange={(e) =>
                  setForm({ ...form, callerName: e.target.value })
                }
                className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">Intel Notes *</label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                placeholder="Hail size, duration, visible damage, what people are saying..."
                rows={3}
                className="w-full bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>
            <button
              onClick={submitLog}
              disabled={saving || !form.sourceName || !form.notes}
              className="w-full py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-xs font-medium rounded transition"
            >
              {saving ? "Saving..." : "Log Intel"}
            </button>
          </div>
        )}

        {/* Log Entries */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {logs.length === 0 && savedEventId && (
            <p className="text-gray-600 text-xs text-center py-4">
              No intel logged yet. Call local businesses for ground truth.
            </p>
          )}
          {logs.map((log) => (
            <div key={log.id} className="bg-gray-800 rounded p-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white text-xs font-medium">
                    {log.sourceName}
                  </p>
                  {log.sourcePhone && (
                    <p className="text-gray-500 text-[10px]">
                      {log.sourcePhone}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[10px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-[10px]">
                    by {log.callerName}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-xs mt-1">{log.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

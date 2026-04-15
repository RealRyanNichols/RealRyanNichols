"use client";

import { useState } from "react";
import type { HailReport, IndustryMode } from "@/lib/types";
import { getIndustryMode, fillTemplate } from "@/lib/industry-modes";

interface OutreachPanelProps {
  event: HailReport;
  savedEventId: string | null;
  industryMode: IndustryMode;
}

export default function OutreachPanel({
  event,
  savedEventId,
  industryMode,
}: OutreachPanelProps) {
  const modeConfig = getIndustryMode(industryMode);
  const templateData = {
    city: event.city,
    state: event.state,
    county: event.county,
    size: String(event.size),
    damage: event.damage,
    date: new Date().toLocaleDateString(),
    ownerName: "there",
  };

  const [smsTo, setSmsTo] = useState("");
  const [smsMessage, setSmsMessage] = useState(
    fillTemplate(modeConfig.smsTemplate, templateData)
  );
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState(
    fillTemplate(modeConfig.emailSubject, templateData)
  );
  const [emailBody, setEmailBody] = useState(
    fillTemplate(modeConfig.emailTemplate, templateData)
  );

  const [sendingMethod, setSendingMethod] = useState<"sms" | "email">("sms");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const sendSMS = async () => {
    if (!smsTo || !smsMessage) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/outreach/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: smsTo.split(",").map((s: string) => s.trim()),
          message: smsMessage,
          eventId: savedEventId,
          area: `${event.city}, ${event.state}`,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}. ${data.message || ""}`);
      } else {
        setResult(`Sent: ${data.sent}, Failed: ${data.failed}`);
      }
    } catch (err) {
      setResult(`Send failed: ${err}`);
    }
    setSending(false);
  };

  const sendEmail = async () => {
    if (!emailTo || !emailBody) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/outreach/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo.split(",").map((s: string) => s.trim()),
          subject: emailSubject,
          html: emailBody.replace(/\n/g, "<br/>"),
          eventId: savedEventId,
          area: `${event.city}, ${event.state}`,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setResult(`Error: ${data.error}. ${data.message || ""}`);
      } else {
        setResult(`Email sent to ${data.sent} recipients`);
      }
    } catch (err) {
      setResult(`Send failed: ${err}`);
    }
    setSending(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-lg p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Automated Outreach — {modeConfig.label}
        </h3>

        {/* Method Toggle */}
        <div className="flex gap-1 bg-gray-800 rounded p-0.5 mb-3">
          <button
            onClick={() => setSendingMethod("sms")}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
              sendingMethod === "sms"
                ? "bg-cyan-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            SMS (Twilio)
          </button>
          <button
            onClick={() => setSendingMethod("email")}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
              sendingMethod === "email"
                ? "bg-cyan-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Email (SendGrid)
          </button>
        </div>

        {sendingMethod === "sms" ? (
          <div className="space-y-2">
            <div>
              <label className="text-gray-500 text-[10px]">
                To (comma-separated phone numbers)
              </label>
              <input
                type="text"
                value={smsTo}
                onChange={(e) => setSmsTo(e.target.value)}
                placeholder="+1555123456, +1555789012"
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">Message</label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                rows={5}
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none font-mono"
              />
              <p className="text-gray-600 text-[10px] mt-0.5">
                {smsMessage.length} chars | ~$0.012/msg | A2P 10DLC
              </p>
            </div>
            <button
              onClick={sendSMS}
              disabled={sending || !smsTo}
              className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-xs font-medium rounded transition"
            >
              {sending ? "Sending..." : "Send SMS"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <label className="text-gray-500 text-[10px]">
                To (comma-separated emails)
              </label>
              <input
                type="text"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="owner@bodyshop.com, manager@dealership.com"
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px]">Body</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={8}
                className="w-full bg-gray-800 text-white text-xs rounded px-2 py-1.5 border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none font-mono"
              />
            </div>
            <button
              onClick={sendEmail}
              disabled={sending || !emailTo}
              className="w-full py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-xs font-medium rounded transition"
            >
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        )}

        {result && (
          <div
            className={`mt-2 p-2 rounded text-xs ${
              result.startsWith("Error")
                ? "bg-red-900/30 text-red-400"
                : "bg-green-900/30 text-green-400"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState, type FormEvent } from "react";
import { eastTexasPredatorWatchCounties } from "@/data/predator-watch";

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "submitting"; message: string }
  | { status: "success"; message: string; trackingId?: string }
  | { status: "error"; message: string };

export default function PredatorWatchReportForm({
  defaultPersonName = "",
  profileSlug,
}: {
  defaultPersonName?: string;
  profileSlug?: string;
}) {
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });
  const disabled = state.status === "submitting";
  const countyOptions = useMemo(() => [...eastTexasPredatorWatchCounties], []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState({ status: "submitting", message: "Submitting report for private review." });

    const response = await fetch("/api/predator-watch/report", {
      method: "POST",
      body: formData,
    }).catch(() => null);

    if (!response) {
      setState({ status: "error", message: "The report could not be submitted. Check the connection and try again." });
      return;
    }

    const body = (await response.json().catch(() => null)) as { error?: string; trackingId?: string } | null;

    if (!response.ok) {
      setState({ status: "error", message: body?.error ?? "The report could not be submitted." });
      return;
    }

    form.reset();
    setState({
      status: "success",
      message: "Report received. It is private until an operator reviews, verifies, and redacts it.",
      trackingId: body?.trackingId,
    });
  }

  return (
    <form
      id="report"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-700 text-white">
          <span aria-hidden="true" className="text-base font-black">!</span>
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">Report behavior</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Send a private Predator Watch report</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            Reports are not public comments. They go into review for source checks, redaction, and lawful publishing decisions.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Person or profile name</span>
          <input
            name="personName"
            required
            maxLength={160}
            defaultValue={defaultPersonName}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
        {profileSlug ? <input type="hidden" name="profileSlug" value={profileSlug} /> : null}
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Report type</span>
          <select
            name="reportKind"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          >
            <option value="behavior_concern">Behavior concern</option>
            <option value="registry_update">Registry profile update</option>
            <option value="failure_to_register">Possible failure to register</option>
            <option value="possible_unregistered">Possible unregistered offender</option>
            <option value="victim_statement">Victim statement</option>
            <option value="source_correction">Source correction</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">County</span>
          <select
            name="county"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          >
            <option value="">Choose county</option>
            {countyOptions.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">City or area</span>
          <input
            name="city"
            required
            maxLength={120}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Date or time</span>
          <input
            name="incidentAt"
            type="datetime-local"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Police contacted?</span>
          <select
            name="policeContacted"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          >
            <option value="unknown">Unknown / not sure</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase tracking-wide text-slate-700">What happened</span>
        <textarea
          name="summary"
          required
          minLength={40}
          maxLength={4000}
          rows={6}
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none ring-red-200 focus:ring-4"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-black uppercase tracking-wide text-slate-700">Evidence links</span>
        <textarea
          name="evidenceLinks"
          rows={3}
          maxLength={2000}
          placeholder="One public link per line"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold leading-6 text-slate-950 outline-none ring-red-200 focus:ring-4"
        />
      </label>

      <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4">
        <span>
          <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-700">
            <span aria-hidden="true" className="text-xs leading-none">FILE</span>
            Evidence uploads
          </span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">
            Up to 5 files, 15MB each. Private review bucket only.
          </span>
        </span>
        <input name="evidenceFiles" type="file" multiple className="max-w-48 text-xs font-semibold text-slate-600" />
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Your name</span>
          <input
            name="submitterName"
            maxLength={160}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Email</span>
          <input
            name="submitterEmail"
            type="email"
            maxLength={200}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-700">Phone</span>
          <input
            name="submitterPhone"
            maxLength={80}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-950 outline-none ring-red-200 focus:ring-4"
          />
        </label>
      </div>

      <div className="mt-4 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <label className="flex gap-3 text-sm font-bold leading-6 text-amber-950">
          <input name="emergencyAcknowledged" type="checkbox" required className="mt-1 h-4 w-4 shrink-0" />
          <span>This is not emergency services. If someone is in immediate danger, call 911 or local law enforcement first.</span>
        </label>
        <label className="flex gap-3 text-sm font-bold leading-6 text-amber-950">
          <input name="consentAcknowledged" type="checkbox" required className="mt-1 h-4 w-4 shrink-0" />
          <span>I understand this report may be reviewed, source-checked, redacted, and kept private unless approved for lawful publication.</span>
        </label>
      </div>

      {state.message ? (
        <div
          className={`mt-4 rounded-xl border px-3 py-3 text-sm font-black ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : state.status === "error"
                ? "border-red-200 bg-red-50 text-red-950"
                : "border-blue-200 bg-blue-50 text-blue-950"
          }`}
          role="status"
        >
          <div className="flex items-start gap-2">
            {state.status === "error" ? (
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-base leading-none">!</span>
            ) : null}
            <span>
              {state.message}
              {state.status === "success" && state.trackingId ? ` Tracking ID: ${state.trackingId}.` : ""}
            </span>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={disabled}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto"
      >
        <span aria-hidden="true" className="text-base leading-none">-&gt;</span>
        {disabled ? "Submitting" : "Submit private report"}
      </button>
    </form>
  );
}

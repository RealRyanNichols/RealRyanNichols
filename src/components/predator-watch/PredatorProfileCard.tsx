import Link from "next/link";
import type { PredatorProfile } from "@/types/predator-watch";

function riskLabel(riskLevel: PredatorProfile["riskLevel"]) {
  switch (riskLevel) {
    case "low":
      return "Level one";
    case "moderate":
      return "Level two";
    case "high":
      return "Level three";
    case "civil_commitment":
      return "Civil commitment";
    case "not_reported":
      return "Risk not reported";
  }
}

function statusLabel(status: PredatorProfile["registryStatus"]) {
  return status.replaceAll("_", " ");
}

export default function PredatorProfileCard({ profile, rank }: { profile: PredatorProfile; rank?: number }) {
  const alertTone = profile.isWanted || profile.failureToRegister || profile.riskLevel === "high" || profile.civilCommitment;

  return (
    <Link
      href={`/east-texas-predator-watch/${profile.slug}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-2xl"
    >
      <div className="relative aspect-[4/3] bg-slate-950">
        {profile.photoUrl ? (
          <span
            aria-label={`Official registry photo for ${profile.fullName}`}
            role="img"
            className="block h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${JSON.stringify(profile.photoUrl)})` }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_10%,#334155,#0f172a_48%,#450a0a)]">
            <span aria-hidden="true" className="text-5xl font-black text-red-200">!</span>
          </div>
        )}
        {rank ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-700 px-3 py-1 text-xs font-black text-white shadow">
            TOP {rank}
          </span>
        ) : null}
        {alertTone ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/90 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-red-100">
            <span aria-hidden="true" className="text-xs leading-none">!</span>
            Watch priority
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-800">
            {riskLabel(profile.riskLevel)}
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-blue-900">
            {statusLabel(profile.registryStatus)}
          </span>
        </div>
        <h3 className="mt-2 break-words text-xl font-black leading-tight text-slate-950 group-hover:text-red-800">
          {profile.fullName}
        </h3>
        <p className="mt-2 flex items-center gap-1 text-xs font-black uppercase tracking-wide text-slate-500">
          <span aria-hidden="true" className="text-xs leading-none">PIN</span>
          {profile.city}, {profile.county} County
        </p>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-slate-700">
          {profile.offense}
        </p>
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Priority basis</p>
          <p className="mt-1 line-clamp-3 text-xs font-semibold leading-5 text-slate-700">
            {profile.priorityReason}
          </p>
        </div>
        <p className="mt-auto flex items-center gap-1 pt-4 text-xs font-black uppercase tracking-wide text-blue-700">
          <span aria-hidden="true" className="text-xs leading-none">OK</span>
          Verified {profile.lastVerifiedAt}
        </p>
      </div>
    </Link>
  );
}

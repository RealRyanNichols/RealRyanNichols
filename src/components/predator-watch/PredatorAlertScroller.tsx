import Link from "next/link";
import type { PredatorProfile } from "@/types/predator-watch";

function alertItemsFor(profiles: PredatorProfile[]) {
  const profileItems = profiles.flatMap((profile) => {
    const items: string[] = [];
    if (profile.isWanted) items.push(`${profile.fullName}: official wanted record requires public attention`);
    if (profile.failureToRegister) items.push(`${profile.fullName}: failure-to-register flag is source-backed`);
    if (profile.recentAddressChange) items.push(`${profile.fullName}: recent address change needs a fresh source check`);
    if (profile.riskLevel === "high") items.push(`${profile.fullName}: DPS high-risk level`);
    if (profile.civilCommitment) items.push(`${profile.fullName}: civil commitment record`);
    return items;
  });

  return profileItems.length
    ? profileItems
    : [
        "Official-record import lane is ready for Texas DPS, NSOPW, court, sheriff, and police sources",
        "Private reports are review-only until source checked and redacted",
        "Use official registry links for current address verification before acting on stale information",
      ];
}

export default function PredatorAlertScroller({ profiles }: { profiles: PredatorProfile[] }) {
  const items = alertItemsFor(profiles);
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-red-200 bg-red-950 text-white">
      <style>{`
        @keyframes predator-watch-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .predator-watch-scroll-track {
          animation: predator-watch-scroll 36s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .predator-watch-scroll-track { animation: none; }
        }
      `}</style>
      <div className="flex min-h-12 items-center">
        <div className="flex shrink-0 items-center gap-2 bg-red-700 px-4 py-3 text-xs font-black uppercase tracking-[0.18em]">
          <span aria-hidden="true" className="text-sm leading-none">!</span>
          Watch alerts
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="predator-watch-scroll-track flex w-max items-center gap-6 whitespace-nowrap px-4 text-sm font-black">
            {repeated.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-6">
                <span>{item}</span>
                <span className="text-red-300">/</span>
              </span>
            ))}
            <Link href="#report" className="text-red-100 underline decoration-red-300 underline-offset-4">
              Submit a private report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

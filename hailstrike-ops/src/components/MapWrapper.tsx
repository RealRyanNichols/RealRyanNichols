"use client";

import dynamic from "next/dynamic";
import type { HailReport } from "@/lib/types";

const StormMap = dynamic(() => import("./StormMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading Storm Map...</p>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  onEventClick: (report: HailReport) => void;
  selectedEvent: HailReport | null;
  radarEnabled: boolean;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <StormMap {...props} />;
}

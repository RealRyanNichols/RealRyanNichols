"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { HailReport } from "@/lib/types";

// Fix default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface StormMapProps {
  onEventClick: (report: HailReport) => void;
  selectedEvent: HailReport | null;
  radarEnabled: boolean;
}

function FlyToHandler({ target }: { target: { lat: number; lon: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lon], 10, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
}

function getSeverityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "extreme":
      return "#ef4444";
    case "severe":
      return "#f97316";
    case "moderate":
      return "#eab308";
    default:
      return "#22c55e";
  }
}

function getReportColor(size: number): string {
  if (size >= 2.0) return "#ef4444";
  if (size >= 1.0) return "#f97316";
  return "#22c55e";
}

function getReportRadius(size: number): number {
  return Math.max(4, Math.min(size * 6, 20));
}

function getDamageLevel(size: number): string {
  if (size >= 2.75) return "Catastrophic";
  if (size >= 2.0) return "Severe";
  if (size >= 1.0) return "Moderate";
  return "Low";
}

export default function StormMap({
  onEventClick,
  selectedEvent,
  radarEnabled,
}: StormMapProps) {
  const [nwsAlerts, setNwsAlerts] = useState<GeoJSON.FeatureCollection | null>(null);
  const [spcReports, setSpcReports] = useState<HailReport[]>([]);
  const [iemReports, setIemReports] = useState<GeoJSON.FeatureCollection | null>(null);
  const geoJsonKeyRef = useRef(0);

  const fetchNWSAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/alerts");
      const data = await res.json();
      if (data.features) {
        setNwsAlerts(data);
        geoJsonKeyRef.current += 1;
      }
    } catch (err) {
      console.error("NWS fetch error:", err);
    }
  }, []);

  const fetchSPCReports = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/reports");
      const data = await res.json();
      if (data.reports) {
        setSpcReports(
          data.reports.map(
            (
              r: {
                lat: number;
                lon: number;
                size: number;
                location: string;
                county: string;
                state: string;
                time: string;
                comments: string;
              },
              i: number
            ) => ({
              id: `spc-${i}`,
              lat: r.lat,
              lon: r.lon,
              size: r.size,
              city: r.location,
              county: r.county,
              state: r.state,
              time: r.time,
              comments: r.comments,
              source: "spc" as const,
              damage: getDamageLevel(r.size),
              verified: true,
            })
          )
        );
      }
    } catch (err) {
      console.error("SPC fetch error:", err);
    }
  }, []);

  const fetchIEMReports = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/lsr");
      const data = await res.json();
      if (data.features) {
        setIemReports(data);
      }
    } catch (err) {
      console.error("IEM fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNWSAlerts();
    fetchSPCReports();
    fetchIEMReports();

    const nwsInterval = setInterval(fetchNWSAlerts, 30000);
    const spcInterval = setInterval(fetchSPCReports, 300000);
    const iemInterval = setInterval(fetchIEMReports, 300000);

    return () => {
      clearInterval(nwsInterval);
      clearInterval(spcInterval);
      clearInterval(iemInterval);
    };
  }, [fetchNWSAlerts, fetchSPCReports, fetchIEMReports]);

  const handleSPCClick = (report: HailReport) => {
    onEventClick(report);
  };

  const handleNWSClick = (feature: GeoJSON.Feature) => {
    const props = feature.properties || {};
    const params = props.parameters || {};
    const hailSize = params.maxHailSize?.[0]
      ? parseFloat(params.maxHailSize[0])
      : 0;
    const geometry = feature.geometry;
    let lat = 0,
      lon = 0;

    if (geometry && geometry.type === "Polygon") {
      const coords = (geometry as GeoJSON.Polygon).coordinates[0];
      lat = coords.reduce((sum: number, c: number[]) => sum + c[1], 0) / coords.length;
      lon = coords.reduce((sum: number, c: number[]) => sum + c[0], 0) / coords.length;
    }

    const report: HailReport = {
      id: props.id || `nws-${Date.now()}`,
      lat,
      lon,
      size: hailSize,
      city: props.areaDesc?.split(";")[0] || "Unknown",
      county: props.areaDesc?.split(";")[0] || "Unknown",
      state: "",
      time: props.effective || "",
      comments: props.headline || "",
      source: "nws",
      damage: getDamageLevel(hailSize),
      verified: params.hailThreat?.[0] === "OBSERVED",
      nwsAlertId: props.id,
      geometry,
      windSpeed: params.maxWindGust?.[0]
        ? parseFloat(params.maxWindGust[0])
        : undefined,
      hailThreat: params.hailThreat?.[0],
    };

    onEventClick(report);
  };

  const handleIEMClick = (feature: GeoJSON.Feature) => {
    const props = feature.properties || {};
    const coords = (feature.geometry as GeoJSON.Point)?.coordinates;
    if (!coords) return;

    const magnitude = parseFloat(props.magnitude || "0");

    const report: HailReport = {
      id: `iem-${props.valid || Date.now()}`,
      lat: coords[1],
      lon: coords[0],
      size: magnitude,
      city: props.city || "Unknown",
      county: props.county || "Unknown",
      state: props.state || "",
      time: props.valid || "",
      comments: props.remark || "",
      source: "iem",
      damage: getDamageLevel(magnitude),
      verified: true,
    };

    onEventClick(report);
  };

  return (
    <MapContainer
      center={[39.8, -98.5]}
      zoom={4}
      className="h-full w-full"
      zoomControl={true}
      style={{ background: "#1a1a2e" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={20}
      />

      {radarEnabled && (
        <WMSTileLayer
          url="https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi"
          layers="nexrad-n0q-900913"
          format="image/png"
          transparent={true}
          opacity={0.5}
        />
      )}

      {/* NWS Alert Polygons */}
      {nwsAlerts && nwsAlerts.features && (
        <GeoJSON
          key={`nws-${geoJsonKeyRef.current}`}
          data={nwsAlerts}
          style={(feature) => {
            const severity =
              feature?.properties?.severity || "Unknown";
            return {
              color: getSeverityColor(severity),
              weight: 2,
              fillOpacity: 0.15,
              dashArray:
                feature?.properties?.parameters?.hailThreat?.[0] ===
                "RADAR INDICATED"
                  ? "8 4"
                  : undefined,
            };
          }}
          onEachFeature={(feature, layer) => {
            const props = feature.properties || {};
            const params = props.parameters || {};
            layer.bindPopup(
              `<div style="color:#000">
                <strong>${props.event || "Alert"}</strong><br/>
                ${props.headline || ""}<br/>
                <em>Hail: ${params.maxHailSize?.[0] || "N/A"}"</em><br/>
                <em>Threat: ${params.hailThreat?.[0] || "N/A"}</em><br/>
                <small>${props.areaDesc || ""}</small>
              </div>`
            );
            layer.on("click", () => handleNWSClick(feature));
          }}
        />
      )}

      {/* SPC Hail Reports */}
      {spcReports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[report.lat, report.lon]}
          radius={getReportRadius(report.size)}
          pathOptions={{
            color: getReportColor(report.size),
            fillColor: getReportColor(report.size),
            fillOpacity: 0.6,
            weight: 2,
          }}
          eventHandlers={{
            click: () => handleSPCClick(report),
          }}
        >
          <Popup>
            <div style={{ color: "#000" }}>
              <strong>{report.size}&quot; Hail</strong>
              <br />
              {report.city}, {report.state}
              <br />
              <em>{report.county} County</em>
              <br />
              <small>
                Time: {report.time} | {report.comments}
              </small>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* IEM Local Storm Reports */}
      {iemReports &&
        iemReports.features?.map((feature, i) => {
          const coords = (feature.geometry as GeoJSON.Point)
            ?.coordinates;
          if (!coords) return null;
          const props = feature.properties || {};
          const magnitude = parseFloat(props.magnitude || "0");

          return (
            <CircleMarker
              key={`iem-${i}`}
              center={[coords[1], coords[0]]}
              radius={getReportRadius(magnitude)}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.5,
                weight: 2,
              }}
              eventHandlers={{
                click: () => handleIEMClick(feature),
              }}
            >
              <Popup>
                <div style={{ color: "#000" }}>
                  <strong>{magnitude}&quot; Hail (IEM)</strong>
                  <br />
                  {props.city}, {props.state}
                  <br />
                  <small>{props.remark || ""}</small>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

      <FlyToHandler
        target={selectedEvent ? { lat: selectedEvent.lat, lon: selectedEvent.lon } : null}
      />
    </MapContainer>
  );
}

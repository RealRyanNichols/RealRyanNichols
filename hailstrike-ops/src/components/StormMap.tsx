"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  CircleMarker,
  GeoJSON,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { SPCReport, NWSAlert } from "@/lib/types";

interface StormMapProps {
  onEventClick: (event: {
    lat: number;
    lng: number;
    city: string;
    county: string;
    state: string;
    hailSize: number;
    source: string;
    damage: string;
    detail?: string;
  }) => void;
  showRadar: boolean;
}

function FlyToHandler({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 10, { duration: 1.5 });
    }
  }, [map, target]);
  return null;
}

function getAlertColor(severity: string): string {
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

function getDamageLevel(size: number): string {
  if (size >= 2.75) return "Catastrophic";
  if (size >= 2.0) return "Severe";
  if (size >= 1.0) return "Moderate";
  return "Low";
}

export default function StormMap({ onEventClick, showRadar }: StormMapProps) {
  const [alerts, setAlerts] = useState<NWSAlert[]>([]);
  const [reports, setReports] = useState<SPCReport[]>([]);
  const [lsrData, setLsrData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const geoJsonKeyRef = useRef(0);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/alerts");
      const data = await res.json();
      if (data.features) {
        setAlerts(data.features);
        geoJsonKeyRef.current += 1;
      }
    } catch (e) {
      console.error("Failed to fetch alerts:", e);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/reports");
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error("Failed to fetch reports:", e);
    }
  }, []);

  const fetchLSR = useCallback(async () => {
    try {
      const res = await fetch("/api/weather/lsr");
      const data = await res.json();
      if (data.features) {
        setLsrData(data as GeoJSON.FeatureCollection);
      }
    } catch (e) {
      console.error("Failed to fetch LSR:", e);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchReports();
    fetchLSR();

    const alertInterval = setInterval(fetchAlerts, 30000);
    const reportInterval = setInterval(fetchReports, 300000);
    const lsrInterval = setInterval(fetchLSR, 300000);

    return () => {
      clearInterval(alertInterval);
      clearInterval(reportInterval);
      clearInterval(lsrInterval);
    };
  }, [fetchAlerts, fetchReports, fetchLSR]);

  const alertGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: alerts
      .filter((a) => a.geometry)
      .map((a) => ({
        type: "Feature" as const,
        geometry: a.geometry as GeoJSON.Geometry,
        properties: a.properties,
      })),
  };

  const handleAlertClick = (feature: GeoJSON.Feature) => {
    const props = feature.properties as NWSAlert["properties"];
    const hailSize = parseFloat(props?.parameters?.maxHailSize?.[0] || "0");
    const coords = (feature.geometry as GeoJSON.Polygon)?.coordinates?.[0];
    if (!coords || coords.length === 0) return;

    // Calculate centroid
    let latSum = 0,
      lngSum = 0;
    coords.forEach((c: number[]) => {
      lngSum += c[0];
      latSum += c[1];
    });
    const lat = latSum / coords.length;
    const lng = lngSum / coords.length;

    setFlyTarget({ lat, lng });
    onEventClick({
      lat,
      lng,
      city: props?.areaDesc?.split(";")[0] || "Unknown",
      county: props?.areaDesc || "",
      state: "",
      hailSize: hailSize || 1.0,
      source: "NWS",
      damage: getDamageLevel(hailSize),
      detail: props?.headline || "",
    });
  };

  const handleReportClick = (report: SPCReport) => {
    setFlyTarget({ lat: report.lat, lng: report.lon });
    onEventClick({
      lat: report.lat,
      lng: report.lon,
      city: report.location,
      county: report.county,
      state: report.state,
      hailSize: report.size,
      source: "SPC",
      damage: getDamageLevel(report.size),
      detail: report.comments,
    });
  };

  return (
    <MapContainer
      center={[39.8, -98.5]}
      zoom={4}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {showRadar && (
        <WMSTileLayer
          url="https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi"
          layers="nexrad-n0q-900913"
          format="image/png"
          transparent={true}
          opacity={0.5}
        />
      )}

      {alertGeoJSON.features.length > 0 && (
        <GeoJSON
          key={`alerts-${geoJsonKeyRef.current}`}
          data={alertGeoJSON}
          style={(feature) => ({
            color: getAlertColor(
              (feature?.properties as NWSAlert["properties"])?.severity || ""
            ),
            weight: 2,
            fillOpacity: 0.2,
          })}
          onEachFeature={(feature, layer) => {
            layer.on("click", () => handleAlertClick(feature));
            const props = feature.properties as NWSAlert["properties"];
            const hailSize = props?.parameters?.maxHailSize?.[0];
            const threat = props?.parameters?.hailThreat?.[0] || "Unknown";
            layer.bindPopup(
              `<div class="text-sm">
                <strong>${props?.event || "Alert"}</strong><br/>
                ${props?.areaDesc || ""}<br/>
                Hail: ${hailSize ? hailSize + '"' : "N/A"}<br/>
                Threat: ${threat}<br/>
                <em>${props?.headline || ""}</em>
              </div>`
            );
          }}
        />
      )}

      {lsrData && lsrData.features.length > 0 && (
        <GeoJSON
          key={`lsr-${geoJsonKeyRef.current}`}
          data={lsrData}
          pointToLayer={(_feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 6,
              fillColor: "#8b5cf6",
              color: "#8b5cf6",
              weight: 1,
              fillOpacity: 0.7,
            })
          }
          onEachFeature={(feature, layer) => {
            const p = feature.properties as Record<string, string>;
            layer.bindPopup(
              `<div class="text-sm">
                <strong>LSR: ${p?.typetext || "Hail"}</strong><br/>
                ${p?.city || ""}, ${p?.state || ""}<br/>
                Magnitude: ${p?.magnitude || "N/A"}<br/>
                ${p?.remark || ""}
              </div>`
            );
          }}
        />
      )}

      {reports.map((report, i) => (
        <CircleMarker
          key={`spc-${i}`}
          center={[report.lat, report.lon]}
          radius={Math.max(4, report.size * 4)}
          pathOptions={{
            color: getReportColor(report.size),
            fillColor: getReportColor(report.size),
            fillOpacity: 0.7,
            weight: 2,
          }}
          eventHandlers={{ click: () => handleReportClick(report) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>SPC Hail Report</strong>
              <br />
              {report.location}, {report.state}
              <br />
              Size: {report.size}&quot; | {report.time}
              <br />
              County: {report.county}
              <br />
              {report.comments && <em>{report.comments}</em>}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      <FlyToHandler target={flyTarget} />
    </MapContainer>
  );
}

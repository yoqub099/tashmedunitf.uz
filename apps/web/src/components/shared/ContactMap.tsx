"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

// Dynamically import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
}

interface ContactMapProps {
  locations: MapLocation[];
  center?: [number, number];
  zoom?: number;
}

export default function ContactMap({ locations, center, zoom = 13 }: ContactMapProps) {
  const { language } = useLanguageStore();
  const [isClient, setIsClient] = useState(false);
  const [icon, setIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Import leaflet CSS and create icon
    import("leaflet").then((L) => {
      // Fix default marker icon issue
      const DefaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setIcon(DefaultIcon);
    });
  }, []);

  if (!isClient || !icon) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gray-100">
        <div className="text-gray-400">{s("common.map_loading", language)}</div>
      </div>
    );
  }

  const mapCenter = center || [locations[0]?.lat || 37.2242, locations[0]?.lng || 67.2783];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <MapContainer
        center={mapCenter as [number, number]}
        zoom={zoom}
        scrollWheelZoom={false}
        attributionControl={false}
        className="size-full rounded-3xl"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]} icon={icon}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}

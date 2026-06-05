"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Hide Leaflet attribution
const hideAttributionCSS = `
  .leaflet-control-attribution { display: none !important; }
`;

// Custom marker icon
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
}

export default function LeafletMap({ lat, lng, zoom = 15, popupText }: LeafletMapProps) {
  return (
    <>
      <style>{hideAttributionCSS}</style>
      <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      attributionControl={false}
      className="size-full rounded-3xl"
      style={{ minHeight: "100%" }}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={markerIcon}>
        {popupText && <Popup>{popupText}</Popup>}
      </Marker>
    </MapContainer>
    </>
  );
}

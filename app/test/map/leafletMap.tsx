"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// FIX: Use require to get actual asset URL
const markerIcon = require("leaflet/dist/images/marker-icon.png");
const markerIcon2x = require("leaflet/dist/images/marker-icon-2x.png");
const markerShadow = require("leaflet/dist/images/marker-shadow.png");

const customMarker = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setCoords }: any) {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LeafletMap({ coords, setCoords, points, onPointClick }: any) {
  return (
    <MapContainer
      center={[-6.2088, 106.8456]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setCoords={setCoords} />
      {coords && <Marker position={coords} icon={customMarker} />}
      {points &&
        points.map((point: any, index: number) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={customMarker}
            eventHandlers={{
              click: () => {
                if (onPointClick) onPointClick(index);
              },
            }}
          />
        ))}
    </MapContainer>
  );
}

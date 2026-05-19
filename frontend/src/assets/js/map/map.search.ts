import L from "leaflet";
import { getMap } from "./map.state";

let searchMarker: L.Marker | null = null;

export async function searchPlaces(query: string) {
  const url =
    `https://nominatim.openstreetmap.org/search?` +
    `q=${encodeURIComponent(query)}&format=json&limit=5`;

  const res = await fetch(url);
  return res.json();
}

export function showPlace(place: any) {
  const m = getMap();

  if (!m) return;

  const lat = parseFloat(place.lat);
  const lon = parseFloat(place.lon);

  if (searchMarker) m.removeLayer(searchMarker);

  searchMarker = L.marker([lat, lon])
    .addTo(m)
    .bindPopup(place.display_name)
    .openPopup();

  m.flyTo([lat, lon], 16);
}

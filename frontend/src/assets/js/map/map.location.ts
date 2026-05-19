import L from "leaflet";
import {
  getMap,
  userMarker,
  radiusCircle,
  setUserLat,
  setUserLon,
} from "./map.state";

export function getLocation(): void {
  const m = getMap();

  if (!navigator.geolocation || !m) return;

  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    setUserLat(lat);
    setUserLon(lon);

    if (userMarker) m.removeLayer(userMarker);
    if (radiusCircle) m.removeLayer(radiusCircle);

    const marker = L.marker([lat, lon])
      .addTo(m)
      .bindPopup("📍 Vị trí của bạn")
      .openPopup();

    (window as any).__userMarker = marker;

    m.setView([lat, lon], 15);
  });
}

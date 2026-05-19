import L from "leaflet";
import { stations, stationMarkers, getMap, setStations } from "./map.state";

const COLORS = ["#22c55e", "#a78bfa", "#f59e0b", "#ec4899"];

export function renderStations(): void {
  const m = getMap();

  if (!m) return;

  stationMarkers.forEach((mk) => m.removeLayer(mk));
  stationMarkers.length = 0;

  stations.forEach((s, i) => {
    const lat = s.latitude;
    const lon = s.longitude;

    if (!lat || !lon) return;

    const marker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: "",
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${COLORS[i % COLORS.length]}"></div>`,
      }),
    }).addTo(m);

    stationMarkers.push(marker);
  });
}

export function buildVehicleSelector(): void {
  const container = document.getElementById("vehicleSelector");
  if (!container) return;

  container.innerHTML = `
    <button class="vehicle-btn active">🚗 Xe hơi</button>
    <button class="vehicle-btn">🏍️ Xe máy</button>
    <button class="vehicle-btn">🚲 Xe đạp</button>
    <button class="vehicle-btn">🚶 Đi bộ</button>
  `;
}

export async function loadSampleData(): Promise<void> {
  const res = await fetch("/api/stations/");
  const data = await res.json();

  setStations(
    data.stations.map((s: any) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      charger_type: s.charger_type,
      power: s.power,
      total_ports: s.total_ports,
      available_ports: s.available_ports,
      status: s.status,
      image: s.image,
    })),
  );
}

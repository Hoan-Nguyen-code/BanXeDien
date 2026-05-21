import L from "leaflet";
import { setMap } from "./map.state";
import { buildVehicleSelector } from "./map.station";

let mapInstance: L.Map | null = null;

export function initMap(mapEl: HTMLDivElement | null): L.Map | null {
  if (!mapEl) return null;

  // Nếu map đã tồn tại
  if (mapInstance) {
    return mapInstance;
  }

  // INIT MAP
  mapInstance = L.map(mapEl, {
    zoomControl: true,
  }).setView([10.95, 106.82], 13);

  // TILE
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution: "&copy; OpenStreetMap & CARTO",
      maxZoom: 20,
    },
  ).addTo(mapInstance);

  // FIX WHITE MAP
  setTimeout(() => {
    mapInstance?.invalidateSize();
  }, 200);

  // GLOBAL STATE
  setMap(mapInstance);

  // BUILD UI
  buildVehicleSelector();

  return mapInstance;
}

export function destroyMap() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
}

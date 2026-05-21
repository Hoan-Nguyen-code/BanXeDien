import {
  getMap,
  userLat,
  userLon,
  routeLayers,
  stations,
  selectedStation,
} from "./map.state";

export async function findRoutes() {
  const m = getMap(); // ✅ an toàn 100%

  if (userLat == null || userLon == null) return;

  const target =
    selectedStation ??
    [...stations].sort(
      (a, b) =>
        (a.latitude - userLat!) ** 2 +
        (a.longitude - userLon!) ** 2 -
        ((b.latitude - userLat!) ** 2 + (b.longitude - userLon!) ** 2),
    )[0];

  if (!target) return;

  routeLayers.forEach((l) => m.removeLayer(l));
}

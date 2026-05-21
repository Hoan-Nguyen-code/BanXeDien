import * as L from "leaflet";

export type Station = {
  id?: number;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  charger_type?: string;
  power?: string;
  total_ports?: number;
  available_ports?: number;
  status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  image?: string;
};

export let userLat: number | null = null;
export let userLon: number | null = null;

export let stations: Station[] = [];
export let selectedStation: Station | null = null;

export let map: L.Map | null = null;

export let userMarker: L.Marker | null = null;
export let radiusCircle: L.Circle | null = null;

export let stationMarkers: L.Marker[] = [];
export let routeLayers: L.Polyline[] = [];

export let selectedProfile: "driving-car" | "cycling-regular" | "foot-walking" =
  "driving-car";

// ==============================
// SETTERS (SAFE MUTATION)
// ==============================

export const setMap = (m: L.Map) => {
  map = m;
};

export const setUserLat = (v: number | null) => {
  userLat = v;
};

export const setUserLon = (v: number | null) => {
  userLon = v;
};

export const setStations = (data: Station[]) => {
  stations = data;
};

export const setSelectedStation = (s: Station | null) => {
  selectedStation = s;
};

export const setUserMarker = (m: L.Marker | null) => {
  userMarker = m;
};

export const setRadiusCircle = (c: L.Circle | null) => {
  radiusCircle = c;
};

export const getMap = (): L.Map => {
  if (!map) {
    throw new Error("Map is not initialized yet");
  }
  return map;
};

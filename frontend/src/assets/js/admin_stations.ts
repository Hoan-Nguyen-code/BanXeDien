export interface ChargingStation {
  id: number;
  name: string;
  address: string;
  charger_type: string;
  power_capacity: string;
  total_ports: number;
  available_ports: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
}

export interface StationStats {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
}

export interface AdminStationApiResponse {
  stations: ChargingStation[];
  stats: StationStats;
  pagination: {
    count: number;
    total_pages: number;
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

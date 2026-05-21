// src/assets/js/admin_kho.ts

export interface ProductInventoryItem {
  id: number;

  name: string;

  description: string;

  price: number;

  image: string;

  is_active: boolean;

  category: {
    id: number;
    name: string;
  };

  inventory?: {
    stock_quantity: number;
  };

  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

  created_at: string;
}

export interface InventoryDashboardStats {
  total_products: number;

  in_stock: number;

  low_stock: number;

  out_of_stock: number;
}

export interface DjangoPagination {
  count: number;

  total_pages: number;

  current_page: number;

  has_next: boolean;

  has_previous: boolean;
}

export interface AdminKhoApiResponse {
  results: ProductInventoryItem[];

  stats: InventoryDashboardStats;

  pagination: DjangoPagination;
}

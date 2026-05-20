// src/assets/js/admin_kho.ts

export interface ProductInventoryItem {
  id: number;
  name: string;
  code: string; // Mã định danh sản phẩm (Mã SKU)
  category: {
    id: number;
    name: string;
  };
  price: number;
  inventory?: {
    stock_quantity: number;
  };
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"; // Tình trạng tính toán dựa trên số lượng (>5, <=5, ==0)
  is_active: boolean; // Trạng thái kích hoạt sản phẩm
}

export interface InventoryDashboardStats {
  total_products: number; // products_list.count()
  in_stock: number; // Số lượng tồn kho > 5
  low_stock: number; // Số lượng tồn kho từ 1 đến 5
  out_of_stock: number; // Số lượng bằng 0 hoặc không có record inventory
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
  all_products_lookup: { id: number; name: string }[]; // Phục vụ danh sách xổ xuống trong Modal
  stats: InventoryDashboardStats;
  pagination: DjangoPagination;
}

// src/assets/js/admin_tai_chinh.ts

export interface FinanceStats {
  revenue_month: string; // Chuỗi đã format dạng "1.000.000 VNĐ" từ Django
  expense_month: string;
  profit_month: string;
  revenue_today: string;
}

export interface TopProductItem {
  name: string;
  sold: number;
  revenue: string; // Chuỗi đã format từ Django
}

export interface RevenueChartData {
  labels: string[]; // ['T1', 'T2', ..., 'T12']
  revenue: number[]; // Mảng dữ liệu doanh thu (đơn vị tỷ)
  expense: number[]; // Mảng dữ liệu chi phí (đơn vị tỷ)
  profit: number[]; // Mảng dữ liệu lợi nhuận (đơn vị tỷ)
}

export interface FilterOption {
  value: number;
}

export interface AdminTaiChinhApiResponse {
  stats: FinanceStats;
  revenue_data: RevenueChartData; // Nhận object JSON từ backend parsed sẵn
  top_products: TopProductItem[];
  selected_month: number;
  selected_year: number;
  months: FilterOption[];
  years: number[];
}

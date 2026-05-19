// src/assets/js/admin_user.ts

/**
 * Interface đại diện cho thông tin chi tiết của một người dùng (User)
 */
export interface UserItem {
  id: number;
  username: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  role: "ADMIN" | "CUSTOMER"; // Khớp chuẩn phân quyền hệ thống
  is_active: boolean; // Trạng thái hoạt động hoặc bị khóa
  date_joined: string; // Chuỗi định dạng thời gian ISO từ Backend
}

/**
 * Interface chứa dữ liệu thống kê tổng hợp (Dùng cho 4 thẻ Stats Cards ở trên cùng)
 */
export interface UserStats {
  total: number; // Tổng số thành viên
  active: number; // Số tài khoản đang hoạt động
  admin: number; // Số lượng tài khoản quản trị viên
  new_this_month: number; // Số thành viên đăng ký mới trong tháng hiện tại
}

/**
 * Interface cấu trúc thông tin phân trang trả về từ Django Pagination
 */
export interface PaginationInfo {
  count: number; // Tổng số lượng bản ghi có trong Database
  next: string | null; // URL đến trang tiếp theo (nếu có)
  previous: string | null; // URL về trang trước đó (nếu có)
  total_pages: number; // Tổng số trang tính toán được
  current_page: number; // Số thứ tự trang hiện tại
}

/**
 * Interface đại diện cho cấu trúc JSON phản hồi (Response) từ API gốc:
 * GET http://127.0.0.1:8000/api/admin/users/
 */
export interface AdminUsersApiResponse {
  results: UserItem[]; // Mảng danh sách người dùng thuộc trang hiện tại
  stats: UserStats; // Object số liệu thống kê chung
  pagination: PaginationInfo; // Object dữ liệu phục vụ thanh điều hướng phân trang
}

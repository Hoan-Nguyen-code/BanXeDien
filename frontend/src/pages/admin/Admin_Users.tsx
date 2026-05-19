// src/pages/admin/Admin_Users.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";

import type {
  UserItem,
  UserStats,
  PaginationInfo,
  AdminUsersApiResponse,
} from "../../assets/js/admin_user";

// Sử dụng chung file CSS của Orders để đồng bộ giao diện tuyệt đối
import "../../assets/css/admin_orders.css";

// Import Sidebar component giống hệt trang Orders của Huy
import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Users: React.FC = () => {
  // ----------------------------------------------------
  // 1. KHỞI TẠO STATE & GIÁ TRỊ MẶC ĐỊNH TRÁNH SẬP TRANG
  // ----------------------------------------------------
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<string>("");

  // Object Stats khớp với cấu trúc 4 Card màu của bạn (blue, orange, cyan, green)
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    admin: 0,
    new_this_month: 0,
  });

  // Khởi tạo Object Phân trang mặc định
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    total_pages: 1,
    current_page: 1,
  });

  // Quản lý trạng thái màn hình giao diện (list: Danh sách, add: Thêm, edit: Sửa, detail: Chi tiết)
  const [viewMode, setViewMode] = useState<"list" | "add" | "edit" | "detail">(
    "list",
  );
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Dữ liệu Form đồng bộ với API Django Backend
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    password: "",
    is_active: true,
  });

  // ----------------------------------------------------
  // 2. GỌI API ĐỔ DỮ LIỆU BẤT ĐỒNG BỘ (BẰNG AXIOS)
  // ----------------------------------------------------
  const fetchUsers = async (page: number, roleParam: string = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = `http://127.0.0.1:8000/api/admin/users/?page=${page}`;
      if (roleParam) {
        url += `&role=${roleParam}`;
      }

      const response = await axios.get<AdminUsersApiResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data.results);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Lỗi kết nối API lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, roleFilter);
  }, [currentPage, roleFilter]);

  // ----------------------------------------------------
  // 3. XỬ LÝ SỰ KIỆN TƯƠNG TÁC GIAO DIỆN
  // ----------------------------------------------------
  const handleFilterChange = (status: string) => {
    setRoleFilter(status);
    setCurrentPage(1); // Reset về trang 1 khi lọc tài khoản
  };

  const handleViewDetail = (user: UserItem) => {
    setSelectedUser(user);
    setViewMode("detail");
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
      password: "",
      is_active: user.is_active,
    });
    setViewMode("edit");
  };

  const handleOpenAdd = () => {
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      role: "CUSTOMER",
      password: "",
      is_active: true,
    });
    setViewMode("add");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (viewMode === "add") {
        await axios.post(
          "http://127.0.0.1:8000/api/admin/users/add/",
          formData,
          { headers },
        );
        alert("Thêm tài khoản người dùng thành công!");
      } else if (viewMode === "edit" && selectedUser) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${selectedUser.id}/edit/`,
          formData,
          { headers },
        );
        alert("Cập nhật thông tin thành công!");
      }
      setViewMode("list");
      fetchUsers(currentPage, roleFilter);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu user:", error);
      alert("Thao tác thất bại, vui lòng kiểm tra lại thông tin đầu vào!");
    }
  };

  // Sử dụng window.confirm giống chuẩn handleConfirmDelete bên Orders của Huy
  const handleDeleteUser = async (id: number, username: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa vĩnh viễn user @${username}?\nHành động này không thể hoàn tác!`,
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://127.0.0.1:8000/api/admin/users/${id}/delete/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        alert(`Đã xóa tài khoản ${username} thành công!`);
        fetchUsers(currentPage, roleFilter);
      } catch (error) {
        console.error("Lỗi xóa user:", error);
        alert("Không thể xóa đối tượng người dùng này!");
      }
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR TỰ ĐỘNG CHUYỂN ACTIVE SANG MENU USERS */}
      <AdminSidebar active="users" />

      {/* MAIN CONTENT BLOCK */}
      <div className="admin-main-content">
        {/* NAVBAR ĐỒNG BỘ 100% VỚI TRANG ORDERS */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-users"></i> Quản lý Thành viên
            </h1>
          </div>

          <div className="admin-navbar-right">
            <div className="admin-info">
              <span className="admin-name">Admin Panel</span>
              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT CHÍNH */}
        <div className="admin-content fade-in">
          {/* ==================== MÀN HÌNH 1: DANH SÁCH USER (LIST VIEW) ==================== */}
          {viewMode === "list" && (
            <>
              {/* Thống kê 4 khối màu khớp chuẩn với CSS mẫu */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.total}</h3>
                    <p>Tổng thành viên</p>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.active}</h3>
                    <p>Đang hoạt động</p>
                  </div>
                </div>

                <div className="stat-card cyan">
                  <div className="stat-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.admin}</h3>
                    <p>Ban quản trị</p>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{stats.new_this_month}</h3>
                    <p>Mới tháng này</p>
                  </div>
                </div>
              </div>

              {/* BẢNG DỮ LIỆU CHÍNH */}
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>Danh sách tài khoản</h2>

                  <div
                    className="header-actions"
                    style={{ display: "flex", gap: "12px" }}
                  >
                    {/* Bộ lọc vai trò áp dụng class custom-filter */}
                    <select
                      className="custom-filter"
                      value={roleFilter}
                      onChange={(e) => handleFilterChange(e.target.value)}
                    >
                      <option value="">🔘 Tất cả phân quyền</option>
                      <option value="ADMIN">🔵 Quản trị viên (Admin)</option>
                      <option value="CUSTOMER">🟣 Khách hàng (Customer)</option>
                    </select>

                    <button
                      onClick={handleOpenAdd}
                      className="page-btn current"
                      style={{
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        gap: "8px",
                        height: "50px",
                        minWidth: "150px",
                      }}
                    >
                      <i className="fas fa-plus"></i> Thêm User
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#475569",
                    }}
                  >
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Đang tải dữ liệu...
                  </div>
                ) : (
                  <>
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Mã ID</th>
                            <th>Username</th>
                            <th>Email liên hệ</th>
                            <th>Họ và Tên</th>
                            <th>Quyền hạn</th>
                            <th>Trạng thái</th>
                            <th>Ngày tham gia</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>

                        <tbody>
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <strong>#{user.id}</strong>
                                </td>
                                <td>
                                  <strong>{user.username}</strong>
                                </td>
                                <td>{user.email || "-"}</td>
                                <td>
                                  {user.first_name || user.last_name
                                    ? `${user.last_name || ""} ${user.first_name || ""}`
                                    : "-"}
                                </td>
                                <td>
                                  {/* Map badge màu giống hệt trạng thái của đơn hàng */}
                                  <span
                                    className={`status-badge ${user.role === "ADMIN" ? "confirmed" : "shipped"}`}
                                  >
                                    {user.role}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={`status-badge ${user.is_active ? "completed" : "cancelled"}`}
                                  >
                                    {user.is_active ? "Hoạt động" : "Bị khóa"}
                                  </span>
                                </td>
                                <td>
                                  {new Date(
                                    user.date_joined,
                                  ).toLocaleDateString("vi-VN")}
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                      onClick={() => handleViewDetail(user)}
                                      className="btn-action"
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    <button
                                      onClick={() => handleOpenEdit(user)}
                                      className="btn-action"
                                      title="Sửa tài khoản"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteUser(user.id, user.username)
                                      }
                                      className="btn-action"
                                      title="Xóa tài khoản"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={8}
                                style={{ textAlign: "center", padding: 40 }}
                              >
                                Không tìm thấy tài khoản người dùng nào
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* PHÂN TRANG FLEXBOX CAO CẤP CHUẨN DỰ ÁN */}
                    <div
                      className="pagination-list"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#64748b",
                        }}
                      >
                        Trang {pagination.current_page} /{" "}
                        {pagination.total_pages} (Tổng {pagination.count} users)
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          disabled={!pagination.previous}
                          onClick={() => setCurrentPage(1)}
                          className="page-btn"
                          style={{
                            minWidth: "70px",
                            opacity: pagination.previous ? 1 : 0.4,
                            cursor: pagination.previous
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          &laquo; Đầu
                        </button>
                        <button
                          disabled={!pagination.previous}
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className="page-btn"
                          style={{
                            minWidth: "80px",
                            opacity: pagination.previous ? 1 : 0.4,
                            cursor: pagination.previous
                              ? "pointer"
                              : "not-allowed",
                          }}
                        >
                          Trước
                        </button>
                        <span className="page-btn current">
                          {pagination.current_page}
                        </span>
                        <button
                          disabled={!pagination.next}
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className="page-btn"
                          style={{
                            minWidth: "80px",
                            opacity: pagination.next ? 1 : 0.4,
                            cursor: pagination.next ? "pointer" : "not-allowed",
                          }}
                        >
                          Tiếp
                        </button>
                        <button
                          disabled={!pagination.next}
                          onClick={() => setCurrentPage(pagination.total_pages)}
                          className="page-btn"
                          style={{
                            minWidth: "70px",
                            opacity: pagination.next ? 1 : 0.4,
                            cursor: pagination.next ? "pointer" : "not-allowed",
                          }}
                        >
                          Cuối &raquo;
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ==================== MÀN HÌNH 2: FORM THÊM / SỬA USER ==================== */}
          {(viewMode === "add" || viewMode === "edit") && (
            <div
              className="admin-section"
              style={{ maxWidth: "800px", margin: "0 auto" }}
            >
              <div className="admin-section-header">
                <h2>
                  <i
                    className={`fas fa-user-${viewMode === "add" ? "plus" : "edit"}`}
                    style={{ marginRight: "10px", color: "#2563eb" }}
                  ></i>
                  {viewMode === "add"
                    ? "Tạo Tài Khoản Người Dùng Mới"
                    : `Chỉnh Sửa Thành Viên: ${selectedUser?.username}`}
                </h2>
              </div>

              <form
                onSubmit={handleFormSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginTop: "15px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Username đăng nhập *
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      disabled={viewMode === "edit"}
                      value={formData.username}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Hộp thư (Email)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Họ
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Tên
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      style={{
                        fontWeight: "700",
                        color: "#334155",
                        fontSize: "14px",
                      }}
                    >
                      Quyền hạn tài khoản
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="custom-filter"
                      style={{ width: "100%" }}
                    >
                      <option value="CUSTOMER">
                        Customer (Khách mua hàng)
                      </option>
                      <option value="ADMIN">
                        Admin (Quản trị viên hệ thống)
                      </option>
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "700",
                      color: "#334155",
                      fontSize: "14px",
                    }}
                  >
                    Địa chỉ cư trú
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="custom-filter"
                    style={{
                      width: "100%",
                      height: "auto",
                      padding: "12px 16px",
                    }}
                  ></textarea>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "700",
                      color: "#334155",
                      fontSize: "14px",
                    }}
                  >
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={
                      viewMode === "add"
                        ? "Cài đặt mật khẩu..."
                        : "Để trống nếu giữ nguyên mật khẩu cũ..."
                    }
                    required={viewMode === "add"}
                    className="custom-filter"
                    style={{ width: "100%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "5px 0",
                  }}
                >
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label
                    htmlFor="is_active"
                    style={{
                      fontWeight: "600",
                      color: "#475569",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Kích hoạt tài khoản hoạt động
                  </label>
                </div>

                <div
                  style={{ display: "flex", gap: "12px", marginTop: "10px" }}
                >
                  <button
                    type="submit"
                    className="page-btn current"
                    style={{
                      border: "none",
                      cursor: "pointer",
                      width: "160px",
                    }}
                  >
                    <i
                      className="fas fa-save"
                      style={{ marginRight: "8px" }}
                    ></i>{" "}
                    Lưu thông tin
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="page-btn"
                    style={{
                      background: "#f1f5f9",
                      color: "#475569",
                      width: "100px",
                    }}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================== MÀN HÌNH 3: CHI TIẾT HỒ SƠ USER (DETAIL VIEW) ==================== */}
          {viewMode === "detail" && selectedUser && (
            <div
              className="admin-section"
              style={{ maxWidth: "750px", margin: "0 auto" }}
            >
              <div
                className="admin-section-header"
                style={{
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "16px",
                }}
              >
                <h2>
                  <i
                    className="fas fa-id-card"
                    style={{ marginRight: "10px", color: "#0891b2" }}
                  ></i>{" "}
                  Chi Tiết Hồ Sơ Thành Viên
                </h2>
                <button
                  onClick={() => setViewMode("list")}
                  className="page-btn"
                  style={{
                    background: "#f1f5f9",
                    color: "#475569",
                    minWidth: "100px",
                    height: "40px",
                  }}
                >
                  <i
                    className="fas fa-arrow-left"
                    style={{ marginRight: "6px" }}
                  ></i>{" "}
                  Trở về
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: "30px",
                  marginTop: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRight: "1px solid #f1f5f9",
                    paddingRight: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      color: "#94a3b8",
                      marginBottom: "16px",
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 6px",
                      fontSize: "18px",
                      fontWeight: "800",
                    }}
                  >
                    @{selectedUser.username}
                  </h3>
                  <span
                    className={`status-badge ${selectedUser.role === "ADMIN" ? "confirmed" : "shipped"}`}
                    style={{ marginBottom: "10px" }}
                  >
                    {selectedUser.role}
                  </span>
                  <span
                    className={`status-badge ${selectedUser.is_active ? "completed" : "cancelled"}`}
                  >
                    {selectedUser.is_active ? "Active" : "Locked"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f8fafc",
                      paddingBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "140px",
                        fontWeight: "700",
                        color: "#64748b",
                      }}
                    >
                      Mã ID User:
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      #{selectedUser.id}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f8fafc",
                      paddingBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "140px",
                        fontWeight: "700",
                        color: "#64748b",
                      }}
                    >
                      Thư điện tử:
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      {selectedUser.email || "Chưa thiết lập"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f8fafc",
                      paddingBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "140px",
                        fontWeight: "700",
                        color: "#64748b",
                      }}
                    >
                      Họ & tên đầy đủ:
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      {selectedUser.first_name || selectedUser.last_name
                        ? `${selectedUser.last_name || ""} ${selectedUser.first_name || ""}`
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f8fafc",
                      paddingBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "140px",
                        fontWeight: "700",
                        color: "#64748b",
                      }}
                    >
                      Số điện thoại:
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      {selectedUser.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #f8fafc",
                      paddingBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "140px",
                        fontWeight: "700",
                        color: "#64748b",
                      }}
                    >
                      Ngày tham gia:
                    </span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>
                      {new Date(selectedUser.date_joined).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontWeight: "700", color: "#64748b" }}>
                      Địa chỉ đăng ký:
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        background: "#f8fafc",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "4px",
                      }}
                    >
                      {selectedUser.address ||
                        "Chưa ghi nhận địa chỉ cụ thể trên hệ thống."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin_Users;

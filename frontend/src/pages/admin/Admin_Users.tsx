// src/pages/admin/Admin_Users.tsx

import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../assets/css/admin_users.css";

import type {
  UserItem,
  UserStats,
  PaginationInfo,
  AdminUsersApiResponse,
} from "../../assets/js/admin_user";

import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Users: React.FC = () => {
  // ============================================================
  // STATE
  // ============================================================
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    admin: 0,
    new_this_month: 0,
  });

  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    next: null,
    previous: null,
    total_pages: 1,
    current_page: 1,
  });

  const [viewMode, setViewMode] = useState<"list" | "add" | "edit" | "detail">(
    "list",
  );
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

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

  // ============================================================
  // API
  // ============================================================
  const fetchUsers = async (page: number, roleParam: string = "") => {
    setLoading(true);
    try {
      const response = await api.get<AdminUsersApiResponse>(
        `admin/users/?page=${page}${roleParam ? `&role=${roleParam}` : ""}`,
      );
      setUsers(response.data?.results ?? []);
      setStats(
        response.data?.stats ?? {
          total: 0,
          active: 0,
          admin: 0,
          new_this_month: 0,
        },
      );
      setPagination(
        response.data?.pagination ?? {
          count: 0,
          next: null,
          previous: null,
          total_pages: 1,
          current_page: 1,
        },
      );
    } catch (error) {
      console.error("Lỗi API users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, roleFilter);
  }, [currentPage, roleFilter]);

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleFilterChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
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
      if (viewMode === "add") {
        await api.post("admin/users/add/", formData);
        alert("Thêm tài khoản người dùng thành công!");
      } else if (viewMode === "edit" && selectedUser) {
        await api.put(`admin/users/${selectedUser.id}/edit/`, formData);
        alert("Cập nhật thông tin thành công!");
      }
      setViewMode("list");
      fetchUsers(currentPage, roleFilter);
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Thao tác thất bại, vui lòng kiểm tra lại thông tin đầu vào!");
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa vĩnh viễn user @${username}?\nHành động này không thể hoàn tác!`,
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`admin/users/${id}/delete/`);
      alert(`Đã xóa tài khoản ${username} thành công!`);
      fetchUsers(currentPage, roleFilter);
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("Không thể xóa tài khoản này!");
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="admin-layout">
      <AdminSidebar active="users" />

      <div className="admin-main-content">
        {/* ── NAVBAR ── */}
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

        <div className="admin-content fade-in">
          {/* ══════════════════════════════════════
              VIEW: LIST
          ══════════════════════════════════════ */}
          {viewMode === "list" && (
            <>
              {/* STATS CARDS */}
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

              {/* TABLE SECTION */}
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>Danh sách tài khoản</h2>

                  <div className="header-actions">
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
                      className="page-btn current btn-add-user"
                    >
                      <i className="fas fa-plus"></i> Thêm User
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-box">
                    <i
                      className="fas fa-spinner fa-spin"
                      style={{ marginRight: 8 }}
                    ></i>
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
                          {(users ?? []).length > 0 ? (
                            (users ?? []).map((user) => (
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
                                    ? `${user.last_name || ""} ${user.first_name || ""}`.trim()
                                    : "-"}
                                </td>
                                <td>
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
                                  <div className="table-actions">
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

                    {/* PAGINATION */}
                    <div className="pagination-wrapper">
                      <div className="pagination-info">
                        Trang {pagination.current_page} /{" "}
                        {pagination.total_pages}
                        &nbsp;(Tổng {pagination.count} users)
                      </div>
                      <div className="pagination-buttons">
                        <button
                          disabled={!pagination.previous}
                          onClick={() => setCurrentPage(1)}
                          className={`page-btn ${!pagination.previous ? "page-btn-disabled" : "page-btn-enabled"}`}
                          style={{ minWidth: 70 }}
                        >
                          &laquo; Đầu
                        </button>
                        <button
                          disabled={!pagination.previous}
                          onClick={() => setCurrentPage((p) => p - 1)}
                          className={`page-btn ${!pagination.previous ? "page-btn-disabled" : "page-btn-enabled"}`}
                          style={{ minWidth: 80 }}
                        >
                          Trước
                        </button>
                        <span className="page-btn current">
                          {pagination.current_page}
                        </span>
                        <button
                          disabled={!pagination.next}
                          onClick={() => setCurrentPage((p) => p + 1)}
                          className={`page-btn ${!pagination.next ? "page-btn-disabled" : "page-btn-enabled"}`}
                          style={{ minWidth: 80 }}
                        >
                          Tiếp
                        </button>
                        <button
                          disabled={!pagination.next}
                          onClick={() => setCurrentPage(pagination.total_pages)}
                          className={`page-btn ${!pagination.next ? "page-btn-disabled" : "page-btn-enabled"}`}
                          style={{ minWidth: 70 }}
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

          {/* ══════════════════════════════════════
              VIEW: ADD / EDIT FORM
          ══════════════════════════════════════ */}
          {(viewMode === "add" || viewMode === "edit") && (
            <div className="admin-section user-form-container">
              <div className="admin-section-header">
                <h2>
                  <i
                    className={`fas fa-user-${viewMode === "add" ? "plus" : "edit"}`}
                    style={{ marginRight: 10, color: "#2563eb" }}
                  ></i>
                  {viewMode === "add"
                    ? "Tạo Tài Khoản Người Dùng Mới"
                    : `Chỉnh Sửa Thành Viên: ${selectedUser?.username}`}
                </h2>
              </div>

              <form onSubmit={handleFormSubmit} className="user-form">
                {/* Row 1: Username + Email */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Username đăng nhập *</label>
                    <input
                      type="text"
                      name="username"
                      required
                      disabled={viewMode === "edit"}
                      value={formData.username}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hộp thư (Email)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
                    />
                  </div>
                </div>

                {/* Row 2: Họ + Tên */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Họ</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
                    />
                  </div>
                </div>

                {/* Row 3: Phone + Role */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quyền hạn tài khoản</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="custom-filter full-width"
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

                {/* Row 4: Address */}
                <div className="form-group">
                  <label className="form-label">Địa chỉ cư trú</label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="custom-filter textarea-custom"
                  />
                </div>

                {/* Row 5: Password */}
                <div className="form-group">
                  <label className="form-label">Mật khẩu</label>
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
                    className="custom-filter full-width"
                  />
                </div>

                {/* Row 6: is_active */}
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <label htmlFor="is_active" className="checkbox-label">
                    Kích hoạt tài khoản hoạt động
                  </label>
                </div>

                {/* Buttons */}
                <div className="form-buttons">
                  <button
                    type="submit"
                    className="page-btn current"
                    style={{ border: "none", cursor: "pointer", width: 160 }}
                  >
                    <i className="fas fa-save" style={{ marginRight: 8 }}></i>
                    Lưu thông tin
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="page-btn btn-secondary"
                    style={{ width: 100 }}
                  >
                    Hủy bỏ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════
              VIEW: DETAIL
          ══════════════════════════════════════ */}
          {viewMode === "detail" && selectedUser && (
            <div className="admin-section user-detail-container">
              <div className="admin-section-header detail-header">
                <h2>
                  <i
                    className="fas fa-id-card"
                    style={{ marginRight: 10, color: "#0891b2" }}
                  ></i>
                  Chi Tiết Hồ Sơ Thành Viên
                </h2>
                <button
                  onClick={() => setViewMode("list")}
                  className="page-btn btn-secondary"
                  style={{ minWidth: 100, height: 40 }}
                >
                  <i
                    className="fas fa-arrow-left"
                    style={{ marginRight: 6 }}
                  ></i>
                  Trở về
                </button>
              </div>

              <div className="detail-grid">
                {/* Avatar column */}
                <div className="detail-sidebar">
                  <div className="detail-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <h3
                    style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800 }}
                  >
                    @{selectedUser.username}
                  </h3>
                  <span
                    className={`status-badge ${selectedUser.role === "ADMIN" ? "confirmed" : "shipped"}`}
                    style={{ marginBottom: 10 }}
                  >
                    {selectedUser.role}
                  </span>
                  <span
                    className={`status-badge ${selectedUser.is_active ? "completed" : "cancelled"}`}
                  >
                    {selectedUser.is_active ? "Active" : "Locked"}
                  </span>
                </div>

                {/* Info column */}
                <div className="detail-info">
                  <div className="detail-row">
                    <span className="detail-label">Mã ID User:</span>
                    <span className="detail-value">#{selectedUser.id}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Thư điện tử:</span>
                    <span className="detail-value">
                      {selectedUser.email || "Chưa thiết lập"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Họ & tên đầy đủ:</span>
                    <span className="detail-value">
                      {selectedUser.first_name || selectedUser.last_name
                        ? `${selectedUser.last_name || ""} ${selectedUser.first_name || ""}`.trim()
                        : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">
                      {selectedUser.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ngày tham gia:</span>
                    <span className="detail-value">
                      {new Date(selectedUser.date_joined).toLocaleString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span className="detail-label">Địa chỉ đăng ký:</span>
                    <span className="detail-address">
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

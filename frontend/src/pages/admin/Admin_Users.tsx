// src/pages/admin/Admin_Users.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";

import type {
  UserItem,
  UserStats,
  PaginationInfo,
  AdminUsersApiResponse,
} from "../../assets/js/admin_user";

import "../../assets/css/admin_orders.css";
import "../../assets/css/admin_users.css";

import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Users: React.FC = () => {
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

  const [viewMode, setViewMode] = useState<
    "list" | "add" | "edit" | "detail"
  >("list");

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

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async (page: number, roleParam: string = "") => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      let url = `http://127.0.0.1:8000/admin/users/?page=${page}`;

      if (roleParam) {
        url += `&role=${roleParam}`;
      }

      const response = await axios.get<AdminUsersApiResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.results || []);

      setStats(
        response.data.stats || {
          total: 0,
          active: 0,
          admin: 0,
          new_this_month: 0,
        },
      );

      setPagination(
        response.data.pagination || {
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

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleFilterChange = (status: string) => {
    setRoleFilter(status);
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

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (viewMode === "add") {
        await axios.post(
          "http://127.0.0.1:8000/admin/users/add/",
          formData,
          { headers },
        );

        alert("Thêm user thành công!");
      }

      if (viewMode === "edit" && selectedUser) {
        await axios.put(
          `http://127.0.0.1:8000/admin/users/${selectedUser.id}/edit/`,
          formData,
          { headers },
        );

        alert("Cập nhật user thành công!");
      }

      setViewMode("list");

      fetchUsers(currentPage, roleFilter);
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert("Không thể lưu dữ liệu!");
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id: number, username: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa @${username}?`,
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://127.0.0.1:8000/admin/users/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Xóa thành công!");

      fetchUsers(currentPage, roleFilter);
    } catch (error) {
      console.error("Lỗi xóa user:", error);
      alert("Không thể xóa user!");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="users" />

      <div className="admin-main-content">
        {/* NAVBAR */}
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
          {/* ===================================================== */}
          {/* LIST VIEW */}
          {/* ===================================================== */}

          {viewMode === "list" && (
            <>
              {/* STATS */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>

                  <div className="stat-info">
                    <h3>{stats?.total || 0}</h3>
                    <p>Tổng thành viên</p>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">
                    <i className="fas fa-user-check"></i>
                  </div>

                  <div className="stat-info">
                    <h3>{stats?.active || 0}</h3>
                    <p>Đang hoạt động</p>
                  </div>
                </div>

                <div className="stat-card cyan">
                  <div className="stat-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>

                  <div className="stat-info">
                    <h3>{stats?.admin || 0}</h3>
                    <p>Quản trị viên</p>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>

                  <div className="stat-info">
                    <h3>{stats?.new_this_month || 0}</h3>
                    <p>Mới tháng này</p>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="admin-section">
                <div className="admin-section-header">
                  <h2>Danh sách tài khoản</h2>

                  <div className="header-actions">
                    <select
                      className="custom-filter"
                      value={roleFilter}
                      onChange={(e) =>
                        handleFilterChange(e.target.value)
                      }
                    >
                      <option value="">Tất cả quyền</option>

                      <option value="ADMIN">Admin</option>

                      <option value="CUSTOMER">
                        Customer
                      </option>
                    </select>

                    <button
                      onClick={handleOpenAdd}
                      className="page-btn current btn-add-user"
                    >
                      <i className="fas fa-plus"></i>
                      Thêm User
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-box">
                    <i className="fas fa-spinner fa-spin"></i>
                    Đang tải dữ liệu...
                  </div>
                ) : (
                  <>
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Họ tên</th>
                            <th>Role</th>
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

                                <td>{user.username}</td>

                                <td>{user.email || "-"}</td>

                                <td>
                                  {user.first_name ||
                                  user.last_name
                                    ? `${user.last_name || ""} ${user.first_name || ""}`
                                    : "-"}
                                </td>

                                <td>
                                  <span
                                    className={`status-badge ${
                                      user.role === "ADMIN"
                                        ? "confirmed"
                                        : "shipped"
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </td>

                                <td>
                                  <span
                                    className={`status-badge ${
                                      user.is_active
                                        ? "completed"
                                        : "cancelled"
                                    }`}
                                  >
                                    {user.is_active
                                      ? "Hoạt động"
                                      : "Bị khóa"}
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
                                      onClick={() =>
                                        handleViewDetail(user)
                                      }
                                      className="btn-action"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleOpenEdit(user)
                                      }
                                      className="btn-action"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteUser(
                                          user.id,
                                          user.username,
                                        )
                                      }
                                      className="btn-action"
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
                                style={{
                                  textAlign: "center",
                                  padding: 40,
                                }}
                              >
                                Không có dữ liệu
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
                      </div>

                      <div className="pagination-buttons">
                        <button
                          disabled={!pagination.previous}
                          onClick={() => setCurrentPage(1)}
                          className={`page-btn ${
                            pagination.previous
                              ? "page-btn-enabled"
                              : "page-btn-disabled"
                          }`}
                        >
                          Đầu
                        </button>

                        <button
                          disabled={!pagination.previous}
                          onClick={() =>
                            setCurrentPage((p) => p - 1)
                          }
                          className={`page-btn ${
                            pagination.previous
                              ? "page-btn-enabled"
                              : "page-btn-disabled"
                          }`}
                        >
                          Trước
                        </button>

                        <span className="page-btn current">
                          {pagination.current_page}
                        </span>

                        <button
                          disabled={!pagination.next}
                          onClick={() =>
                            setCurrentPage((p) => p + 1)
                          }
                          className={`page-btn ${
                            pagination.next
                              ? "page-btn-enabled"
                              : "page-btn-disabled"
                          }`}
                        >
                          Tiếp
                        </button>

                        <button
                          disabled={!pagination.next}
                          onClick={() =>
                            setCurrentPage(
                              pagination.total_pages,
                            )
                          }
                          className={`page-btn ${
                            pagination.next
                              ? "page-btn-enabled"
                              : "page-btn-disabled"
                          }`}
                        >
                          Cuối
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin_Users;
import { useEffect } from "react";
import { Link } from "react-router-dom";

import "../../assets/css/admin_orders.css";

import AdminSidebar from "../../components/AdminSidebar";

interface OrderItem {
  product: {
    name: string;
  };
}

interface User {
  username: string;
  full_name?: string;
}

interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total_price: number;
  status: string;
  status_display: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  shipping: number;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  has_previous: boolean;
  has_next: boolean;
}

interface Props {
  orders: Order[];
  stats: Stats;
  pagination: Pagination;
  statusFilter: string;
  adminName: string;
}

const Admin_orders = ({
  orders,
  stats,
  pagination,
  statusFilter,
  adminName,
}: Props) => {
  useEffect(() => {
    // nếu sau này cần fetch API thì đặt ở đây
  }, []);

  const handleFilter = (status: string) => {
    const url = status ? `/admin/orders?status=${status}` : `/admin/orders`;

    window.location.href = url;
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa đơn hàng #${id}?`,
    );

    if (confirmDelete) {
      console.log("DELETE ORDER:", id);
      // gọi API delete sau
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR (NEW COMPONENT) */}
      <AdminSidebar active="orders" />

      {/* MAIN CONTENT */}
      <div className="admin-main-content">
        {/* NAVBAR */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-shopping-cart"></i> Quản lý Đơn hàng
            </h1>
          </div>

          <div className="admin-navbar-right">
            <div className="admin-info">
              <span className="admin-name">{adminName}</span>
              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content fade-in">
          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Tổng đơn</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.pending}</h3>
                <p>Chờ xác nhận</p>
              </div>
            </div>

            <div className="stat-card cyan">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.confirmed}</h3>
                <p>Đã xác nhận</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.shipping}</h3>
                <p>Đang giao</p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Danh sách đơn hàng</h2>

              <div className="header-actions">
                <select
                  className="custom-filter"
                  value={statusFilter}
                  onChange={(e) => handleFilter(e.target.value)}
                >
                  <option value="">🔘 Tất cả trạng thái</option>
                  <option value="PENDING">🟡 Chờ xác nhận</option>
                  <option value="CONFIRMED">🔵 Đã xác nhận</option>
                  <option value="SHIPPED">🟣 Đang giao</option>
                  <option value="COMPLETED">🟢 Hoàn thành</option>
                  <option value="CANCELLED">🔴 Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>

                        <td>{order.user.full_name || order.user.username}</td>

                        <td className="text-truncate" style={{ maxWidth: 220 }}>
                          {order.items
                            .map((item) => item.product.name)
                            .join(", ")}
                        </td>

                        <td>{order.total_price.toLocaleString("vi-VN")} VNĐ</td>

                        <td>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
                          >
                            {order.status_display}
                          </span>
                        </td>

                        <td>{order.created_at}</td>

                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="btn-action"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            <Link
                              to={`/admin/orders/edit/${order.id}`}
                              className="btn-action"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

                            <button
                              className="btn-action"
                              onClick={() => handleDelete(order.id)}
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
                        colSpan={7}
                        style={{ textAlign: "center", padding: 40 }}
                      >
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination-list">
              <span className="page-btn current">
                Trang {pagination.current_page} / {pagination.total_pages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_orders;

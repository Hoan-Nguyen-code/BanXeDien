import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";
import { initAdminDashboard } from "../../assets/js/admin_dashboard";

import "../../assets/css/admin_dashboard.css";

import AdminSidebar from "../../components/AdminSidebar";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
  };
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  user: {
    username: string;
    first_name: string;
    last_name: string;
  };
  items: OrderItem[];
}

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_stations: number;
  total_orders: number;
  revenue: number;
  stock_low?: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  recent_orders: Order[];
}

const Admin_dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    initAdminDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/api/admin/dashboard/");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
  };

  const getCustomerName = (order: Order) => {
    const fullName = `${order.user.last_name} ${order.user.first_name}`.trim();
    return fullName || order.user.username;
  };

  const getStatusClass = (status: string) => status.toLowerCase();

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Đang tải Dashboard...</h2>
      </div>
    );
  }

  return (
    <>
      {/* SIDEBAR (ACTIVE FIXED) */}
      <AdminSidebar active="dashboard" />

      {/* MAIN CONTENT */}
      <div className="admin-main-content">
        {/* NAVBAR */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>Tổng quan</h1>
          </div>

          <div className="admin-navbar-right">
            <div className="admin-info">
              <span className="admin-name">Admin</span>
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
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{dashboardData?.stats.total_users}</h3>
                <p>Tổng Users</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <i className="fas fa-car"></i>
              </div>
              <div className="stat-info">
                <h3>{dashboardData?.stats.total_products}</h3>
                <p>Xe trong kho</p>
              </div>
            </div>

            <div className="stat-card orange">
              <div className="stat-icon">
                <i className="fas fa-charging-station"></i>
              </div>
              <div className="stat-info">
                <h3>{dashboardData?.stats.total_stations}</h3>
                <p>Trạm sạc</p>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-info">
                <h3>{dashboardData?.stats.total_orders}</h3>
                <p>Đơn hàng</p>
              </div>
            </div>
          </div>

          {/* FINANCE */}
          <div className="stats-grid">
            <div className="stat-card cyan">
              <div className="stat-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-info">
                <h3>{formatCurrency(dashboardData?.stats.revenue)}</h3>
                <p>Doanh thu</p>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h3>3 Tỷ</h3>
                <p>Lợi nhuận</p>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <h3>{dashboardData?.stats.stock_low || 0}</h3>
                <p>Sắp hết hàng</p>
              </div>
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Đơn hàng gần đây</h2>

              <Link to="/admin/orders" className="btn-view-all">
                Xem tất cả
              </Link>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>SL</th>
                    <th>Tổng</th>
                    <th>Trạng thái</th>
                    <th>Ngày</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboardData?.recent_orders?.length ? (
                    dashboardData.recent_orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{getCustomerName(order)}</td>

                        <td>
                          {order.items.map((i) => i.product.name).join(", ")}
                        </td>

                        <td>{order.items.map((i) => i.quantity).join(", ")}</td>

                        <td>{formatCurrency(order.total_price)}</td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>
                          {new Date(order.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>

                        <td>
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn-action view"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        Chưa có đơn hàng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions">
            <h2>Thao tác nhanh</h2>

            <div className="action-grid">
              <Link to="/admin/kho" className="action-card">
                <i className="fas fa-plus-circle"></i>
                <span>Thêm xe</span>
              </Link>

              <Link to="/admin/tramsac" className="action-card">
                <i className="fas fa-charging-station"></i>
                <span>Thêm trạm</span>
              </Link>

              <Link to="/admin/users" className="action-card">
                <i className="fas fa-user-plus"></i>
                <span>Users</span>
              </Link>

              <Link to="/admin/thongke" className="action-card">
                <i className="fas fa-chart-bar"></i>
                <span>Báo cáo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_dashboard;

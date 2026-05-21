import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../../assets/css/admin_orders.css";
import AdminSidebar from "../../components/AdminSidebar";
import api from "../../services/api";

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
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  shipping: number;
}

const Admin_orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
  });

  const [loading, setLoading] = useState(true);

  const adminName = "Admin";

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("admin/orders/");

      const data = response.data;

      setOrders(data);

      setStats({
        total: data.length,
        pending: data.filter((o: Order) => o.status === "PENDING").length,
        confirmed: data.filter((o: Order) => o.status === "CONFIRMED").length,
        shipping: data.filter((o: Order) => o.status === "SHIPPING").length,
      });
    } catch (error) {
      console.error("Lỗi load đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa đơn hàng #${id}?`,
    );

    if (confirmDelete) {
      console.log("DELETE ORDER:", id);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="orders" />

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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{ textAlign: "center", padding: 40 }}
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>

                        <td>
                          {order.user?.full_name ||
                            order.user?.username ||
                            "Ẩn danh"}
                        </td>

                        <td className="text-truncate" style={{ maxWidth: 220 }}>
                          {order.items?.length > 0
                            ? order.items
                                .map((item) => item.product?.name)
                                .join(", ")
                            : "Không có sản phẩm"}
                        </td>

                        <td>
                          {Number(order.total_price).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </td>

                        <td>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
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
                          <div style={{ display: "flex", gap: 8 }}>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="btn-action"
                            >
                              <i className="fas fa-eye"></i>
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

            <div className="pagination-list">
              <span className="page-btn current">
                Tổng đơn hàng: {orders.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_orders;

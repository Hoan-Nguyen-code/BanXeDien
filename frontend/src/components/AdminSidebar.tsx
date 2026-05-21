import { Link, useNavigate } from "react-router-dom";

import "../assets/css/admin.css";

interface Props {
  active?: string;
}

const AdminSidebar = ({ active }: Props) => {
  const navigate = useNavigate();

  const isActive = (key: string) =>
    active === key ? "admin-menu-item active" : "admin-menu-item";

  const handleLogout = () => {
    // xoá dữ liệu đăng nhập
    localStorage.removeItem("user");

    // nếu có token thì xoá luôn
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // chuyển về login
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      {/* LOGO */}
      <div className="admin-logo">
        <i className="fas fa-bolt"></i>
        <h2>Admin Panel</h2>
      </div>

      {/* MENU */}
      <nav className="admin-menu">
        <Link to="/admin/dashboard" className={isActive("dashboard")}>
          <i className="fas fa-dashboard"></i>
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/users" className={isActive("users")}>
          <i className="fas fa-users"></i>
          <span>Quản lý Users</span>
        </Link>

        <Link to="/admin/kho" className={isActive("kho")}>
          <i className="fas fa-warehouse"></i>
          <span>Quản lý Kho</span>
        </Link>

        <Link to="/admin/taichinh" className={isActive("taichinh")}>
          <i className="fas fa-chart-line"></i>
          <span>Tài chính</span>
        </Link>

        <Link to="/admin/orders" className={isActive("orders")}>
          <i className="fas fa-shopping-cart"></i>
          <span>Đơn hàng</span>
        </Link>

        <Link to="/admin/tramsac" className={isActive("tramsac")}>
          <i className="fas fa-charging-station"></i>
          <span>Trạm sạc</span>
        </Link>
      </nav>

      {/* FOOTER */}
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

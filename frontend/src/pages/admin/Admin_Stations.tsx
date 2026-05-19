import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Giả định bạn dùng react-router-dom
import AdminSidebar from "../../components/AdminSidebar";
import "../../assets/css/admin_stations.css";

export const Admin_Stations: React.FC = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    maintenance: 0,
    inactive: 0,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_next: false,
    has_previous: false,
    count: 0,
    start_index: 0,
    end_index: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStations = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/stations/?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setStations(res.data.stations);
      setStats(res.data.stats);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations(currentPage);
  }, [currentPage]);

  return (
    <div className="admin-layout">
      <AdminSidebar active="tramsac" />
      <div className="main-content">
        <div className="navbar">
          <h1>
            <i className="fas fa-charging-station"></i> Quản lý Trạm sạc
          </h1>
        </div>

        <div className="content fade-in">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <i className="fas fa-charging-station"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Tổng trạm</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.active}</h3>
                <p>Hoạt động</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">
                <i className="fas fa-wrench"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.maintenance}</h3>
                <p>Bảo trì</p>
              </div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.inactive}</h3>
                <p>Ngừng hoạt động</p>
              </div>
            </div>
          </div>

          {/* Section */}
          <div className="section">
            <div className="section-header">
              <h2>Danh sách trạm sạc</h2>
              <Link to="/admin/station/add" className="btn-primary">
                <i className="fas fa-plus"></i> Thêm trạm sạc
              </Link>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên trạm</th>
                    <th>Địa chỉ</th>
                    <th>Loại sạc</th>
                    <th>Công suất</th>
                    <th>Tổng cổng</th>
                    <th>Còn trống</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {stations.length > 0 ? (
                    stations.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>
                          <strong>{s.name}</strong>
                        </td>
                        <td>{s.address.substring(0, 40)}</td>
                        <td>{s.charger_type}</td>
                        <td>{s.power}</td>
                        <td>{s.total_ports}</td>
                        <td>{s.available_ports}</td>
                        <td>
                          <span
                            className={`status-badge ${s.status.toLowerCase()}`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <Link
                            to={`/admin/station/${s.id}`}
                            className="btn-action view"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link
                            to={`/admin/station/edit/${s.id}`}
                            className="btn-action edit"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button className="btn-action delete">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        Chưa có trạm sạc nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="pagination-footer">
              <div className="pagination-info">
                Hiển thị{" "}
                <strong>
                  {pagination.start_index} - {pagination.end_index}
                </strong>{" "}
                trong số <strong>{stats.total}</strong> trạm
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  disabled={!pagination.has_previous}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="page-btn"
                >
                  Trước
                </button>
                <span className="page-btn current">
                  Trang {pagination.current_page}
                </span>
                <button
                  disabled={!pagination.has_next}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="page-btn"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import AdminSidebar from "../../components/AdminSidebar";

import "../../assets/css/admin_stations.css";

import type {
  ChargingStation,
  StationStats,
  AdminStationApiResponse,
} from "../../assets/js/admin_stations";

export const Admin_Stations: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>([]);

  const [stats, setStats] = useState<StationStats>({
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
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);

  // =========================
  // FETCH API
  // =========================

  const fetchStations = async (page: number) => {
    setLoading(true);

    try {
      const res = await api.get<AdminStationApiResponse>(
        `admin/stations/?page=${page}`,
      );

      console.log("STATIONS API:", res.data);

      setStations(res.data.stations || []);

      setStats(
        res.data.stats || {
          total: 0,
          active: 0,
          maintenance: 0,
          inactive: 0,
        },
      );

      setPagination(
        res.data.pagination || {
          current_page: 1,
          total_pages: 1,
          has_next: false,
          has_previous: false,
          count: 0,
        },
      );
    } catch (err) {
      console.error("Lỗi tải dữ liệu trạm sạc:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchStations(currentPage);
  }, [currentPage]);

  // =========================
  // RENDER
  // =========================

  return (
    <div className="admin-layout">
      <AdminSidebar active="tramsac" />

      <div className="admin-main-content">
        {/* NAVBAR */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-charging-station"></i> Quản lý Trạm sạc
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content fade-in">
          {/* LOADING */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
              }}
            >
              Đang tải dữ liệu...
            </div>
          )}

          {/* STATS */}
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

          {/* TABLE */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Danh sách trạm sạc</h2>

              <Link to="/admin/station/add" className="page-btn current">
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

                        <td>
                          {s.address ? s.address.substring(0, 40) : "Không có"}
                        </td>

                        <td>{s.charger_type}</td>

                        <td>{s.power_capacity}</td>

                        <td>{s.total_ports}</td>

                        <td>{s.available_ports}</td>

                        <td>
                          <span
                            className={`status-badge ${
                              s.status === "ACTIVE"
                                ? "completed"
                                : s.status === "MAINTENANCE"
                                  ? "orange"
                                  : "cancelled"
                            }`}
                          >
                            {s.status === "ACTIVE"
                              ? "Hoạt động"
                              : s.status === "MAINTENANCE"
                                ? "Bảo trì"
                                : "Ngừng hoạt động"}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <Link
                              to={`/admin/station/${s.id}`}
                              className="btn-action"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>

                            <Link
                              to={`/admin/station/edit/${s.id}`}
                              className="btn-action"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>

                            <button className="btn-action">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          textAlign: "center",
                          padding: "40px",
                        }}
                      >
                        Không có dữ liệu trạm sạc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination-list">
              <div className="pagination-info">
                Tổng số: <strong>{pagination.count}</strong> trạm
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  disabled={!pagination.has_previous}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="page-btn"
                >
                  Trước
                </button>

                <span className="page-btn current">
                  Trang {pagination.current_page} / {pagination.total_pages}
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

export default Admin_Stations;

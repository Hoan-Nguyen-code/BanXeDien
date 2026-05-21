import React, { useState, useEffect } from "react";
import api from "../../services/api";

import type {
  FinanceStats,
  TopProductItem,
  RevenueChartData,
  FilterOption,
} from "../../assets/js/admin_tai_chinh";

import "../../assets/css/admin_tai_chinh.css";
import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Tai_Chinh: React.FC = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<FinanceStats>({
    revenue_month: "0 VNĐ",
    expense_month: "0 VNĐ",
    profit_month: "0 VNĐ",
    revenue_today: "0 VNĐ",
  });

  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);

  const [chartData, setChartData] = useState<RevenueChartData | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // FIX: set sẵn để dropdown không bị trắng
  const [monthsOptions, setMonthsOptions] = useState<FilterOption[]>(
    Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
    })),
  );

  const [yearsOptions, setYearsOptions] = useState<number[]>([
    2024, 2025, 2026,
  ]);

  const fetchFinanceData = async (month: number, year: number) => {
    try {
      setLoading(true);

      const response = await api.get("admin/tai-chinh/", {
        params: {
          month,
          year,
        },
      });

      console.log("FINANCE DATA:", response.data);

      const data = response.data;

      setStats(data.stats);

      setTopProducts(data.top_products || []);

      setChartData(data.revenue_data);

      setSelectedMonth(data.selected_month || month);

      setSelectedYear(data.selected_year || year);

      // FIX
      if (data.months && data.months.length > 0) {
        setMonthsOptions(data.months);
      }

      if (data.years && data.years.length > 0) {
        setYearsOptions(data.years);
      }
    } catch (error: any) {
      console.error(
        "Lỗi API tài chính:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData(selectedMonth, selectedYear);
  }, []);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(e.target.value);

    setSelectedMonth(month);

    fetchFinanceData(month, selectedYear);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value);

    setSelectedYear(year);

    fetchFinanceData(selectedMonth, year);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="finance" />

      <div className="admin-main-content">
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-chart-bar"></i>
              Báo cáo Kế toán & Tài chính
            </h1>
          </div>

          <div className="admin-navbar-right">
            <div className="admin-info">
              <span className="admin-name">Admin Finance</span>

              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-content fade-in">
          {/* FILTER */}
          <div className="finance-filter-bar">
            <div className="filter-title">
              <i className="fas fa-filter"></i>
              Bộ lọc báo cáo thời gian
            </div>

            <div className="filter-controls">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="custom-filter"
              >
                {monthsOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    Tháng {m.value}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="custom-filter"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STATS */}
          <div className="finance-stats-grid">
            <div className="finance-stat-card green">
              <div className="stat-info">
                <h3>{stats.revenue_month}</h3>
                <p>Doanh thu tháng</p>
              </div>
            </div>

            <div className="finance-stat-card orange">
              <div className="stat-info">
                <h3>{stats.expense_month}</h3>
                <p>Chi phí</p>
              </div>
            </div>

            <div className="finance-stat-card blue">
              <div className="stat-info">
                <h3>{stats.profit_month}</h3>
                <p>Lợi nhuận</p>
              </div>
            </div>

            <div className="finance-stat-card purple">
              <div className="stat-info">
                <h3>{stats.revenue_today}</h3>
                <p>Doanh thu hôm nay</p>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Biểu đồ doanh thu năm {selectedYear}</h2>
            </div>

            <div className="native-chart-container">
              {chartData &&
              chartData.revenue &&
              chartData.revenue.length > 0 ? (
                <div className="chart-bars-scroll">
                  {chartData.revenue.map((rev, idx) => {
                    const maxVal = Math.max(...chartData.revenue, 1);

                    return (
                      <div className="chart-column-group" key={idx}>
                        <div className="bars-wrapper">
                          <div
                            className="bar bar-revenue"
                            style={{
                              height: `${(rev / maxVal) * 120}px`,
                            }}
                          ></div>
                        </div>

                        <span className="column-label">
                          {chartData.labels[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  Không có dữ liệu biểu đồ
                </div>
              )}
            </div>
          </div>

          {/* TOP PRODUCTS */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Top sản phẩm bán chạy</h2>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đã bán</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>

                <tbody>
                  {topProducts.length > 0 ? (
                    topProducts.map((p, index) => (
                      <tr key={index}>
                        <td>{p.name}</td>
                        <td>{p.sold}</td>
                        <td>{p.revenue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "center",
                          padding: 30,
                        }}
                      >
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Tai_Chinh;

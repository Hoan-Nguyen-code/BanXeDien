import React, { useState, useEffect } from "react";
import axios from "axios";

// Lùi 2 tầng thư mục ra src để lấy Type và CSS
import type {
  FinanceStats,
  TopProductItem,
  RevenueChartData,
  FilterOption,
  AdminTaiChinhApiResponse,
} from "../../assets/js/admin_tai_chinh";

import "../../assets/css/admin_orders.css";
import "../../assets/css/admin_tai_chinh.css";
import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Tai_Chinh: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<FinanceStats>({
    revenue_month: "0 VNĐ",
    expense_month: "0 VNĐ",
    profit_month: "0 VNĐ",
    revenue_today: "0 VNĐ",
  });
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [chartData, setChartData] = useState<RevenueChartData | null>(null);

  // Các state hỗ trợ bộ lọc dropdown trùng với logic Django
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [monthsOptions, setMonthsOptions] = useState<FilterOption[]>([]);
  const [yearsOptions, setYearsOptions] = useState<number[]>([]);

  // Hàm gọi API tài chính kết hợp query params bộ lọc
  const fetchFinanceData = async (month: number, year: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<AdminTaiChinhApiResponse>(
        `http://127.0.0.1:8000/api/admin/tai-chinh/?month=${month}&year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data) {
        setStats(response.data.stats);
        setTopProducts(response.data.top_products || []);
        setChartData(response.data.revenue_data);
        setSelectedMonth(response.data.selected_month);
        setSelectedYear(response.data.selected_year);
        setMonthsOptions(response.data.months || []);
        setYearsOptions(response.data.years || []);
      }
    } catch (error) {
      console.error("Lỗi kết nối API quản lý tài chính:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chạy load dữ liệu chuẩn xác ngay khi mount component
  useEffect(() => {
    fetchFinanceData(selectedMonth, selectedYear);
  }, []);

  // Xử lý khi Admin thay đổi tháng hoặc năm trên Dropdown công cụ lọc
  const handleFilterChange = (month: number, year: number) => {
    fetchFinanceData(month, year);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="finance" />

      <div className="admin-main-content">
        {/* NAVBAR ĐỒNG BỘ DỰ ÁN */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-chart-bar"></i> Báo cáo Kế toán & Tài chính
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

        {/* CONTENT CHÍNH */}
        <div className="admin-content fade-in">
          {/* BỘ LỌC THỜI GIAN THEO CONTEXT CỦA DJANGO */}
          <div className="finance-filter-bar">
            <div className="filter-title">
              <i className="fas fa-filter"></i> Bộ lọc báo cáo thời gian
            </div>
            <div className="filter-controls">
              <select
                value={selectedMonth}
                onChange={(e) =>
                  handleFilterChange(Number(e.target.value), selectedYear)
                }
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
                onChange={(e) =>
                  handleFilterChange(selectedMonth, Number(e.target.value))
                }
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

          {/* 4 KHỐI THỐNG KÊ DOANH SỐ ĐÃ ĐƯỢC CHUẨN HÓA ĐỂ TRÁNH LỖI CSS BỊ ĐÈ */}
          <div className="finance-stats-grid">
            <div className="finance-stat-card green">
              <div className="stat-icon">
                <i className="fas fa-coins"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.revenue_month}</h3>
                <p>Doanh thu tháng này</p>
              </div>
            </div>

            <div className="finance-stat-card orange">
              <div className="stat-icon">
                <i className="fas fa-arrow-circle-down"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.expense_month}</h3>
                <p>Chi phí ước tính (60%)</p>
              </div>
            </div>

            <div className="finance-stat-card blue">
              <div className="stat-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.profit_month}</h3>
                <p>Lợi nhuận ước tính (40%)</p>
              </div>
            </div>

            <div className="finance-stat-card purple">
              <div className="stat-icon">
                <i className="fas fa-calendar-day"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.revenue_today}</h3>
                <p>Doanh thu hôm nay</p>
              </div>
            </div>
          </div>

          {/* KHỐI TRỰC QUAN HÓA BIỂU ĐỒ DOANH THU 12 THÁNG */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>
                <i
                  className="fas fa-chart-line"
                  style={{ marginRight: "6px" }}
                ></i>{" "}
                Biến động dòng tiền năm {selectedYear} (Đơn vị: Tỷ VNĐ)
              </h2>
            </div>
            <div className="native-chart-container">
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="dot revenue"></span> Doanh thu
                </span>
                <span className="legend-item">
                  <span className="dot expense"></span> Chi phí
                </span>
                <span className="legend-item">
                  <span className="dot profit"></span> Lợi nhuận
                </span>
              </div>
              <div className="chart-bars-scroll">
                {chartData &&
                chartData.revenue &&
                chartData.revenue.length > 0 ? (
                  chartData.revenue.map((revValue, idx) => {
                    const expValue = chartData.expense?.[idx] || 0;
                    const proValue = chartData.profit?.[idx] || 0;

                    // Tìm giá trị lớn nhất trong mảng để định hình tỷ lệ chiều cao cột %
                    const maxVal = Math.max(...chartData.revenue, 1);

                    return (
                      <div className="chart-column-group" key={idx}>
                        <div className="bars-wrapper">
                          <div
                            className="bar bar-revenue"
                            style={{
                              height: `${(revValue / maxVal) * 120}px`,
                            }}
                            title={`Doanh thu: ${revValue} tỷ`}
                          ></div>
                          <div
                            className="bar bar-expense"
                            style={{
                              height: `${(expValue / maxVal) * 120}px`,
                            }}
                            title={`Chi phí: ${expValue} tỷ`}
                          ></div>
                          <div
                            className="bar bar-profit"
                            style={{
                              height: `${(proValue / maxVal) * 120}px`,
                            }}
                            title={`Lợi nhuận: ${proValue} tỷ`}
                          ></div>
                        </div>
                        <span className="column-label">
                          {chartData.labels?.[idx] || `T${idx + 1}`}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                      color: "#94a3b8",
                      paddingBottom: "20px",
                    }}
                  >
                    Không có dữ liệu biểu đồ cho năm này
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Tai_Chinh;

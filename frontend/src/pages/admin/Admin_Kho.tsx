// src/pages/admin/Admin_Kho.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";

// Đi lùi 2 tầng ra src/ để import Type và CSS
import type {
  ProductInventoryItem,
  InventoryDashboardStats,
  DjangoPagination,
  AdminKhoApiResponse,
} from "../../assets/js/admin_kho";

import "../../assets/css/admin_orders.css";
import "../../assets/css/admin_kho.css"; // File CSS đặc thù của Kho bên dưới
import AdminSidebar from "../../components/AdminSidebar";

export const Admin_Kho: React.FC = () => {
  const [products, setProducts] = useState<ProductInventoryItem[]>([]);
  const [lookupProducts, setLookupProducts] = useState<
    { id: number; name: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<InventoryDashboardStats>({
    total_products: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  const [pagination, setPagination] = useState<DjangoPagination>({
    count: 0,
    total_pages: 1,
    current_page: 1,
    has_next: false,
    has_previous: false,
  });

  // State quản lý Modal Nhập / Xuất kho
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<"IMPORT" | "EXPORT">("IMPORT");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [actionQuantity, setActionQuantity] = useState<number>(1);
  const [importPrice, setImportPrice] = useState<string>("");

  // Gọi API lấy dữ liệu trang quản lý kho
  const fetchKhoData = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<AdminKhoApiResponse>(
        `http://127.0.0.1:8000/api/admin/kho/?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProducts(response.data.results);
      setLookupProducts(response.data.all_products_lookup);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Lỗi khi kết nối API admin_kho:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhoData(currentPage);
  }, [currentPage]);

  // Xử lý gửi lệnh POST Nhập/Xuất kho lên Django giống như xử lý form POST của Huy
  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Vui lòng chọn một sản phẩm!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = {
        action: modalAction,
        product_id: selectedProductId,
        quantity: actionQuantity,
        import_price: modalAction === "IMPORT" ? importPrice : undefined,
      };

      await axios.post("http://127.0.0.1:8000/api/admin/kho/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        `Thực hiện giao dịch ${modalAction === "IMPORT" ? "Nhập kho" : "Xuất kho"} thành công!`,
      );
      setShowActionModal(false);
      // Reset form modal
      setSelectedProductId("");
      setActionQuantity(1);
      setImportPrice("");
      // Tải lại dữ liệu mới nhất
      fetchKhoData(currentPage);
    } catch (error: any) {
      console.error("Lỗi xử lý kho hàng:", error);
      const errorMsg =
        error.response?.data?.message || "Lỗi hệ thống không xác định!";
      alert(`Thao tác thất bại. ${errorMsg}`);
    }
  };

  const openModal = (
    actionType: "IMPORT" | "EXPORT",
    initialProductId?: number,
  ) => {
    setModalAction(actionType);
    if (initialProductId) {
      setSelectedProductId(initialProductId.toString());
    }
    setShowActionModal(true);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active="kho" />

      <div className="admin-main-content">
        {/* NAVBAR */}
        <div className="admin-navbar">
          <div className="admin-navbar-left">
            <h1>
              <i className="fas fa-warehouse"></i> Hệ thống Quản lý Kho
            </h1>
          </div>
          <div className="admin-navbar-right">
            <div className="admin-info">
              <span className="admin-name">Quản trị viên Kho</span>
              <div className="admin-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT CHÍNH */}
        <div className="admin-content fade-in">
          {/* THỐNG KÊ 4 THẺ MÀU THEO BIẾN STATS ĐÚNG LOGIC DJANGO CỦA HUY */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon">
                <i className="fas fa-boxes"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.total_products}</h3>
                <p>Tổng mặt hàng</p>
              </div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.in_stock}</h3>
                <p>Còn hàng dồi dào (&gt;5)</p>
              </div>
            </div>
            <div className="stat-card orange">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <h3>{stats.low_stock}</h3>
                <p>Sắp hết hàng (1 - 5)</p>
              </div>
            </div>
            <div
              className="stat-card cancelled"
              style={{ backgroundColor: "#ef4444" }}
            >
              <div className="stat-icon" style={{ color: "#fff" }}>
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <h3 style={{ color: "#fff" }}>{stats.out_of_stock}</h3>
                <p style={{ color: "#f8fafc" }}>Hết hàng (0)</p>
              </div>
            </div>
          </div>

          {/* KHỐI BẢNG VÀ NÚT CHỨC NĂNG */}
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Danh mục theo dõi biến động kho</h2>
              <div
                className="header-actions"
                style={{ display: "flex", gap: "10px" }}
              >
                <button
                  className="page-btn current"
                  onClick={() => openModal("IMPORT")}
                  style={{
                    background: "#10b981",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i className="fas fa-plus-circle"></i> Lập phiếu Nhập
                </button>
                <button
                  className="page-btn current"
                  onClick={() => openModal("EXPORT")}
                  style={{
                    background: "#f59e0b",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <i className="fas fa-minus-circle"></i> Lập phiếu Xuất
                </button>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#64748b",
                }}
              >
                <i className="fas fa-spinner fa-spin"></i> Đang tổng hợp dữ liệu
                tồn kho...
              </div>
            ) : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá bán niêm yết</th>
                        <th style={{ textAlign: "center" }}>Số lượng tồn</th>
                        <th>Trạng thái kho</th>
                        <th style={{ textAlign: "center" }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((p) => (
                          <tr key={p.id}>
                            <td>#{p.id}</td>
                            <td style={{ fontWeight: "700", color: "#1e293b" }}>
                              {p.name}
                            </td>
                            <td>
                              {p.category ? p.category.name : "Chưa phân loại"}
                            </td>
                            <td>{p.price.toLocaleString("vi-VN")} đ</td>
                            <td style={{ textAlign: "center" }}>
                              <strong style={{ fontSize: "15px" }}>
                                {p.stock_quantity}
                              </strong>
                            </td>
                            <td>
                              <span
                                className={`status-badge ${
                                  p.status === "IN_STOCK"
                                    ? "completed"
                                    : p.status === "LOW_STOCK"
                                      ? "orange"
                                      : "cancelled"
                                }`}
                              >
                                {p.status === "IN_STOCK"
                                  ? "An toàn"
                                  : p.status === "LOW_STOCK"
                                    ? "Cảnh báo"
                                    : "Hết hàng"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  justifyContent: "center",
                                }}
                              >
                                <button
                                  className="action-entry-btn import-small"
                                  onClick={() => openModal("IMPORT", p.id)}
                                  title="Nhập thêm"
                                >
                                  <i className="fas fa-arrow-down"></i> Nhập
                                </button>
                                <button
                                  className="action-entry-btn export-small"
                                  onClick={() => openModal("EXPORT", p.id)}
                                  title="Xuất kho"
                                >
                                  <i className="fas fa-arrow-up"></i> Xuất
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            style={{ textAlign: "center", padding: "30px" }}
                          >
                            Kho dữ liệu rỗng hoặc không tìm thấy sản phẩm.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PHÂN TRANG KHỚP CHUẨN DJANGO PAGINATOR */}
                <div
                  className="pagination-list"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#64748b",
                    }}
                  >
                    Trang {pagination.current_page} / {pagination.total_pages}{" "}
                    (Tổng {pagination.count} mặt hàng)
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      disabled={!pagination.has_previous}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="page-btn"
                      style={{
                        opacity: pagination.has_previous ? 1 : 0.4,
                        cursor: pagination.has_previous
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      Trước
                    </button>
                    <span className="page-btn current">
                      {pagination.current_page}
                    </span>
                    <button
                      disabled={!pagination.has_next}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="page-btn"
                      style={{
                        opacity: pagination.has_next ? 1 : 0.4,
                        cursor: pagination.has_next ? "pointer" : "not-allowed",
                      }}
                    >
                      Tiếp
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL POPUP XỬ LÝ PHIẾU NHẬP / XUẤT KHO KHI BẤM NÚT */}
      {showActionModal && (
        <div className="kho-modal-overlay">
          <div className="kho-modal-content">
            <div className="kho-modal-header">
              <h2>
                {modalAction === "IMPORT"
                  ? "📌 Lập phiếu Nhập kho"
                  : "📤 Lập phiếu Xuất kho"}
              </h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowActionModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleInventorySubmit}>
              <div className="modal-form-group">
                <label>Chọn sản phẩm tương tác:</label>
                <select
                  className="custom-filter"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                >
                  <option value="">-- Chọn sản phẩm từ danh sách --</option>
                  {lookupProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      [#{p.id}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-form-group">
                <label>Số lượng (quantity):</label>
                <input
                  type="number"
                  className="custom-filter"
                  min="1"
                  value={actionQuantity}
                  onChange={(e) =>
                    setActionQuantity(parseInt(e.target.value) || 1)
                  }
                  required
                />
              </div>

              {modalAction === "IMPORT" && (
                <div className="modal-form-group">
                  <label>
                    Giá nhập kho (Để trống sẽ lấy giá niêm yết làm mặc định):
                  </label>
                  <input
                    type="number"
                    className="custom-filter"
                    placeholder="đ"
                    value={importPrice}
                    onChange={(e) => setImportPrice(e.target.value)}
                  />
                </div>
              )}

              <div className="kho-modal-footer">
                <button
                  type="button"
                  className="page-btn"
                  style={{ background: "#cbd5e1", color: "#334155" }}
                  onClick={() => setShowActionModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="page-btn current"
                  style={{
                    background:
                      modalAction === "IMPORT" ? "#10b981" : "#f59e0b",
                  }}
                >
                  Xác nhận thực hiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Kho;

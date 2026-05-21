import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

import "../../assets/css/qr.css";
import MainLayout from "../../layouts/MainLayout";
import qrImage from "../../assets/images/QR/qr_vietinbank.png";

import { getCookie } from "../../assets/js/csrf";

const Qr: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { totalPrice, orderId } = location.state || {};

  if (!orderId || !totalPrice) {
    return (
      <div className="qr-container">
        <h2>Không tìm thấy thông tin đơn hàng</h2>
        <Link to="/">Về trang chủ</Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await api.post(
        `orders/${orderId}/confirm-payment/`,
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": getCookie("csrftoken") || "",
          },
        },
      );

      navigate("/success");
    } catch (err) {
      console.log(err);
      alert("Không thể xác nhận thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div
        className="qr-container"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <h2>Thanh toán đơn hàng</h2>

        <img
          src={qrImage}
          alt="QR Vietinbank"
          width="300"
          style={{ margin: "20px 0" }}
        />

        <p>
          <b>Số tiền:</b> {formatPrice(totalPrice)}
        </p>

        <p>
          <b>Nội dung chuyển khoản:</b>
        </p>

        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e74c3c" }}>
          ORDER {orderId}
        </p>

        <p style={{ color: "#666" }}>
          Sau khi chuyển khoản, vui lòng bấm xác nhận bên dưới
        </p>

        <button
          onClick={handleConfirm}
          className="btn-order"
          disabled={loading}
          style={{ marginTop: "20px" }}
        >
          {loading ? "Đang xử lý..." : "✅ Tôi đã thanh toán"}
        </button>
      </div>
    </MainLayout>
  );
};

export default Qr;

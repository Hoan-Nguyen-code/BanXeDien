import React from "react";
import { useLocation, Link } from "react-router-dom";

import "../assets/css/qr.css";
import qrImage from "../assets/images/QR/qr_vietinbank.png";

const Qr: React.FC = () => {
  const location = useLocation();

  // Lấy dữ liệu từ state (khớp với cấu trúc gửi từ Checkout.tsx)
  const { totalPrice, orderId } = location.state || {};

  // Nếu không có dữ liệu đơn hàng thì quay về trang chủ
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

  return (
    <div
      className="qr-container"
      style={{
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h2>Thanh toán đơn hàng</h2>

      <img
        src={qrImage}
        alt="QR Vietinbank"
        width="300"
        style={{
          margin: "20px 0",
        }}
      />

      <p>
        <b>Số tiền:</b> {formatPrice(totalPrice)}
      </p>

      <p>
        <b>Nội dung chuyển khoản:</b>
      </p>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#e74c3c",
        }}
      >
        ORDER {orderId}
      </p>

      <p style={{ color: "#666" }}>
        Sau khi chuyển khoản, vui lòng bấm xác nhận bên dưới
      </p>

      <Link
        to="/success"
        className="btn-order"
        style={{
          marginTop: "20px",
          display: "inline-block",
        }}
      >
        ✅ Tôi đã thanh toán
      </Link>
    </div>
  );
};

export default Qr;

import React from "react";
import MainLayout from "../../layouts/MainLayout";
import "../../assets/css/success.css";

const Success: React.FC = () => {
  return (
    <MainLayout>
      <div className="success-container">
        <h2>✅ Đơn hàng đã được xử lý</h2>

        <p>Cảm ơn bạn đã mua hàng!</p>

        <a href="/" className="btn-order">
          Về trang chủ
        </a>
      </div>
    </MainLayout>
  );
};

export default Success;

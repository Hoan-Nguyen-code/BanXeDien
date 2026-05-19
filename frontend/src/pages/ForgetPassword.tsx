import React, { useState } from "react";

import api from "../services/api";

import "../assets/css/base.css";
import "../assets/css/login.css";

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("forget-password/", {
        email,
      });

      alert(response.data.message);
    } catch (error: any) {
      console.log(error);

      alert("Gửi email thất bại");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="login-left">
        <div className="overlay">
          <div className="content">
            <i className="fas fa-charging-station"></i>

            <h1>WebGIS Xe Điện</h1>

            <p>Hệ thống bán xe điện và tìm kiếm trạm sạc thông minh</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-bolt-lightning"></i>
            </div>

            <h2>Quên mật khẩu</h2>

            <p>Nhập email để nhận hướng dẫn thay đổi mật khẩu.</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Địa chỉ email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập email của bạn"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-login">
              <i className="fas fa-paper-plane"></i>
              Gửi hướng dẫn đặt lại mật khẩu
            </button>
          </form>

          {/* Back to Login */}
          <div className="back-to-login-link">
            <p>
              Đã nhớ mật khẩu?
              <a href="/login">Đăng nhập ngay</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

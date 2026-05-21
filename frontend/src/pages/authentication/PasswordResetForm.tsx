import React, { useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

interface Message {
  type: "success" | "error" | "info" | "warning";
  text: string;
}

const PasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([]);

  const navigate = useNavigate();

  // Lấy uid và token từ URL
  const { uidb64, token } = useParams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessages([
        {
          type: "error",
          text: "Mật khẩu xác nhận không trùng khớp.",
        },
      ]);

      return;
    }

    try {
      const response = await api.post(`reset-password/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setMessages([
        {
          type: "success",
          text: response.data.message,
        },
      ]);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setMessages([
        {
          type: "error",
          text: error.response?.data?.message || "Có lỗi xảy ra.",
        },
      ]);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="overlay">
          <div className="content">
            <i className="fas fa-charging-station"></i>

            <h1>ECO-BIKE</h1>

            <p>Hệ thống bán xe điện và tìm kiếm trạm sạc thông minh</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-bolt-lightning"></i>
            </div>

            <h2>Đặt lại mật khẩu</h2>

            <p>Nhập mật khẩu mới và xác nhận mật khẩu.</p>
          </div>

          {messages.length > 0 && (
            <div className="messages-container">
              {messages.map((message, index) => (
                <div key={index} className={`alert alert-${message.type}`}>
                  <i className="fas fa-info-circle"></i>

                  {message.text}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="new_password">
                <i className="fas fa-lock"></i>
                Mật khẩu mới
              </label>

              <input
                type="password"
                id="new_password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">
                <i className="fas fa-lock"></i>
                Xác nhận mật khẩu
              </label>

              <input
                type="password"
                id="confirm_password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-login">
              <i className="fas fa-paper-plane"></i>
              Đặt lại mật khẩu
            </button>
          </form>

          <div className="back-to-login-link">
            <p>
              Đã nhớ mật khẩu?
              <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;

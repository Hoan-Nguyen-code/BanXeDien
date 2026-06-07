import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import "../../assets/css/login.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.get("csrf/");

      const response = await api.post("login/", {
        username,
        password,
        remember,
      });
      console.log("LOGIN RESPONSE:", response.data);

      alert(response.data.message);

      const user = response.data.user;

      // Lưu user
      localStorage.setItem("user", JSON.stringify(user));

      // ADMIN
      if (user.role === "ADMIN" || user.is_superuser) {
        window.location.href = "/admin/dashboard";
      }

      // USER THƯỜNG
      else {
        window.location.href = "/";
      }
    } catch (error: any) {
      console.log(error.response?.data);

      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0];

        if (Array.isArray(firstError)) {
          alert(firstError[0]);
        } else {
          alert(firstError as string);
        }
      } else {
        alert("Đăng nhập thất bại!");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Phần bên trái */}
      <div className="login-left">
        <div className="overlay">
          <div className="content">
            <i className="fas fa-charging-station"></i>

            <h1>ECO-BIKE</h1>

            <p>Hệ thống bán xe điện và tìm kiếm trạm sạc thông minh</p>

            <div className="features">
              <div className="feature-item">
                <i className="fas fa-car-battery"></i>
                <span>Xe điện chất lượng</span>
              </div>

              <div className="feature-item">
                <i className="fas fa-map-marked-alt"></i>
                <span>Bản đồ trạm sạc</span>
              </div>

              <div className="feature-item">
                <i className="fas fa-bolt"></i>
                <span>Sạc nhanh tiện lợi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần bên phải */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-bolt-lightning"></i>
            </div>

            <h2>Đăng nhập</h2>

            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user"></i>
                Tên đăng nhập
              </label>

              <input
                type="text"
                id="username"
                name="username"
                placeholder="Nhập tên đăng nhập"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Mật khẩu
              </label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  } toggle-password`}
                  onClick={togglePassword}
                ></i>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />

                <span>Ghi nhớ đăng nhập</span>
              </label>

              <Link to="/forget-password" className="forgot-password">
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className="btn-login">
              <i className="fas fa-sign-in-alt"></i>
              Đăng nhập
            </button>
          </form>

          <div className="signup-link">
            <p>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>

          <div className="divider">
            <span>hoặc đăng nhập với</span>
          </div>

          <div className="social-login">
            <button
              className="social-btn google"
              type="button"
              onClick={() => alert("Chức năng đang phát triển!")}
            >
              <i className="fab fa-google"></i>
              Google
            </button>

            <button
              className="social-btn facebook"
              type="button"
              onClick={() => alert("Chức năng đang phát triển!")}
            >
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

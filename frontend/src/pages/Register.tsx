import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import "../assets/css/base.css";
import "../assets/css/register.css";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const togglePassword = (field: string) => {
    if (field === "password1") {
      setShowPassword1(!showPassword1);
    } else {
      setShowPassword2(!showPassword2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password1 !== password2) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await api.post("register/", {
        username,
        email,
        password1,
        password2,
      });

      alert(response.data.message);

      // Chuyển sang trang đăng nhập
      navigate("/login");
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
        alert("Đăng ký thất bại!");
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
              <i className="fas fa-user-plus"></i>
            </div>

            <h2>Đăng ký tài khoản</h2>

            <p>Tạo tài khoản mới để sử dụng hệ thống</p>
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

              <small className="form-text">
                Tên đăng nhập phải từ 3-150 ký tự, chỉ chứa chữ cái, số và
                @/./+/-/_
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập địa chỉ email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <small className="form-text">Nhập địa chỉ email hợp lệ</small>
            </div>

            <div className="form-group">
              <label htmlFor="password1">
                <i className="fas fa-lock"></i>
                Mật khẩu
              </label>

              <div className="password-wrapper">
                <input
                  type={showPassword1 ? "text" : "password"}
                  id="password1"
                  name="password1"
                  placeholder="Nhập mật khẩu"
                  required
                  autoComplete="new-password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                />

                <i
                  className={`fas ${
                    showPassword1 ? "fa-eye-slash" : "fa-eye"
                  } toggle-password`}
                  onClick={() => togglePassword("password1")}
                ></i>
              </div>

              <small className="form-text">
                Mật khẩu phải có ít nhất 8 ký tự, không được toàn số
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="password2">
                <i className="fas fa-lock"></i>
                Nhập lại mật khẩu
              </label>

              <div className="password-wrapper">
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="password2"
                  name="password2"
                  placeholder="Nhập lại mật khẩu"
                  required
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />

                <i
                  className={`fas ${
                    showPassword2 ? "fa-eye-slash" : "fa-eye"
                  } toggle-password`}
                  onClick={() => togglePassword("password2")}
                ></i>
              </div>

              {password2 && password1 !== password2 && (
                <small className="form-text" style={{ color: "red" }}>
                  Mật khẩu không khớp!
                </small>
              )}

              {password2 && password1 === password2 && (
                <small className="form-text" style={{ color: "green" }}>
                  Mật khẩu khớp
                </small>
              )}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" name="agree_terms" required />

                <span>
                  Tôi đồng ý với{" "}
                  <a href="#" style={{ color: "#007bff" }}>
                    Điều khoản sử dụng
                  </a>
                </span>
              </label>
            </div>

            <button type="submit" className="btn-login">
              <i className="fas fa-user-plus"></i>
              Đăng ký
            </button>
          </form>

          <div className="signup-link">
            <p>
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>

          <div className="divider">
            <span>hoặc đăng ký với</span>
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

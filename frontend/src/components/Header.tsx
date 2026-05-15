import { Link } from "react-router-dom";

export default function Header() {
  const user = localStorage.getItem("user");

  const parsedUser = user ? JSON.parse(user) : null;

  const isAuthenticated = !!parsedUser;

  const username = parsedUser?.username || "Khách";

  const cartCount = 0;

  const toggleMenu = () => {
    const navMenu = document.getElementById("navMenu");

    navMenu?.classList.toggle("show");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <header className="header no-print">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="logo">
          <h2>
            <i className="fas fa-bolt"></i> ECO-BIKE
          </h2>
        </Link>

        {/* MENU BUTTON */}
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>

        {/* NAVIGATION */}
        <nav className="nav-menu" id="navMenu">
          <Link to="/info" className="btn btn-outline">
            Giới thiệu
          </Link>

          <Link to="/" className="btn btn-outline">
            Trang chủ
          </Link>

          <Link to="/news" className="btn btn-outline">
            Tin tức
          </Link>

          <Link to="/map" className="btn btn-outline">
            Trạm sạc
          </Link>
        </nav>

        {/* AUTH AREA */}
        <div className="auth-area">
          <Link to="/cart" className="cart-icon">
            <i className="fa-solid fa-cart-shopping"></i>

            {cartCount > 0 && (
              <span id="cart-count" className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <span className="badge badge-primary">
                <i className="fas fa-user"></i> {username}
              </span>

              <button onClick={handleLogout} className="btn btn-danger">
                <i className="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <i className="fas fa-sign-in-alt"></i> Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

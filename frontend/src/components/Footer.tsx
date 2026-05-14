export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer no-print">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-brand">
          <h3>
            <i className="fas fa-motorcycle"></i> GIS BÁN XE ĐIỆN
          </h3>

          <p>© {currentYear} - Hệ thống bán xe điện trực tuyến</p>
        </div>

        {/* CENTER */}
        <div className="footer-social">
          <a href="#">
            <i className="fa-brands fa-facebook"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-instagram"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-x-twitter"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-youtube"></i>
          </a>

          <a href="#">
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>

        {/* RIGHT */}
        <div className="footer-policy">
          <a href="#">Chính sách bảo mật</a>

          <span>•</span>

          <a href="#">Chính sách đổi trả</a>
        </div>
      </div>
    </footer>
  );
}

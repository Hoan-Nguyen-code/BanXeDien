import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

import "../assets/css/home.css";

import initHome from "../assets/js/home.ts";

import banner1 from "../assets/images/banners/banner1.jpg";
import banner2 from "../assets/images/banners/banner2.jpg";
import banner3 from "../assets/images/banners/banner3.jpg";
import banner4 from "../assets/images/banners/banner4.jpg";
import banner5 from "../assets/images/banners/banner5.jpg";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [sort, setSort] = useState("");

  // fetch data
  useEffect(() => {
    fetchHomeData();
  }, [selectedCategory, sort]);

  // init home.js
  useEffect(() => {
    initHome();
  }, [products]);

  const fetchHomeData = async () => {
    try {
      const response = await api.get("/home/", {
        params: {
          category: selectedCategory,
          q: search,
          sort: sort,
        },
      });

      setProducts(response.data.products);

      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetchHomeData();
  };

  const user = localStorage.getItem("user");

  const parsedUser = user ? JSON.parse(user) : null;

  const username = parsedUser?.username || "Khách";

  return (
    <MainLayout>
      {/* ===== BANNER ===== */}
      <div className="banner-full">
        <div className="banner-slider">
          <div className="banner-track">
            <img src={banner1} alt="banner1" />

            <img src={banner2} alt="banner2" />

            <img src={banner3} alt="banner3" />

            <img src={banner4} alt="banner4" />

            <img src={banner5} alt="banner5" />
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* ===== SIDEBAR ===== */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>
              <i className="fas fa-list"></i>
              Danh mục sản phẩm
            </h3>
          </div>

          <div className="sidebar-nav">
            <button
              className={`sidebar-item ${
                selectedCategory === "" ? "active" : ""
              }`}
              onClick={() => setSelectedCategory("")}
            >
              <i className="fas fa-th-large"></i>
              Tất cả sản phẩm
            </button>

            {categories.map((category: any) => (
              <button
                key={category.id}
                className={`sidebar-item ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <i className="fas fa-angle-right"></i>

                {category.name}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="info-card">
              <i className="fas fa-bolt"></i>

              <h4>Xe điện chất lượng</h4>

              <p>Cam kết chính hãng 100%</p>
            </div>
          </div>
        </aside>

        {/* ===== CONTENT AREA ===== */}
        <main className="content-area">
          {/* ===== SEARCH ===== */}
          <div className="search-section">
            <form className="search-wrapper" onSubmit={handleSearch}>
              <i className="fas fa-search"></i>

              <input
                type="text"
                name="q"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i> Tìm
              </button>
            </form>
          </div>

          {/* ===== WELCOME BANNER ===== */}
          <div className="welcome-banner">
            <div className="welcome-content">
              <h1>
                Chào mừng,
                <span className="highlight"> {username} </span>
              </h1>

              <p>Khám phá các sản phẩm xe điện chất lượng cao</p>
            </div>

            <div className="welcome-icon">
              <i className="fas fa-motorcycle"></i>
            </div>
          </div>

          {/* ===== FILTER BAR ===== */}
          <div className="filter-bar">
            <div className="filter-left">
              <h2>Danh sách sản phẩm</h2>

              <div className="product-count">
                Tìm thấy <strong>{products.length}</strong> sản phẩm
              </div>
            </div>

            <div className="filter-right">
              {/* SORT */}
              <div className="sort-dropdown">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">Mặc định</option>

                  <option value="price_asc">Giá tăng dần ↑</option>

                  <option value="price_desc">Giá giảm dần ↓</option>
                </select>
              </div>

              {/* VIEW TOGGLE */}
              <div className="view-toggle">
                <button
                  className="view-btn active"
                  data-view="grid"
                  type="button"
                >
                  <i className="fas fa-th"></i>
                </button>

                <button className="view-btn" data-view="list" type="button">
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* ===== PRODUCTS GRID ===== */}
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product: any) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img
                      src={
                        product.image
                          ? product.image
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={product.name}
                    />

                    <div className="product-overlay">
                      <Link
                        to={`/products/${product.id}`}
                        className="quick-view-btn"
                      >
                        <i className="fas fa-eye"></i> Xem nhanh
                      </Link>
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-rating">
                      <i className="fas fa-star"></i>

                      <i className="fas fa-star"></i>

                      <i className="fas fa-star"></i>

                      <i className="fas fa-star-half-alt"></i>

                      <i className="far fa-star"></i>

                      <span className="rating-count">(24)</span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-footer">
                      <div className="product-stock">
                        Còn {product.inventory?.stock_quantity || 0} sản phẩm
                      </div>

                      <div className="product-price">
                        <span className="current-price">
                          {Number(product.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      <button
                        className="add-btn add-to-cart-btn"
                        data-url={`/api/cart/add/${product.id}/`}
                        type="button"
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                background: "white",
                borderRadius: "15px",
              }}
            >
              <h3>Không có sản phẩm nào</h3>

              <p>Vui lòng quay lại sau.</p>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}

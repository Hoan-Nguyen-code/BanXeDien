import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import MainLayout from "../layouts/MainLayout";

import "../assets/css/home.css";
import initHome from "../assets/js/home.ts";

// banners
import banner1 from "../assets/images/banners/banner1.jpg";
import banner2 from "../assets/images/banners/banner2.jpg";
import banner3 from "../assets/images/banners/banner3.jpg";
import banner4 from "../assets/images/banners/banner4.jpg";
import banner5 from "../assets/images/banners/banner5.jpg";

// PRODUCT STATIC IMAGES
import bike1 from "../assets/images/products/bike1.jpg";
import bike2 from "../assets/images/products/bike2.jpg";
import bike3 from "../assets/images/products/bike3.jpg";
import bike4 from "../assets/images/products/bike4.jpg";
import bike5 from "../assets/images/products/bike5.jpg";
import bike6 from "../assets/images/products/bike6.jpg";
import car1 from "../assets/images/products/car1.jpg";
import accessory1 from "../assets/images/products/accessory1.jpg";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, [selectedCategory, sort]);

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

  // STATIC IMAGE MAP (key = product.id)
  const productImages: Record<number, string> = {
    1: bike1,
    2: bike3,
    3: bike5,
    4: bike2,
    5: bike4,
    6: bike6,
    7: car1,
    8: accessory1,
  };

  const getProductImage = (id: number) => {
    return productImages[id] || bike1; // fallback
  };

  return (
    <MainLayout>
      {/* ===== BANNER ===== */}
      <div className="banner-full">
        <div className="banner-slider">
          <div className="banner-track">
            <img src={banner1} />
            <img src={banner2} />
            <img src={banner3} />
            <img src={banner4} />
            <img src={banner5} />
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
              className={`sidebar-item ${selectedCategory === "" ? "active" : ""}`}
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

        {/* ===== CONTENT ===== */}
        <main className="content-area">
          {/* SEARCH */}
          <div className="search-section">
            <form className="search-wrapper" onSubmit={handleSearch}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <i className="fas fa-search"></i> Tìm
              </button>
            </form>
          </div>

          {/* WELCOME */}
          <div className="welcome-banner">
            <div className="welcome-content">
              <h1>
                Chào mừng, <span className="highlight">{username}</span>
              </h1>
              <p>Khám phá các sản phẩm xe điện chất lượng cao</p>
            </div>
          </div>

          {/* FILTER */}
          <div className="filter-bar">
            <div className="filter-left">
              <h2>Danh sách sản phẩm</h2>
              <div className="product-count">
                Tìm thấy <strong>{products.length}</strong> sản phẩm
              </div>
            </div>
            <div className="filter-right">
              {" "}
              {/* SORT */}{" "}
              <div className="sort-dropdown">
                {" "}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {" "}
                  <option value="">Mặc định</option>{" "}
                  <option value="price_asc">Giá tăng dần ↑</option>{" "}
                  <option value="price_desc">Giá giảm dần ↓</option>{" "}
                </select>{" "}
              </div>{" "}
              {/* VIEW TOGGLE */}{" "}
              <div className="view-toggle">
                {" "}
                <button
                  className="view-btn active"
                  data-view="grid"
                  type="button"
                >
                  {" "}
                  <i className="fas fa-th"></i>{" "}
                </button>{" "}
                <button className="view-btn" data-view="list" type="button">
                  {" "}
                  <i className="fas fa-list"></i>{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>

          {/* PRODUCTS */}
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product: any) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={getProductImage(product.id)} alt={product.name} />

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

                    <p className="product-description">{product.description}</p>

                    {/* PRODUCT META */}
                    <div className="product-meta">
                      <div className="product-rating">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>

                        <span className="rating-text">
                          {product.rating || 4.5}
                        </span>
                      </div>

                      <div className="product-stock">
                        <i className="fas fa-box"></i>
                        Còn {product.inventory?.stock_quantity || 12} sản phẩm
                      </div>
                    </div>

                    <div className="product-footer">
                      <div className="product-price">
                        {Number(product.price).toLocaleString("vi-VN")}đ
                      </div>

                      <button className="add-btn" type="button">
                        <i className="fas fa-shopping-cart"></i>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <h3>Không có sản phẩm nào</h3>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}

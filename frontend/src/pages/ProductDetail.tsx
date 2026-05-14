import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

import "../assets/css/product_detail.css";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<any>(null);

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`products/${Number(id)}/`);

      setProduct(response.data.product);

      setRelatedProducts(response.data.related_products);
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      {/* BACK BUTTON */}
      <Link to="/" className="back-home-btn">
        ← Quay về trang chủ
      </Link>

      <div className="product-detail-container">
        {/* ================= MAIN PRODUCT ================= */}
        <div className="product-main">
          {/* IMAGE */}
          <div className="product-image">
            <img
              src={
                product.image
                  ? product.image
                  : "https://via.placeholder.com/400x300"
              }
              alt={product.name}
            />
          </div>

          {/* INFO */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </div>

            <div className="product-stock">
              Còn {product.inventory?.stock_quantity} sản phẩm
            </div>

            <div
              className="product-description"
              dangerouslySetInnerHTML={{
                __html: product.description || "",
              }}
            />

            <div className="product-actions">
              <button className="add-btn">
                <i className="fas fa-shopping-cart"></i> Thêm vào giỏ ngay!
              </button>
            </div>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        <div className="related-products-section">
          <h2>Sản phẩm gợi ý</h2>

          <div className="related-products-grid">
            {relatedProducts.map((p: any) => (
              <div className="related-product-card" key={p.id}>
                <div className="related-img">
                  <img
                    src={
                      p.image ? p.image : "https://via.placeholder.com/300x200"
                    }
                    alt={p.name}
                  />
                </div>

                <div className="related-info">
                  <h4>{p.name}</h4>

                  <div className="related-price">
                    {Number(p.price).toLocaleString("vi-VN")}đ
                  </div>

                  <Link to={`/products/${p.id}`} className="view-btn">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

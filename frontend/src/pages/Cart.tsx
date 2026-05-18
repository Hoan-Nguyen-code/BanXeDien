import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../assets/css/cart.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "đ";

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      const data = res.data.data;

      setCartItems(data?.items || []);
      setTotalPrice(data?.total_price || 0);
      setRecommendedProducts(data?.recommended_products || []);
    } catch (error: any) {
      console.log(error?.response?.data);

      setCartItems([]);
      setTotalPrice(0);
      setRecommendedProducts([]);

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // ADD TO CART
  // =========================
  const handleAddToCart = async (productId: number) => {
    try {
      await api.post(`/add-to-cart/${productId}/`);
      fetchCart();
    } catch (error: any) {
      console.log(error?.response?.data);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // =========================
  // REMOVE FROM CART (KẾT NỐI API)
  // =========================
  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.delete(`/remove-from-cart/${itemId}/`);
      fetchCart(); // Tải lại giỏ hàng sau khi xóa thành công
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Giỏ hàng của bạn</h2>

      {cartItems.length > 0 ? (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th>Xóa</th>
                <th>Mua ngay</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td className="product-price">
                    {formatPrice(item.product.price)}
                  </td>
                  <td>{item.quantity}</td>
                  <td className="product-subtotal">
                    {formatPrice(item.subtotal)}
                  </td>
                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Xóa
                    </button>
                  </td>
                  <td>
                    <button
                      className="add-to-cart-btn"
                      style={{ padding: "6px 12px", fontSize: "13px" }}
                      onClick={() => navigate("/checkout")}
                    >
                      Mua ngay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            <div className="summary-total">
              <span>Tổng cộng:</span>
              <span className="total-price">{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Thanh toán
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Giao diện Thông báo Giỏ hàng trống đồng bộ với CSS */}
          <div className="empty-cart">
            <h2 className="empty-title">Giỏ hàng trống</h2>
            <p className="empty-desc">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <Link to="/" className="shop-btn">
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Giao diện Danh sách Gợi ý chuẩn lưới Grid thông minh */}
          <div className="recommend-section">
            <h3>Sản phẩm gợi ý</h3>
            <div className="recommend-list">
              {(recommendedProducts || []).map((p) => (
                <div key={p.id} className="product-card">
                  {p.image && <img src={p.image} alt={p.name} />}
                  <h4>{p.name}</h4>
                  <p>{formatPrice(p.price)}</p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(p.id)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import "../../assets/css/cart.css";
import {
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
} from "../../assets/js/cart";

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
  // IMAGE
  // =========================
  const getImage = (imagePath: string) => {
    if (!imagePath) {
      return "https://via.placeholder.com/400x300";
    }

    const fileName = imagePath.split("/").pop();

    return new URL(`../../assets/images/products/${fileName}`, import.meta.url)
      .href;
  };

  return (
    <MainLayout>
      <div className="cart-page-container">
        <h2 className="cart-page-title">Giỏ hàng của bạn</h2>

        {cartItems.length > 0 ? (
          <>
            <table className="cart-page-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tạm tính</th>
                  <th>Xóa</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>

                    <td className="cart-page-price">
                      {formatPrice(item.product.price)}
                    </td>

                    <td>
                      <div className="cart-quantity-box">
                        <button
                          className="cart-qty-btn"
                          onClick={() => decreaseQuantity(item.id, fetchCart)}
                        >
                          -
                        </button>

                        <span className="cart-qty-number">{item.quantity}</span>

                        <button
                          className="cart-qty-btn"
                          onClick={() => increaseQuantity(item.id, fetchCart)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="cart-page-subtotal">
                      {formatPrice(item.subtotal)}
                    </td>

                    <td>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeCartItem(item.id, fetchCart)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-page-summary">
              <h3 className="cart-summary-title">Tóm tắt đơn hàng</h3>

              <div className="cart-summary-total">
                <span>Tổng cộng:</span>

                <span className="cart-total-price">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Link to="/checkout" className="cart-checkout-btn">
                Thanh toán
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* EMPTY CART */}
            <div className="cart-empty-wrapper">
              <h2 className="cart-empty-title">Giỏ hàng trống</h2>

              <p className="cart-empty-desc">
                Bạn chưa có sản phẩm nào trong giỏ hàng.
              </p>

              <Link to="/" className="cart-shop-btn">
                Tiếp tục mua sắm
              </Link>
            </div>

            {/* RECOMMENDED PRODUCTS */}
            <div className="cart-recommend-section">
              <h3 className="cart-recommend-heading">Sản phẩm gợi ý</h3>

              <div className="cart-recommend-list">
                {(recommendedProducts || []).map((p) => (
                  <div key={p.id} className="cart-product-card">
                    <div className="cart-product-image">
                      <img src={getImage(p.image)} alt={p.name} />
                    </div>

                    <h4 className="cart-product-name">{p.name}</h4>

                    <p className="cart-product-price">{formatPrice(p.price)}</p>

                    <button
                      className="cart-add-btn"
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
    </MainLayout>
  );
};

export default Cart;

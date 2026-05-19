import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import { getCookie } from "../../assets/js/csrf";
import "../../assets/css/checkout.css";

interface Product {
  id: number;
  name: string;
}

interface CheckoutItem {
  id: number;
  quantity: number;
  subtotal: number;
  product: Product;
}

const Checkout: React.FC = () => {
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/");
      const data = res.data.data;

      setItems(data.items);
      setTotalPrice(data.total_price);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // CHECKOUT HANDLER (FIXED)
  // =========================
  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const fullname = (form.elements.namedItem("fullname") as HTMLInputElement)
      .value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement)
      .value;
    const note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
    const payment = (form.elements.namedItem("payment") as RadioNodeList).value;

    try {
      const res = await api.post(
        "/checkout/",
        { fullname, phone, address, note, payment },
        {
          withCredentials: true,
          headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
        },
      );

      if (res.data.success) {
        // Kiểm tra phương thức để điều hướng
        if (payment === "card") {
          navigate("/qr", {
            state: {
              totalPrice: totalPrice,
              orderId: res.data.data.order_id,
            },
          });
        } else {
          navigate("/success");
        }
      } else {
        alert("Thanh toán thất bại");
      }
    } catch (err: any) {
      console.log("CHECKOUT ERROR:", err?.response?.data);
      alert("Có lỗi xảy ra");
    }
  }; // <--- Đóng hàm handleCheckout ở đây

  if (loading) return <div>Đang tải...</div>;

  return (
    <MainLayout>
      <div className="checkout-container">
        <h2 className="checkout-title">🧾 Thanh toán đơn hàng</h2>

        <div className="checkout-grid">
          {/* LEFT */}
          <div className="checkout-left">
            <div className="card">
              <h3>Thông tin nhận hàng</h3>

              <form
                id="checkout-form"
                onSubmit={handleCheckout}
                data-total={totalPrice}
              >
                <div className="form-row">
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Họ và tên"
                    required
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    required
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Địa chỉ nhận hàng"
                  required
                />

                <textarea name="note" placeholder="Ghi chú (không bắt buộc)" />

                <h4>Phương thức thanh toán</h4>

                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      defaultChecked
                    />
                    💵 Thanh toán khi nhận hàng
                  </label>

                  <label>
                    <input type="radio" name="payment" value="card" />
                    🏦 Chuyển khoản ngân hàng
                  </label>
                </div>

                <button type="submit" className="btn-order">
                  🚀 Đặt hàng ngay
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT */}
          <div className="checkout-right">
            <div className="card sticky">
              <h3>🛒 Đơn hàng của bạn</h3>

              <div className="order-list">
                {items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div>
                      <p className="product-name">{item.product.name}</p>
                      <span className="quantity">x{item.quantity}</span>
                    </div>

                    <div className="price">{formatPrice(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;

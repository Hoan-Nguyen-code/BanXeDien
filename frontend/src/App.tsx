import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Info from "./pages/Info";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import News from "./pages/News";
import Admin_dashboard from "./pages/admin/Admin_dashboard";
import Admin_orders from "./pages/admin/Admin_orders";
import ForgetPassword from "./pages/authentication/ForgetPassword";
import PasswordResetEmail from "./pages/authentication/PasswordResetEmail";
import PasswordResetForm from "./pages/authentication/PasswordResetForm";
import Cart from "./pages/payment/Cart";
import Checkout from "./pages/payment/Checkout";
import Qr from "./pages/payment/Qr";
import Success from "./pages/payment/Success";
import Map from "./pages/map/Map";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/info" element={<Info />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/news" element={<News />} />

        <Route path="/admin/dashboard" element={<Admin_dashboard />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/qr" element={<Qr />} />

        <Route path="/success" element={<Success />} />

        <Route path="/map" element={<Map />} />

        <Route
          path="/admin/orders"
          element={
            <Admin_orders
              orders={[]}
              stats={{
                total: 0,
                pending: 0,
                confirmed: 0,
                shipping: 0,
              }}
              pagination={{
                current_page: 1,
                total_pages: 1,
                has_previous: false,
                has_next: false,
              }}
              statusFilter=""
              adminName="Admin"
            />
          }
        />

        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:uidb64/:token"
          element={<PasswordResetForm />}
        />
        <Route
          path="/password-reset-email"
          element={
            <PasswordResetEmail
              username="admin"
              resetLink="http://localhost:5173/reset-password/demo/demo"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

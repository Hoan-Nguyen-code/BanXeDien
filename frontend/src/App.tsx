// src/App.tsx

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

import { Admin_Users } from "./pages/admin/Admin_Users";
import { Admin_Kho } from "./pages/admin/Admin_Kho";
import { Admin_Tai_Chinh } from "./pages/admin/Admin_Tai_Chinh";
import { Admin_Stations } from "./pages/admin/Admin_Stations";

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

        <Route path="/admin/orders" element={<Admin_orders />} />

        {/* TUYẾN ĐƯỜNG QUẢN LÝ THÀNH VIÊN */}
        <Route path="/admin/users" element={<Admin_Users />} />

        {/* TUYẾN ĐƯỜNG QUẢN LÝ KHO HÀNG */}
        <Route path="/admin/kho" element={<Admin_Kho />} />

        {/* TUYẾN ĐƯỜNG QUẢN LÝ TRẠM SẠC */}
        <Route path="/admin/tramsac" element={<Admin_Stations />} />

        {/* ✅ ĐÃ THÊM: TUYẾN ĐƯỜNG BÁO CÁO TÀI CHÍNH */}
        <Route path="/admin/taichinh" element={<Admin_Tai_Chinh />} />

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

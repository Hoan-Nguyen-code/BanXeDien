import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Info from "./pages/Info";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import Admin_dashboard from "./pages/admin/Admin_dashboard";
import Admin_orders from "./pages/admin/Admin_orders";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

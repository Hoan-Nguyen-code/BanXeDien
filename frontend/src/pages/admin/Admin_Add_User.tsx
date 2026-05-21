import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Admin_Add_User: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
    is_active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("admin/users/add/", formData);

      console.log("ADD USER SUCCESS:", response.data);

      alert("Thêm user thành công!");

      navigate("/admin/users");
    } catch (error: any) {
      console.error("ADD USER ERROR:", error.response?.data || error.message);

      alert(error.response?.data?.error || "Không thể thêm user!");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Thêm User</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="first_name"
          placeholder="First name"
          value={formData.first_name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <br />
        <br />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <br />
        <br />

        <button type="submit">Thêm User</button>
      </form>
    </div>
  );
};

export default Admin_Add_User;

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  // BẮT BUỘC: Cho phép gửi và nhận cookie giữa React và Django
  withCredentials: true,
  // Tự động lấy token từ cookie có tên 'csrftoken' và gắn vào Header 'X-CSRFToken'
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

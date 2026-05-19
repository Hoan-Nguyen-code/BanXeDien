import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  // BẮT BUỘC: Cho phép gửi và nhận cookie giữa React và Django
  withCredentials: true,
  // Tự động lấy token từ cookie có tên 'csrftoken' và gắn vào Header 'X-CSRFToken'
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
});

export default api;

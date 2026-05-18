import api from "../../services/api";
import { getCookie } from "../../assets/js/csrf";

declare global {
  interface Window {
    showNotification?: (message: string, type: string) => void;
  }
}

export const handleAddToCart = async (productId: number) => {
  try {
    const csrfToken = getCookie("csrftoken");

    const response = await api.post(
      `/add-to-cart/${productId}/`,
      {},
      {
        withCredentials: true, // ✔ GIỮ NGUYÊN - bắt buộc với Django session
        headers: {
          "X-CSRFToken": csrfToken || "", // ✔ FIX CHÍNH Ở ĐÂY
        },
      },
    );

    if (window.showNotification) {
      window.showNotification(
        response.data.message || "Đã thêm vào giỏ hàng 😍",
        "success",
      );
    } else {
      alert(response.data.message);
    }
  } catch (error: any) {
    console.log(error?.response?.data);

    if (error.response?.status === 401) {
      alert("Vui lòng đăng nhập");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // ✔ FIX THÊM CASE RÕ HƠN
      alert(
        error.response?.data?.detail ||
          "CSRF token hoặc quyền truy cập bị từ chối",
      );
    } else {
      alert("Có lỗi xảy ra");
    }
  }
};

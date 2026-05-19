// src/assets/js/cart.ts

import api from "../../services/api";

// =========================
// XÓA SẢN PHẨM KHỎI GIỎ
// =========================
export const removeCartItem = async (
  itemId: number,
  refreshCart: () => void,
) => {
  try {
    await api.delete(`/remove-from-cart/${itemId}/`);

    refreshCart();
  } catch (error: any) {
    console.log(error?.response?.data);
    alert("Không thể xóa sản phẩm!");
  }
};

// =========================
// TĂNG SỐ LƯỢNG
// =========================
export const increaseQuantity = async (
  itemId: number,
  refreshCart: () => void,
) => {
  try {
    await api.post(`/increase-quantity/${itemId}/`);

    refreshCart();
  } catch (error: any) {
    console.log(error?.response?.data);
    alert("Không thể tăng số lượng!");
  }
};

// =========================
// GIẢM SỐ LƯỢNG
// Nếu quantity <= 1
// backend sẽ tự xóa sản phẩm
// =========================
export const decreaseQuantity = async (
  itemId: number,
  refreshCart: () => void,
) => {
  try {
    await api.post(`/decrease-quantity/${itemId}/`);

    refreshCart();
  } catch (error: any) {
    console.log(error?.response?.data);
    alert("Không thể giảm số lượng!");
  }
};

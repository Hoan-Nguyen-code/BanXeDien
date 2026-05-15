// admin_orders.ts

export const setupDeleteOrderButtons = (): void => {
  const deleteButtons = document.querySelectorAll(
    ".btn-delete-order",
  ) as NodeListOf<HTMLButtonElement>;

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.id;
      const deleteUrl = btn.dataset.url;

      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa đơn hàng #${orderId}?\nHành động này không thể hoàn tác!`,
      );

      if (confirmed && deleteUrl) {
        window.location.href = deleteUrl;
      }
    });
  });
};

export const setupAlertAutoHide = (): void => {
  const alerts = document.querySelectorAll(".alert") as NodeListOf<HTMLElement>;

  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "opacity 0.5s ease";
      alert.style.opacity = "0";

      setTimeout(() => {
        alert.remove();
      }, 500);
    }, 4000);
  });
};

export const filterStatus = (value: string): void => {
  if (value === "") {
    window.location.href = window.location.pathname;
  } else {
    window.location.href = window.location.pathname + "?status=" + value;
  }
};

export const initializeOrdersPage = (): void => {
  setupDeleteOrderButtons();
  setupAlertAutoHide();
};

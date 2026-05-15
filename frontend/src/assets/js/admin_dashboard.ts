export const initAdminDashboard = (): void => {
  const alerts = document.querySelectorAll<HTMLElement>(".alert");

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

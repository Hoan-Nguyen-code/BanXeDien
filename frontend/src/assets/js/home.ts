declare global {
  interface Window {
    addToCartInitialized?: boolean;
  }
}

export default function initHome(): void {
  const productCards = document.querySelectorAll<HTMLElement>(".product-card");

  const productsGrid = document.querySelector<HTMLElement>(".products-grid");

  const searchInput =
    document.querySelector<HTMLInputElement>('input[name="q"]');

  const viewButtons = document.querySelectorAll<HTMLButtonElement>(".view-btn");

  function showNotification(message: string, type: string = "info"): void {
    const old = document.querySelector(".notification");

    if (old) old.remove();

    const notification = document.createElement("div");

    notification.className = `notification notification-${type}`;

    notification.innerHTML = `
      <i class="fas fa-${getIcon(type)}"></i>
      <span>${message}</span>
    `;

    Object.assign(notification.style, {
      position: "fixed",
      top: "90px",
      right: "30px",
      background: getColor(type),
      color: "white",
      padding: "14px 22px",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      fontWeight: "600",
      zIndex: "9999",
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  function getIcon(type: string): string {
    return (
      {
        success: "check-circle",
        error: "exclamation-circle",
        warning: "exclamation-triangle",
        info: "info-circle",
      }[type] || "info-circle"
    );
  }

  function getColor(type: string): string {
    return (
      {
        success: "linear-gradient(135deg,#00c896,#00b383)",
        error: "linear-gradient(135deg,#ff4757,#ff3838)",
        warning: "linear-gradient(135deg,#ffa502,#ff8c00)",
        info: "linear-gradient(135deg,#007bff,#0056b3)",
      }[type] || "linear-gradient(135deg,#007bff,#0056b3)"
    );
  }

  const cartCountElement = document.getElementById("cart-count");

  // tránh add event nhiều lần
  if (!window.addToCartInitialized) {
    document.addEventListener("click", function (e: Event) {
      const target = e.target as HTMLElement;

      const button = target.closest(".add-to-cart-btn") as HTMLElement | null;

      if (!button) return;

      e.preventDefault();

      if (button.classList.contains("loading")) return;

      button.classList.add("loading");

      const url = button.getAttribute("data-url");

      if (!url) return;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showNotification("Đã thêm sản phẩm vào giỏ hàng 😍", "success");

            if (cartCountElement) {
              cartCountElement.textContent = data.cart_count;
            }

            if (window.location.pathname.includes("cart")) {
              setTimeout(() => {
                window.location.reload();
              }, 800);
            }
          } else if (data.error === "login_required") {
            showNotification("Vui lòng đăng nhập", "warning");

            window.location.href = "/login/";
          }
        })
        .finally(() => {
          setTimeout(() => {
            button.classList.remove("loading");
          }, 500);
        });
    });

    window.addToCartInitialized = true;
  }

  // view mode
  if (productsGrid) {
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        viewButtons.forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");

        const viewType = button.getAttribute("data-view");

        if (viewType === "list") {
          productsGrid.style.gridTemplateColumns = "1fr";

          productCards.forEach((card) => {
            card.style.display = "flex";
            card.style.alignItems = "center";
            card.style.gap = "20px";
          });
        } else {
          productsGrid.style.gridTemplateColumns = "";

          productCards.forEach((card) => {
            card.style.display = "";
            card.style.alignItems = "";
            card.style.gap = "";
          });
        }
      });
    });
  }

  // search
  if (searchInput && productCards.length > 0) {
    searchInput.addEventListener("input", function () {
      const keyword = searchInput.value.toLowerCase().trim();

      productCards.forEach((card) => {
        const name =
          card.querySelector(".product-name")?.textContent?.toLowerCase() || "";

        const desc =
          card
            .querySelector(".product-description")
            ?.textContent?.toLowerCase() || "";

        card.style.display =
          name.includes(keyword) || desc.includes(keyword) ? "" : "none";
      });
    });
  }

  // dropdown
  const dropdown = document.querySelector<HTMLElement>(".sort-dropdown");

  if (dropdown) {
    const selected = dropdown.querySelector<HTMLElement>(".sort-selected");

    const options = dropdown.querySelector<HTMLElement>(".sort-options");

    const selectedText = document.getElementById("selected-text");

    const hiddenInput = document.getElementById(
      "sort-input",
    ) as HTMLInputElement | null;

    selected?.addEventListener("click", (e) => {
      e.stopPropagation();

      dropdown.classList.toggle("open");
    });

    options?.querySelectorAll("li").forEach((option) => {
      option.addEventListener("click", () => {
        options
          .querySelectorAll("li")
          .forEach((o) => o.classList.remove("active"));

        option.classList.add("active");

        if (selectedText) {
          selectedText.textContent = option.textContent;
        }

        if (hiddenInput) {
          hiddenInput.value = option.getAttribute("data-value") || "";
        }

        dropdown.classList.remove("open");
      });
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });
  }

  // slider
  const slider = document.querySelector<HTMLElement>(".banner-slider")!;

  const track = document.querySelector<HTMLElement>(".banner-track")!;

  if (!slider || !track) {
    return;
  }

  const slides = track.querySelectorAll<HTMLImageElement>("img");

  let index = 0;

  function updateBackground(): void {
    slider.style.backgroundImage = `url(${slides[index].src})`;
  }

  function moveSlide(): void {
    index++;

    if (index >= slides.length) {
      index = 0;
    }

    track.style.transform = `translateX(-${index * 100}%)`;

    updateBackground();
  }

  updateBackground();

  let interval = setInterval(moveSlide, 3000);

  slider.addEventListener("mouseenter", () => {
    clearInterval(interval);
  });

  slider.addEventListener("mouseleave", () => {
    interval = setInterval(moveSlide, 3000);
  });

  console.log("home.ts initialized");
}

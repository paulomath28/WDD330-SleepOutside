
import {
    getLocalStorage,
    updateCartCount,
    loadHeaderFooter,
    setLocalStorage,
  } from "./utils.mjs";
  
  function renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    // ✅ Show cart total if cart is not empty
    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
      const cartFooter = document.querySelector(".cart-footer");
      const totalDisplay = cartFooter.querySelector(".cart-total");
      totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
      cartFooter.classList.remove("hide");
    }
    removeItemFromCartListener();
  }
  
  function cartItemTemplate(item) {
    const colorName = item.Colors?.[0]?.ColorName || "No Color";
    return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="Image of ${item.Name}" />
  
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-item-button" data-id="${item.Id}">Remove</button>
    </li>`;
  }
  
  function removeItemFromCart(itemId) {
    let cartItems = getLocalStorage("so-cart");
  
    if (cartItems && cartItems.length > 0) {
  
      // Filter item by id
      cartItems = cartItems.filter((item) => item.Id !== itemId);
  
      // Update local storage with the new cart
      setLocalStorage("so-cart", cartItems);
  
      // Re-render the cart contents
      renderCartContents();
  
      // Update cart item count
      updateCartCount();
    }
  }
  
  function removeItemFromCartListener() {
    document.querySelectorAll(".remove-item-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        removeItemFromCart(itemId);
      });
    });
  }
  
  renderCartContents();
  
  // display cart count
  updateCartCount();
  
  // load header and footer
  loadHeaderFooter();
  
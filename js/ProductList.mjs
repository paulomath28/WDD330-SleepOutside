
import {
    getLocalStorage,
    setLocalStorage,
    updateCartCount
  } from "./utils.mjs";
  
  function productCardTemplate(product) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
    );
    const hasDiscount = discount > 0;
  
    return `<li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images?.PrimaryMedium || "/images/default.jpg"}" alt="Image of ${product.Name}" />
  
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
  
        <div class="price-container">
          ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
          <p class="product-card__price">
            ${hasDiscount ? `<s>$${product.SuggestedRetailPrice.toFixed(2)}</s> ` : ""}
            <strong>$${product.FinalPrice.toFixed(2)}</strong>
          </p>
        </div>
      </a>
      <button class="add-to-cart-btn" data-id="${product.Id}">Add to Cart</button>
    </li>`;
  }
  
  export default class ProductList {
    constructor(category, dataSource, listElement) {
      this.category = category;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.originalList = [];
    }
  
    async init() {
      const products = await this.dataSource.getData(this.category);
      this.originalList = products;
      this.renderList(products);
      this.addCartEventListeners(products);
      document.getElementById("sort").addEventListener("change", (e) =>
        this.sortList(e.target.value)
      );
    }
  
    renderList(productList) {
      this.listElement.innerHTML = productList
        .map(product => productCardTemplate(product))
        .join("");
    }
  
    addCartEventListeners(products) {
      document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
          const productId = button.dataset.id;
          const product = products.find(p => p.Id === productId);
  
          let cart = getLocalStorage("so-cart") || [];
          cart.push(product);
          setLocalStorage("so-cart", cart);
          updateCartCount();
  
          // ✅ Redirect to the cart page
          window.location.href = "/cart/index.html";
        });
      });
    }
  
    sortList(criteria) {
      let sortedList = [...this.originalList];
  
      switch (criteria) {
        case "price-asc":
          sortedList.sort((a, b) => a.FinalPrice - b.FinalPrice);
          break;
        case "price-des":
          sortedList.sort((a, b) => b.FinalPrice - a.FinalPrice);
          break;
        case "name-asc":
          sortedList.sort((a, b) => a.NameWithoutBrand.localeCompare(b.NameWithoutBrand));
          break;
        case "name-des":
          sortedList.sort((a, b) => b.NameWithoutBrand.localeCompare(a.NameWithoutBrand));
          break;
        default:
          break;
      }
  
      this.renderList(sortedList);
    }
  }
  
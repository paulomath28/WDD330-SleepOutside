
import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

// function productDetailsTemplate(product) {
//     const discount = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
//     const hasDiscount = discount > 0;

//     return `<section class="product-detail">
//         <h3>${product.Brand.Name}</h3>
//         <h2 class="divider">${product.NameWithoutBrand}</h2>
//         <img class="divider" src="${product.Image}" alt="${product.NameWithoutBrand}" />
//         <div class="price-container">
//           ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
//           <p class="product-card__price">
//             Was: <s>$${product.SuggestedRetailPrice.toFixed(2)}</s>
//             Now: <strong>$${product.FinalPrice.toFixed(2)}</strong>
//           </p>
//         </div>
//         <p class="product__color">${product.Colors[0].ColorName}</p>
//         <p class="product__description">${product.DescriptionHtmlSimple}</p>
//         <div class="product-detail__add">
//             <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//         </div>
//     </section>`;
// }

function productDetailsTemplate(product) {
    const discount = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    const hasDiscount = discount > 0;

    document.querySelector("h2").textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
    document.querySelector("#p-brand").textContent = product.Brand.Name;
    document.querySelector("#p-name").textContent = product.NameWithoutBrand;
  
    const productImage = document.querySelector("#p-image");
    productImage.src = product.Images.PrimaryExtraLarge;
    productImage.alt = product.NameWithoutBrand;

  document.querySelector("#p-price").innerHTML = `
        <div class="price-container">
            ${hasDiscount ? `<span class="discount-badge">${discount}% OFF</span>` : ""}
            <p class="product-card__price">
                Was: <s>$${product.SuggestedRetailPrice.toFixed(2)}</s>
                Now: <strong>$${product.FinalPrice.toFixed(2)}</strong>
            </p>
        </div>
    `;

    document.querySelector("#p-color").textContent = product.Colors[0].ColorName;
    document.querySelector("#p-description").innerHTML = product.DescriptionHtmlSimple;
  
    document.querySelector("#addToCart").dataset.id = product.Id;
}

export default class ProductDetails {
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
      }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails()
        document
            .getElementById("addToCart")
            .addEventListener("click", () => this.addProductToCart(this.product));
    }

    addProductToCart(product) {

        product.Image = product.Images?.PrimarySmall || "";

        let cartItems = getLocalStorage("so-cart");
        if (!Array.isArray(cartItems)) {
            cartItems = [];
        }
        cartItems.push(product);
        setLocalStorage("so-cart", cartItems);
        updateCartCount();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

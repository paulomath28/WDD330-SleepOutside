
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount, loadHeaderFooter, getParam } from "./utils.mjs";

const searchQuery = getParam("search")?.toLowerCase();
const category = getParam("category");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

async function init() {
  let products = [];

  if (searchQuery) {
    // search across all categories
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    for (let cat of categories) {
      const catProducts = await dataSource.getData(cat);
      products.push(...catProducts);
    }

    // filter based on search term
    products = products.filter(
      (product) =>
        product.Name.toLowerCase().includes(searchQuery) ||
        product.DescriptionHtmlSimple.toLowerCase().includes(searchQuery),
    );

    // DEBUG: See which products matched the search
    // console.log("Filtered product results:", products);
  } else {
    // fallback to a single category
    products = await dataSource.getData(category || "tents");
  }

  const listing = new ProductList(
    searchQuery || category || "Search Results",
    {
      getData: () => products,
    },
    element,
  );

  await listing.init();
}

init();

// display cart count
updateCartCount();

// load header and footer
loadHeaderFooter();

// This service simulates a shared database for products across users

// Type definition for product
export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  image: string;
  location?: string;
  expiryDate?: string;
  isPosted?: boolean;
  rating?: number;
  sellerId?: string;
}

// Shared storage for products (simulates a database)
let sharedProducts: Product[] = [];

// Initialize from localStorage if available
const initializeFromLocalStorage = () => {
  try {
    // First check for sharedProducts
    const savedProducts = localStorage.getItem("sharedProducts");
    if (savedProducts) {
      sharedProducts = JSON.parse(savedProducts);
    } else {
      // If no sharedProducts, check for sellerProducts for backward compatibility
      const sellerProducts = localStorage.getItem("sellerProducts");
      if (sellerProducts) {
        const parsedProducts = JSON.parse(sellerProducts);
        sharedProducts = parsedProducts;
        // Save to sharedProducts for future use
        localStorage.setItem("sharedProducts", JSON.stringify(parsedProducts));
      }
    }
  } catch (error) {
    console.error("Error loading shared products:", error);
  }
};

// Initialize on service load
initializeFromLocalStorage();

// Save to both shared storage and localStorage
const saveProducts = (products: Product[]) => {
  sharedProducts = products;
  try {
    localStorage.setItem("sharedProducts", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving shared products:", error);
  }
};

// Get all products
export const getAllProducts = (): Product[] => {
  return [...sharedProducts];
};

// Get posted products only
export const getPostedProducts = (sellerId?: string | null): Product[] => {
  // If sellerId is provided, filter by seller, otherwise return all posted products
  return sellerId
    ? sharedProducts.filter(
        (p) => p.isPosted === true && p.sellerId === sellerId,
      )
    : sharedProducts.filter((p) => p.isPosted === true);
};

// Add or update a product
export const saveProduct = (product: Product, sellerId?: string): void => {
  const index = sharedProducts.findIndex((p) => p.id === product.id);

  // Ensure the product has a sellerId
  const productWithSellerId = {
    ...product,
    sellerId: product.sellerId || sellerId,
  };

  if (index !== -1) {
    // Update existing product
    sharedProducts[index] = productWithSellerId;
  } else {
    // Add new product
    sharedProducts.push(productWithSellerId);
  }

  saveProducts(sharedProducts);
};

// Remove a product
export const removeProduct = (productId: string | number): void => {
  // Filter out the product with the matching ID
  sharedProducts = sharedProducts.filter((p) => p.id !== productId);
  // Save the updated products list to ensure it's removed from both seller dashboard and customer site
  saveProducts(sharedProducts);
  // Dispatch an event to notify components that a product has been removed
  const event = new CustomEvent("productRemoved", {
    detail: { productId },
  });
  document.dispatchEvent(event);
};

// Update a product's posted status
export const updateProductPostedStatus = (
  productId: string | number,
  isPosted: boolean,
): void => {
  const index = sharedProducts.findIndex((p) => p.id === productId);

  if (index !== -1) {
    sharedProducts[index] = {
      ...sharedProducts[index],
      isPosted,
    };
    saveProducts(sharedProducts);
  }
};

// Save multiple products at once
export const saveMultipleProducts = (
  products: Product[],
  sellerId?: string,
): void => {
  // If sellerId is provided, ensure all products have it
  const productsWithSellerId = sellerId
    ? products.map((product) => ({
        ...product,
        sellerId: product.sellerId || sellerId,
        // Ensure these fields are preserved
        location: product.location || "",
        expiryDate:
          product.expiryDate || new Date().toISOString().split("T")[0],
        stock: product.stock || 0,
      }))
    : products;

  // Get all existing products from other sellers
  const existingProducts = sharedProducts.filter((p) =>
    sellerId ? p.sellerId !== sellerId : true,
  );

  // Merge the existing products with the new/updated ones
  const mergedProducts = [...existingProducts, ...productsWithSellerId];

  // Save the merged list
  saveProducts(mergedProducts);
};

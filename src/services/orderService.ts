import { CartItem } from "@/context/CartContext";
import { getAllProducts } from "./productService";

export interface Order {
  id: string;
  date: string;
  total: number;
  currency: string;
  status: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price?: number;
    sellerId?: string;
  }>;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod?: string;
  customerId?: string;
  customerName?: string;
}

// Save orders to localStorage
export const saveOrder = (order: Order, userId?: string): void => {
  try {
    // Get existing orders for this user
    const existingOrders = getOrders(userId);

    // Add new order
    const updatedOrders = [...existingOrders, order];

    // Save to localStorage with user-specific key if userId is provided
    const storageKey = userId ? `milkShopOrders_${userId}` : "milkShopOrders";
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
  } catch (error) {
    console.error("Error saving order:", error);
  }
};

// Save orders for sellers based on products in the order
export const saveOrdersForSellers = (order: Order): void => {
  try {
    // Group items by seller
    const itemsBySeller: Record<string, any[]> = {};

    order.items.forEach((item) => {
      if (item.sellerId) {
        if (!itemsBySeller[item.sellerId]) {
          itemsBySeller[item.sellerId] = [];
        }
        itemsBySeller[item.sellerId].push(item);
      }
    });

    // Create and save an order for each seller
    Object.entries(itemsBySeller).forEach(([sellerId, items]) => {
      // Calculate total for just this seller's items
      const sellerTotal = items.reduce((sum, item) => {
        return sum + (item.price || 0) * item.quantity;
      }, 0);
      const tax = sellerTotal * 0.08;
      const finalTotal = sellerTotal + tax;

      // Create seller-specific order
      const sellerOrder = {
        ...order,
        id: `${order.id}-${sellerId.substring(0, 4)}`,
        items: items,
        total: finalTotal,
        // Include customer information for the seller
        customerId: order.customerId,
        customerName: order.customerName,
        // Ensure the sellerId is explicitly set for each seller's order
        sellerId: sellerId,
        shippingAddress: order.shippingAddress, // Make sure shipping address is included
      };

      // Get existing orders for this seller
      const sellerOrders = getSellerOrders(sellerId);
      const updatedSellerOrders = [...sellerOrders, sellerOrder];

      // Save to localStorage with seller-specific key
      localStorage.setItem(
        `milkShopSellerOrders_${sellerId}`,
        JSON.stringify(updatedSellerOrders),
      );

      // Also save to a global list of all seller orders for easier access
      const allSellerOrders = JSON.parse(
        localStorage.getItem("milkShopAllSellerOrders") || "[]",
      );
      allSellerOrders.push(sellerOrder);
      localStorage.setItem(
        "milkShopAllSellerOrders",
        JSON.stringify(allSellerOrders),
      );

      console.log(`Order saved for seller ${sellerId}:`, sellerOrder);

      // Dispatch an event to notify components that a new order has been placed
      const event = new CustomEvent("newOrderPlaced", {
        detail: { sellerId, order: sellerOrder },
      });
      document.dispatchEvent(event);

      // Also dispatch an event to update the customer's order status
      const customerEvent = new CustomEvent("orderStatusUpdated", {
        detail: { orderId: order.id, status: order.status },
      });
      document.dispatchEvent(customerEvent);
    });
  } catch (error) {
    console.error("Error saving orders for sellers:", error);
  }
};

// Get all orders from localStorage
export const getOrders = (userId?: string): Order[] => {
  try {
    // If userId is provided, get orders specific to that user
    const storageKey = userId ? `milkShopOrders_${userId}` : "milkShopOrders";
    const savedOrders = localStorage.getItem(storageKey);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error("Error getting orders:", error);
    return [];
  }
};

// Get seller orders from localStorage
export const getSellerOrders = (sellerId?: string): Order[] => {
  try {
    if (!sellerId) return [];

    const storageKey = `milkShopSellerOrders_${sellerId}`;
    const savedOrders = localStorage.getItem(storageKey);
    return savedOrders ? JSON.parse(savedOrders) : [];
  } catch (error) {
    console.error("Error getting seller orders:", error);
    return [];
  }
};

// Update an order's status
export const updateOrderStatus = (
  orderId: string,
  status: string,
  userId?: string,
): void => {
  try {
    const orders = getOrders(userId);
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });

    const storageKey = userId ? `milkShopOrders_${userId}` : "milkShopOrders";
    localStorage.setItem(storageKey, JSON.stringify(updatedOrders));

    // Also update seller's view of the order if it's a seller order
    if (
      status === "delivered" ||
      status === "ongoing" ||
      status === "cancelled"
    ) {
      const allOrders = localStorage.getItem("milkShopAllOrders");
      if (allOrders) {
        const parsedOrders = JSON.parse(allOrders);
        const updatedAllOrders = parsedOrders.map((order: Order) => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
        localStorage.setItem(
          "milkShopAllOrders",
          JSON.stringify(updatedAllOrders),
        );
      }
    }

    // Dispatch an event to notify components about the status update
    const event = new CustomEvent("orderStatusUpdated", {
      detail: { orderId, status },
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

// Generate a unique order ID
export const generateOrderId = (): string => {
  return "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create a new order from cart items
export const createOrderFromCart = (
  cartItems: CartItem[],
  shippingInfo: any,
  paymentMethod: string,
  customerId?: string,
  customerName?: string,
): Order => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = total * 0.08;
  const finalTotal = total + tax;

  // Get all products to find seller IDs
  const allProducts = getAllProducts();

  // Create order items with seller information
  const itemsWithSellers = cartItems.map((item) => {
    const product = allProducts.find((p) => p.id === item.id);
    return {
      id: String(item.id),
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      sellerId: product?.sellerId || undefined,
    };
  });

  // Make sure we have at least one valid sellerId
  const hasValidSeller = itemsWithSellers.some((item) => item.sellerId);

  if (!hasValidSeller) {
    console.warn("Warning: No valid seller IDs found for items in cart");
  }

  return {
    id: generateOrderId(),
    date: new Date().toISOString().split("T")[0],
    total: finalTotal,
    currency: "₱",
    status: "checkout", // Changed from 'processing' to 'checkout'
    items: itemsWithSellers,
    shippingAddress: shippingInfo,
    paymentMethod,
    customerId,
    customerName,
  };
};

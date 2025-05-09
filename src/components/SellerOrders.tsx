import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, ShoppingBag, Bell } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";
import { getSellerOrders } from "@/services/orderService";

const SellerOrders: FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserType(user.user_metadata?.user_type || null);
      }
    };

    checkUser();
  }, []);

  // Get orders from localStorage or use empty array for new sellers
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      customerName?: string;
      date: string;
      total: number;
      status: string;
      items: Array<{ name: string; quantity: number }>;
      sellerId?: string;
      customerId?: string;
    }>
  >([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    // Load orders specific to this seller
    const loadSellerOrders = async () => {
      const user = await getCurrentUser();
      if (user) {
        const sellerId = user.id;

        // First try to get orders specific to this seller
        let sellerOrders = getSellerOrders(sellerId);

        // If no orders found, check if there are any in the global list that match this seller
        if (sellerOrders.length === 0) {
          try {
            const allSellerOrders = JSON.parse(
              localStorage.getItem("milkShopAllSellerOrders") || "[]",
            );
            const matchingOrders = allSellerOrders.filter(
              (order: any) => order.sellerId === sellerId,
            );

            if (matchingOrders.length > 0) {
              // Save these orders to the seller-specific storage
              localStorage.setItem(
                `milkShopSellerOrders_${sellerId}`,
                JSON.stringify(matchingOrders),
              );
              sellerOrders = matchingOrders;
            }
          } catch (error) {
            console.error("Error checking global seller orders:", error);
          }
        }

        // Filter out orders that don't belong to this seller
        sellerOrders = sellerOrders.filter(
          (order) => order.sellerId === sellerId,
        );

        // Count new orders (checkout status)
        const newOrders = sellerOrders.filter(
          (order) => order.status === "checkout",
        );
        setNewOrdersCount(newOrders.length);

        setOrders(sellerOrders);
      }
    };

    loadSellerOrders();

    // Listen for new orders being placed
    const handleNewOrder = (event: CustomEvent) => {
      const { sellerId, order } = event.detail;

      // Check if this order is for the current seller
      getCurrentUser().then((user) => {
        if (user && user.id === sellerId) {
          // Reload the orders to include the new one
          loadSellerOrders();

          // Show notification or update UI as needed
          console.log("New order received:", order.id);
        }
      });
    };

    // Add event listener for new orders
    document.addEventListener(
      "newOrderPlaced",
      handleNewOrder as EventListener,
    );

    // Set up interval to check for new orders every 10 seconds as a fallback
    const intervalId = setInterval(loadSellerOrders, 10000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener(
        "newOrderPlaced",
        handleNewOrder as EventListener,
      );
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "checkout":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link
              to={getHomeLink(userType)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
          </div>
          <nav className="flex gap-6">
            <Link
              to="/seller/home"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/seller/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/seller/orders"
              className="text-sm font-medium text-primary flex items-center"
            >
              Orders
              {newOrdersCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {newOrdersCount}
                </span>
              )}
            </Link>
            <Link
              to="/seller/profile"
              className="text-sm font-medium hover:text-primary"
            >
              My Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

        {orders.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customerName || "Customer"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₱{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={getStatusColor(order.status)}
                        variant="outline"
                      >
                        {order.status === "checkout"
                          ? "New Order"
                          : order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/seller/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        {order.status === "checkout" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                // Update order status to ongoing
                                const updatedOrders = [...orders];
                                const index = updatedOrders.findIndex(
                                  (o) => o.id === order.id,
                                );
                                if (index !== -1) {
                                  updatedOrders[index] = {
                                    ...updatedOrders[index],
                                    status: "ongoing",
                                  };
                                  setOrders(updatedOrders);

                                  // Update in localStorage
                                  const user = getCurrentUser();
                                  user.then((userData) => {
                                    if (userData) {
                                      // Update in seller's orders
                                      localStorage.setItem(
                                        `milkShopSellerOrders_${userData.id}`,
                                        JSON.stringify(updatedOrders),
                                      );

                                      // Also update in customer's orders
                                      if (order.customerId) {
                                        const customerOrders = JSON.parse(
                                          localStorage.getItem(
                                            `milkShopOrders_${order.customerId}`,
                                          ) || "[]",
                                        );
                                        const customerOrderIndex =
                                          customerOrders.findIndex(
                                            (o) =>
                                              o.id === order.id ||
                                              o.id.startsWith(
                                                order.id.split("-")[0],
                                              ),
                                          );
                                        if (customerOrderIndex !== -1) {
                                          customerOrders[
                                            customerOrderIndex
                                          ].status = "ongoing";
                                          localStorage.setItem(
                                            `milkShopOrders_${order.customerId}`,
                                            JSON.stringify(customerOrders),
                                          );

                                          // Dispatch event to update customer's view in real-time
                                          const event = new CustomEvent(
                                            "orderStatusUpdated",
                                            {
                                              detail: {
                                                orderId:
                                                  customerOrders[
                                                    customerOrderIndex
                                                  ].id,
                                                status: "ongoing",
                                              },
                                            },
                                          );
                                          document.dispatchEvent(event);
                                        }
                                      }
                                    }
                                  });

                                  alert(
                                    "Order accepted and marked as ongoing.",
                                  );
                                }
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                // Update order status to cancelled
                                const updatedOrders = [...orders];
                                const index = updatedOrders.findIndex(
                                  (o) => o.id === order.id,
                                );
                                if (index !== -1) {
                                  updatedOrders[index] = {
                                    ...updatedOrders[index],
                                    status: "cancelled",
                                  };
                                  setOrders(updatedOrders);

                                  // Update in localStorage
                                  const user = getCurrentUser();
                                  user.then((userData) => {
                                    if (userData) {
                                      // Update in seller's orders
                                      localStorage.setItem(
                                        `milkShopSellerOrders_${userData.id}`,
                                        JSON.stringify(updatedOrders),
                                      );

                                      // Also update in customer's orders
                                      if (order.customerId) {
                                        const customerOrders = JSON.parse(
                                          localStorage.getItem(
                                            `milkShopOrders_${order.customerId}`,
                                          ) || "[]",
                                        );
                                        const customerOrderIndex =
                                          customerOrders.findIndex(
                                            (o) =>
                                              o.id === order.id ||
                                              o.id.startsWith(
                                                order.id.split("-")[0],
                                              ),
                                          );
                                        if (customerOrderIndex !== -1) {
                                          customerOrders[
                                            customerOrderIndex
                                          ].status = "cancelled";
                                          localStorage.setItem(
                                            `milkShopOrders_${order.customerId}`,
                                            JSON.stringify(customerOrders),
                                          );

                                          // Dispatch event to update customer's view in real-time
                                          const event = new CustomEvent(
                                            "orderStatusUpdated",
                                            {
                                              detail: {
                                                orderId:
                                                  customerOrders[
                                                    customerOrderIndex
                                                  ].id,
                                                status: "cancelled",
                                              },
                                            },
                                          );
                                          document.dispatchEvent(event);
                                        }
                                      }
                                    }
                                  });

                                  alert(
                                    "Order rejected and marked as cancelled.",
                                  );
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Orders will appear here when customers purchase your products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

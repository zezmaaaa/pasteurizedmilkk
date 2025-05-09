import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";
import { getOrders, updateOrderStatus } from "@/services/orderService";

const ViewOrders: FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showDelivered, setShowDelivered] = useState<boolean>(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserType(user.user_metadata?.user_type || null);
        setUser(user);
      }
    };

    checkUser();
  }, []);
  // Mock data for orders - empty array for new users
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      date: string;
      total: number;
      status: string;
      items: Array<{ name: string; quantity: number }>;
    }>
  >([]);

  // Fetch orders from localStorage
  useEffect(() => {
    const fetchUserOrders = async () => {
      // Get current user
      const user = await getCurrentUser();
      if (user) {
        // Get orders specific to this user
        const userOrders = getOrders(user.id);
        setOrders(userOrders);
      } else {
        setOrders([]);
      }
    };

    fetchUserOrders();

    // Listen for order status updates
    const handleOrderStatusUpdate = (event: CustomEvent) => {
      const { orderId, status } = event.detail;

      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          // Check if this is the order that was updated
          if (
            order.id === orderId ||
            order.id.startsWith(orderId.split("-")[0])
          ) {
            return { ...order, status };
          }
          return order;
        });
      });
    };

    // Add event listener for order status updates
    document.addEventListener(
      "orderStatusUpdated",
      handleOrderStatusUpdate as EventListener,
    );

    return () => {
      document.removeEventListener(
        "orderStatusUpdated",
        handleOrderStatusUpdate as EventListener,
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
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              to="/browse"
              className="text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className={
                !showDelivered
                  ? "bg-primary text-white hover:bg-primary/90"
                  : ""
              }
              onClick={() => setShowDelivered(false)}
            >
              Active Orders
            </Button>
            <Button
              variant="outline"
              className={
                showDelivered ? "bg-primary text-white hover:bg-primary/90" : ""
              }
              onClick={() => setShowDelivered(true)}
            >
              Order History
            </Button>
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders
              .filter((order) =>
                showDelivered
                  ? order.status === "delivered"
                  : order.status !== "delivered",
              )
              .map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <div className="flex flex-wrap justify-between items-center mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{order.id}</h2>
                      <p className="text-gray-600">Ordered on {order.date}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={getStatusColor(order.status)}
                        variant="outline"
                      >
                        {order.status === "checkout"
                          ? "Checked Out"
                          : order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                      </Badge>
                      <div className="flex ml-4 gap-2">
                        <Button variant="outline" asChild>
                          <Link to={`/customer/orders/${order.id}`}>
                            View Details
                          </Link>
                        </Button>
                        {order.status === "ongoing" && (
                          <Button
                            variant="default"
                            onClick={() => {
                              // Update order status to delivered
                              const updatedOrders = [...orders];
                              const index = updatedOrders.findIndex(
                                (o) => o.id === order.id,
                              );
                              if (index !== -1) {
                                updatedOrders[index] = {
                                  ...updatedOrders[index],
                                  status: "delivered",
                                };
                                setOrders(updatedOrders);

                                // Update in storage
                                updateOrderStatus(
                                  order.id,
                                  "delivered",
                                  user?.id,
                                );

                                alert(
                                  "Order marked as delivered. Thank you for your purchase!",
                                );
                              }
                            }}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-sm">
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-semibold">
                      Total: ₱{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {showDelivered ? (
              <>
                <p className="text-xl mb-6">No completed orders yet</p>
                <p className="text-gray-600 mb-6">
                  Your order history will appear here after your orders are
                  delivered
                </p>
                <Button onClick={() => setShowDelivered(false)}>
                  View Active Orders
                </Button>
              </>
            ) : (
              <>
                <p className="text-xl mb-6">
                  You haven't placed any orders yet
                </p>
                <p className="text-gray-600 mb-6">
                  Your order history will appear here after you complete a
                  purchase
                </p>
                <Button asChild>
                  <Link to="/browse">Start Shopping</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;

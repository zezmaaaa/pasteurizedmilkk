import { FC, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import { getAllProducts } from "@/services/productService";

const SellerPurchasedOrderDetail: FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [orderProducts, setOrderProducts] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserType(user.user_metadata?.user_type || null);
        setUser(user);

        // Get orders for this user
        const userOrders = getOrders(user.id);
        const foundOrder = userOrders.find((o) => o.id === orderId);
        if (foundOrder) {
          setOrder(foundOrder);

          // Get product details for each item in the order
          const allProducts = getAllProducts();
          const productsWithDetails = foundOrder.items.map((item: any) => {
            const productDetails = allProducts.find(
              (p) => p.id === item.id,
            ) || { image: "", price: 0, sellerId: null };
            return {
              ...item,
              image:
                productDetails.image ||
                "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
              price: item.price || productDetails.price || 0,
              sellerId: productDetails.sellerId || null,
            };
          });
          setOrderProducts(productsWithDetails);
        } else {
          // Order not found, redirect to orders page
          navigate("/seller/purchased-orders");
        }
      } else {
        // Not logged in, redirect to login
        navigate("/seller/login");
      }
    };

    checkUser();
  }, [orderId, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMarkDelivered = () => {
    if (order && user) {
      const updatedOrder = { ...order, status: "delivered" };
      updateOrderStatus(orderId!, "delivered", user.id);
      setOrder(updatedOrder);
      alert("Order marked as delivered. Thank you for your purchase!");
    }
  };

  if (!order) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/seller/home" className="flex items-center gap-2">
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
              className="text-sm font-medium hover:text-primary"
            >
              Orders
            </Link>
            <Link
              to="/seller/profile"
              className="text-sm font-medium hover:text-primary"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/seller/purchased-orders">← Back to Orders</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Order {order.id}</h1>
              <p className="text-gray-600">Placed on {order.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(order.status)} variant="outline">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              {order.status === "ongoing" && (
                <Button
                  onClick={handleMarkDelivered}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Shipping Address</h2>
              {order.shippingAddress ? (
                <>
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </>
              ) : (
                <p>No shipping information available</p>
              )}
            </div>
            <div>
              <h2 className="font-semibold mb-2">Payment Method</h2>
              <p>{order.paymentMethod || "Not specified"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderProducts.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden flex flex-col"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-t"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="mt-2 flex-1">
                    <p className="text-gray-600">
                      {order.currency || "₱"}
                      {item.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className="font-semibold mt-1">
                      Subtotal: {order.currency || "₱"}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {order.currency || "₱"}
                {(order.total / 1.08).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>
                {order.currency || "₱"}
                {(order.total - order.total / 1.08).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>Total</span>
              <span>
                {order.currency || "₱"}
                {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPurchasedOrderDetail;

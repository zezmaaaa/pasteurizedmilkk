import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Truck } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";
import { getSellerOrders, updateOrderStatus } from "@/services/orderService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const SellerOrderDetail: FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [userType, setUserType] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserType(user.user_metadata?.user_type || null);

        // Get orders for this seller
        const sellerOrders = getSellerOrders(user.id);
        const foundOrder = sellerOrders.find((o) => o.id === orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Order not found, redirect back to orders list
          navigate("/seller/orders");
        }
      }
    };

    loadOrderDetails();
  }, [orderId, navigate]);

  // If order is not loaded yet, use placeholder data
  const orderData = order || {
    id: orderId,
    customerName: "Loading...",
    email: "loading@example.com",
    phone: "Loading...",
    date: "Loading...",
    total: 0,
    status: "processing",
    items: [],
    shippingAddress: {
      firstName: "Loading",
      lastName: "...",
      address: "Loading...",
      city: "Loading",
      zipCode: "...",
    },
    paymentMethod: "Loading...",
  };

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

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;

    const user = await getCurrentUser();
    if (!user) return;

    // Update order status in localStorage
    updateOrderStatus(order.id, newStatus, user.id);

    // Update local state
    setOrder({ ...order, status: newStatus });

    alert(`Order status updated to ${newStatus}`);
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
              className="text-sm font-medium text-primary"
            >
              Orders
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order {orderData.id}</h1>
          <Badge className={getStatusColor(orderData.status)} variant="outline">
            {orderData.status === "checkout"
              ? "New Order"
              : orderData.status.charAt(0).toUpperCase() +
                orderData.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-center py-2">Quantity</th>
                      <th className="text-right py-2">Price</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items &&
                      orderData.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.name}</td>
                          <td className="text-center py-2">{item.quantity}</td>
                          <td className="text-right py-2">
                            ₱{(item.price || 0).toFixed(2)}
                          </td>
                          <td className="text-right py-2">
                            ₱{((item.price || 0) * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-medium">
                        Subtotal:
                      </td>
                      <td className="text-right py-2">
                        ₱
                        {orderData.items &&
                          orderData.items
                            .reduce(
                              (sum, item) =>
                                sum + (item.price || 0) * item.quantity,
                              0,
                            )
                            .toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-medium">
                        Tax (8%):
                      </td>
                      <td className="text-right py-2">
                        ₱
                        {orderData.items &&
                          (
                            orderData.items.reduce(
                              (sum, item) =>
                                sum + (item.price || 0) * item.quantity,
                              0,
                            ) * 0.08
                          ).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-bold">
                        Total:
                      </td>
                      <td className="text-right py-2 font-bold">
                        ₱{orderData.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {orderData.customerName || "Customer"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {orderData.email || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {orderData.phone || "Not provided"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {orderData.shippingAddress ? (
                  <div className="space-y-1">
                    <p>
                      {orderData.shippingAddress.firstName}{" "}
                      {orderData.shippingAddress.lastName}
                    </p>
                    <p>{orderData.shippingAddress.address}</p>
                    <p>
                      {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.zipCode}
                    </p>
                  </div>
                ) : (
                  <p>No shipping address provided</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-medium">Method:</span>{" "}
                  {orderData.paymentMethod || "Not specified"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.status === "checkout" && (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus("processing")}
                  >
                    Process Order
                  </Button>
                )}
                {orderData.status === "processing" && (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus("delivered")}
                  >
                    <Truck className="mr-2 h-4 w-4" /> Mark as Delivered
                  </Button>
                )}
                {orderData.status === "delivered" && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUpdateStatus("processing")}
                  >
                    Mark as Processing
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/seller/orders")}
                >
                  Back to Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetail;

import { FC, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import {
  createOrderFromCart,
  saveOrder,
  saveOrdersForSellers,
} from "@/services/orderService";

const SellerCheckout: FC = () => {
  const navigate = useNavigate();
  // Get cart items from context
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const calculateTotal = () => {
    return getCartTotal().toFixed(2);
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      const user = await getCurrentUser();
      if (user) {
        setSellerId(user.id);
        setBusinessName(user.user_metadata?.business_name || null);

        // Pre-fill shipping info if available
        if (user.user_metadata?.address) {
          setShippingInfo({
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            address: user.user_metadata?.address || "",
            city: user.user_metadata?.city || "",
            zipCode: user.user_metadata?.zip_code || "",
          });
        }
      } else {
        // Redirect to login if not logged in
        navigate("/seller/login");
      }
    };

    loadUserInfo();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    // Get current user ID
    const user = await getCurrentUser();
    const userId = user?.id;
    const customerName =
      businessName || `${shippingInfo.firstName} ${shippingInfo.lastName}`;

    // Create and save the order
    const order = createOrderFromCart(
      cartItems,
      shippingInfo,
      paymentMethod,
      userId,
      customerName,
    );

    // Save to seller's purchased orders
    saveOrder(order, userId);

    // Also save orders for each seller
    saveOrdersForSellers(order);

    // Clear the cart immediately
    clearCart();

    // Show success message and redirect to orders page
    setOrderPlaced(true);
    setTimeout(() => {
      navigate("/seller/purchased-orders");
    }, 2000);
  };

  // If order is placed, show success message
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Placed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been successfully placed. Redirecting to your
            orders...
          </p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full animate-progress"></div>
          </div>
        </div>
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
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Juan"
                    value={shippingInfo.firstName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Dela cruz"
                    value={shippingInfo.lastName}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={shippingInfo.address}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Butuan City"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo({ ...shippingInfo, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="8600"
                    value={shippingInfo.zipCode}
                    onChange={(e) =>
                      setShippingInfo({
                        ...shippingInfo,
                        zipCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash">GCash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>
              ) : paymentMethod === "gcash" ? (
                <div className="mt-4">
                  <div className="mb-4">
                    <Label htmlFor="gcashNumber">GCash Number</Label>
                    <Input id="gcashNumber" placeholder="09XX XXX XXXX" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="gcashName">Account Name</Label>
                    <Input id="gcashName" placeholder="Full Name" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Please ensure your GCash account is verified and has
                    sufficient balance. You will receive a confirmation SMS from
                    GCash once payment is processed.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mt-2">
                    You will pay in cash when your order is delivered. Please
                    have the exact amount ready. Our delivery personnel will
                    provide you with a receipt upon payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₱{calculateTotal()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₱0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>₱{(parseFloat(calculateTotal()) * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  ₱
                  {(
                    parseFloat(calculateTotal()) +
                    parseFloat(calculateTotal()) * 0.08
                  ).toFixed(2)}
                </span>
              </div>
              <Button className="w-full mt-6" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerCheckout;

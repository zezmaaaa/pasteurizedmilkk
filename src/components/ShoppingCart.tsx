import { FC, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import AuthForm from "./auth/AuthForm";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";

const ShoppingCart: FC = () => {
  const navigate = useNavigate();
  // Get cart items from context
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
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

  const calculateTotal = () => {
    return getCartTotal().toFixed(2);
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
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 mt-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
              <div className="mt-6 border rounded-lg p-4 bg-white">
                {userType ? (
                  <div className="flex flex-col space-y-3">
                    <Button asChild className="w-full">
                      <Link
                        to={
                          userType === "seller"
                            ? "/seller/checkout"
                            : "/customer/checkout"
                        }
                      >
                        Proceed to Checkout
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-medium mb-4">
                      Login or Register to Checkout
                    </h3>
                    <div className="flex flex-col space-y-3">
                      <Button asChild className="w-full">
                        <Link to="/customer/login?redirect=checkout">
                          Customer Login
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/seller/login">Seller Login</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl mb-6">Your cart is empty</p>
            <Button asChild>
              <Link to="/browse">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;

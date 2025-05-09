import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingCart, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getCurrentUser, signOut } from "@/services/supabase";
import ProductCard from "./ProductCard";
import { getHomeLink } from "@/utils/navigation";
import { useCart } from "@/context/CartContext";
import Footer from "./Footer";
import { getPostedProducts } from "@/services/productService";

const SellerHomePage = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [myProducts, setMyProducts] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/seller/login");
        return;
      }

      setBusinessName(user.user_metadata?.business_name || "Seller");
      // Check if user is new (registered less than 24 hours ago)
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const hoursSinceCreation =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      setIsNewUser(hoursSinceCreation < 24);
      setUserType(user.user_metadata?.user_type || null);
      setSellerId(user.id || null);
      setLoading(false);

      // Load posted products for this seller
      if (user.id) {
        const postedProducts = getPostedProducts(user.id);
        setMyProducts(postedProducts);
      }
    };

    checkUser();

    // Listen for product added events
    const handleProductAdded = () => {
      if (sellerId) {
        const postedProducts = getPostedProducts(sellerId);
        setMyProducts(postedProducts);
      }
    };

    document.addEventListener("productAdded", handleProductAdded);

    return () => {
      document.removeEventListener("productAdded", handleProductAdded);
    };
  }, [navigate, sellerId]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to={getHomeLink(userType)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link
                to="/seller/home"
                className="text-sm font-medium text-primary"
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
                to="/seller/purchased-orders"
                className="text-sm font-medium hover:text-primary"
              >
                Purchases
              </Link>
              <Link
                to="/seller/profile"
                className="text-sm font-medium hover:text-primary"
              >
                My Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {useCart().getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {useCart().getCartCount()}
                </span>
              )}
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">{businessName}</span>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
            <div className="container space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{businessName}</span>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/seller/home"
                  className="text-sm font-medium text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seller/dashboard"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/seller/orders"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/seller/purchased-orders"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Purchases
                </Link>
                <Link
                  to="/seller/profile"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {isNewUser
                ? `Welcome, ${businessName}!`
                : `Welcome Back, ${businessName}!`}
            </h1>
            <p className="text-muted-foreground">
              Manage your dairy products, track orders, and grow your business
              with our seller dashboard.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate("/seller/dashboard")}>
                Manage Products
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/seller/orders")}
              >
                View Orders
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1595475207225-428b62bda831?w=800&q=80"
              alt="Dairy farm"
              className="rounded-lg shadow-lg max-w-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* My Posted Products */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">My Posted Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.length > 0 ? (
              myProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating || 4.5}
                  category={product.category}
                  stock={product.stock}
                  expiryDate={product.expiryDate}
                  location={product.location}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-gray-500 mb-6">
                  No posted products yet. Make products to display them here.
                </p>
                <Button onClick={() => navigate("/seller/dashboard")}>
                  Make Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Market*/}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Market</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {[
              {
                id: "101",
                name: "Premium Goat Milk",
                price: 69.99,
                image:
                  "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
                rating: 4.7,
                category: "milk",
                stock: 28,
                expiryDate: "2024-12-10",
                location: "Mountain Goat Farm",
              },
              {
                id: "102",
                name: "Artisan Blue Cheese",
                price: 129.99,
                image:
                  "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
                rating: 214.9,
                category: "cheese",
                stock: 15,
                expiryDate: "2025-01-15",
                location: "Artisan Cheese Co.",
              },
              {
                id: "103",
                name: "Vanilla Bean Yogurt",
                price: 134.49,
                image:
                  "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80",
                rating: 4.6,
                category: "yogurt",
                stock: 32,
                expiryDate: "2024-11-05",
                location: "Valley Dairy",
              },
              {
                id: "104",
                name: "Organic Butter Block",
                price: 115.99,
                image:
                  "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
                rating: 4.8,
                category: "butter",
                stock: 40,
                expiryDate: "2025-02-20",
                location: "Green Pastures",
              },
              {
                id: "105",
                name: "Chocolate Milk 6-Pack",
                price: 122.99,
                image:
                  "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
                rating: 4.5,
                category: "milk",
                stock: 24,
                expiryDate: "2024-11-15",
                location: "Happy Cow Dairy",
              },
              {
                id: "106",
                name: "Strawberry Kefir",
                price: 124.99,
                image:
                  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
                rating: 4.4,
                category: "yogurt",
                stock: 18,
                expiryDate: "2024-10-30",
                location: "Probiotic Farm",
              },
            ].map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
                category={product.category}
                stock={product.stock}
                expiryDate={product.expiryDate}
                location={product.location}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SellerHomePage;

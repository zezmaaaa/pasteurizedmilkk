import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User, LogOut, Menu, X } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { getCurrentUser, signOut } from "@/services/supabase";
import ProductGrid from "./ProductGrid";
import { getHomeLink } from "@/utils/navigation";
import Footer from "./Footer";
import { getPostedProducts } from "@/services/productService";

const CustomerHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/customer/login");
        return;
      }

      setUserName(user.user_metadata?.name || "Customer");
      setUserType(user.user_metadata?.user_type || null);
      setLoading(false);
    };

    checkUser();

    // Load seller posted products to display in customer home
    const loadSellerProducts = () => {
      // Get all posted products from all sellers
      const postedProducts = getPostedProducts();

      // Add posted products to the ProductGrid component
      if (postedProducts.length > 0) {
        // Update the ProductGrid data through a custom event
        // This will make seller products appear first in "Our Products" section
        const event = new CustomEvent("sellerProductsLoaded", {
          detail: { products: postedProducts },
        });
        document.dispatchEvent(event);
      }
    };

    loadSellerProducts();

    // Listen for product added events to update the customer view in real-time
    const handleProductAdded = () => {
      loadSellerProducts();
    };

    document.addEventListener("productAdded", handleProductAdded);

    return () => {
      document.removeEventListener("productAdded", handleProductAdded);
    };
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
            <nav className="hidden md:flex gap-6">
              <Link
                to="/customer/home"
                className="text-sm font-medium hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="text-sm font-medium hover:text-primary"
              >
                Products
              </Link>
              <Link
                to="/customer/orders"
                className="text-sm font-medium hover:text-primary"
              >
                My Orders
              </Link>
              <Link
                to="/customer/profile"
                className="text-sm font-medium hover:text-primary"
              >
                My Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[200px] lg:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" className="sr-only">
                Search
              </Button>
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <Link to="/customer/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {useCart().getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {useCart().getCartCount()}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Welcome, {userName}</span>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
            <div className="container space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/customer/home"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/customer/orders"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/customer/profile"
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
              Welcome Back, {userName}!
            </h1>
            <p className="text-muted-foreground">
              Discover our wide range of farm-fresh milk and dairy products.
              Sourced from local farms with quality you can trust.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link to="/browse">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/customer/orders">View Orders</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/user.jpg"
              alt="Milk bottles"
              className="rounded-lg shadow-lg max-w-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/browse" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <div id="customerProductGrid">
            <ProductGrid />
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CustomerHomePage;

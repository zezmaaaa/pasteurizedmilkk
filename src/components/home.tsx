import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

import AuthForm from "./auth/AuthForm";
import ProductGrid from "./ProductGrid";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";
import { getPostedProducts } from "@/services/productService";

const Home = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      setLoading(true);
      const user = await getCurrentUser();

      if (user) {
        const userType = user.user_metadata?.user_type;
        const homeLink = getHomeLink(userType);

        if (homeLink !== "/") {
          navigate(homeLink);
          return;
        }
      }

      setLoading(false);
    };

    checkUserAndRedirect();

    // Load seller posted products to display in home page
    const loadSellerProducts = () => {
      // Get all posted products from all sellers
      const postedProducts = getPostedProducts();

      // Add posted products to the ProductGrid component
      if (postedProducts.length > 0) {
        // Update the ProductGrid data through a custom event
        const event = new CustomEvent("sellerProductsLoaded", {
          detail: { products: postedProducts },
        });
        document.dispatchEvent(event);
      }
    };

    loadSellerProducts();

    // Listen for product removal events
    const handleProductRemoved = (event: any) => {
      // Reload seller products when a product is removed
      loadSellerProducts();
    };

    // Listen for product added events
    const handleProductAdded = () => {
      // Reload seller products when a product is added
      loadSellerProducts();
    };

    document.addEventListener("productRemoved", handleProductRemoved);
    document.addEventListener("productAdded", handleProductAdded);

    return () => {
      document.removeEventListener("productRemoved", handleProductRemoved);
      document.removeEventListener("productAdded", handleProductAdded);
    };
  }, [navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
            <nav className="hidden md:flex gap-6">
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
              {/* Show cart badge only when items exist in cart */}
              {useCart().getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {useCart().getCartCount()}
                </span>
              )}
            </Link>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4 pt-4">
                  <Button asChild>
                    <Link to="/customer/login">Customer Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/seller/login">Seller Login</Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
            <div className="container space-y-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
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
                  to="/about"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
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
              Fresh Dairy Products Delivered To Your Door
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
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/public/home.jpg"
              alt="Milk bottles"
              className="rounded-lg shadow-lg max-w-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Fresh Milk",
                image:
                  "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
              },
              {
                name: "Pasteurized",
                image:
                  "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
              },
              {
                name: "Flavored Milk",
                image:
                  "https://images.unsplash.com/photo-1624781740834-fbfbf5fd221a?w=400&q=80",
              },
              {
                name: "Organic",
                image:
                  "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80",
              },
            ].map((category, index) => (
              <Link
                to={`/browse?category=${category.name.toLowerCase()}`}
                key={index}
                className="group relative overflow-hidden rounded-lg block"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
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
          <ProductGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                text: "The quality of milk from this shop is exceptional. I can really taste the difference compared to supermarket brands.",
              },
              {
                name: "Michael Chen",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                text: "I love the variety of dairy products available. The cheese selection is amazing and always fresh!",
              },
              {
                name: "Emily Rodriguez",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
                text: "The delivery service is prompt and reliable. My family enjoys the farm-fresh milk delivered right to our doorstep.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Milk Shop</h3>
              <p className="mb-4">
                Providing farm-fresh dairy products since 2024. Quality you can
                taste, service you can trust.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Customer Service
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-white">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-white">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Contact Us
              </h4>
              <address className="not-italic">
                <p>Ampayon, Butan City</p>
                <p>Agusan del Norte, Philippines</p>
                <p className="mt-2">Email: pasteurozedmilk@gmail.com</p>
                <p>Phone: 0998765432</p>
              </address>
            </div>
          </div>
          <Separator className="my-8 bg-gray-700" />
          <div className="text-center">
            <p>
              &copy; {new Date().getFullYear()} Milk Shop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

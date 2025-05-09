import { FC, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import { Button } from "./ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "./ui/input";

const BrowseProducts: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const category = params.get("category");

    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (sortBy) params.set("sort", sortBy);

    navigate(`/browse?${params.toString()}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
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
              to="#"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                const checkUserAndRedirect = async () => {
                  const user = await import("@/services/supabase").then(
                    (module) => module.getCurrentUser(),
                  );
                  if (user) {
                    const userType = user.user_metadata?.user_type;
                    if (userType === "customer") {
                      navigate("/customer/home");
                    } else if (userType === "seller") {
                      navigate("/seller/home");
                    } else {
                      navigate("/");
                    }
                  } else {
                    navigate("/");
                  }
                };
                checkUserAndRedirect();
              }}
            >
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
          </div>
          <nav className="flex gap-6">
            <Link
              to="#"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                const checkUserAndRedirect = async () => {
                  const user = await import("@/services/supabase").then(
                    (module) => module.getCurrentUser(),
                  );
                  if (user) {
                    const userType = user.user_metadata?.user_type;
                    if (userType === "customer") {
                      navigate("/customer/home");
                    } else if (userType === "seller") {
                      navigate("/seller/home");
                    } else {
                      navigate("/");
                    }
                  } else {
                    navigate("/");
                  }
                };
                checkUserAndRedirect();
              }}
            >
              Home
            </Link>
            <Link to="/browse" className="text-sm font-medium text-primary">
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
        <h1 className="text-3xl font-bold mb-6">Browse Our Products</h1>
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="p-2 border rounded"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Category</option>
              <option value="fresh-milk">Fresh Milk</option>
              <option value="pasteurized">Pasteurized</option>
              <option value="flavored-milk">Flavored Milk</option>
              <option value="organic">Organic</option>
              <option value="cheese">Cheese</option>
              <option value="yogurt">Yogurt</option>
              <option value="butter">Butter</option>
            </select>
            <select
              className="p-2 border rounded"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <Button type="button" onClick={applyFilters}>
              Apply Filters
            </Button>
          </form>
        </div>
        <ProductGrid />

        {/* Conditionally render login/register section only for non-logged in users */}
        {(() => {
          const [isLoggedIn, setIsLoggedIn] = useState(false);

          useEffect(() => {
            const checkLoginStatus = async () => {
              const user = await import("@/services/supabase").then((module) =>
                module.getCurrentUser(),
              );
              setIsLoggedIn(!!user);
            };

            checkLoginStatus();
          }, []);

          if (!isLoggedIn) {
            return (
              <div className="mt-12 py-8 border-t border-gray-200">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    Want to see more products?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Log in or register to access our full catalog of dairy
                    products
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => navigate("/customer/login")}
                      className="px-6"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => navigate("/customer/register")}
                      variant="outline"
                      className="px-6"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default BrowseProducts;

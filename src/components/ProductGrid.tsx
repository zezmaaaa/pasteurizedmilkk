import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getPostedProducts } from "@/services/productService";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description: string;
  stock: number;
  expiryDate: string;
  location?: string;
  isPosted?: boolean;
  sellerId?: string;
}

interface ProductGridProps {
  products?: Product[];
  onProductClick?: (productId: string) => void;
  searchTerm?: string;
  categoryFilter?: string;
  sortOption?: string;
}

const ProductGrid = ({
  products: propProducts = defaultProducts,
  onProductClick = () => {},
  searchTerm: initialSearchTerm = "",
  categoryFilter: initialCategory = "all",
  sortOption: initialSortBy = "featured",
}: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [products, setProducts] = useState(propProducts);

  // Update state when props change
  useEffect(() => {
    if (initialSearchTerm !== undefined) setSearchTerm(initialSearchTerm);
    if (initialCategory !== undefined) setSelectedCategory(initialCategory);
    if (initialSortBy !== undefined) setSortBy(initialSortBy);

    // Set initial products from props
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
    }

    // Load seller products directly from the shared product service
    const loadSellerProducts = () => {
      // Get all posted products from all sellers for the customer view
      const sellerProducts = getPostedProducts();
      if (sellerProducts && sellerProducts.length > 0) {
        // Add seller products to the default products
        const updatedProducts = [...defaultProducts];
        sellerProducts.forEach((product) => {
          // Check if product already exists to avoid duplicates
          if (!updatedProducts.some((p) => p.id === product.id)) {
            // Preserve the original product data
            updatedProducts.unshift({
              // Add to beginning of array so they appear first
              ...product,
              rating: product.rating || 4.5, // Default rating if not provided
              isPosted: true, // Mark as a seller posted product
            });
          } else {
            // Update existing product with latest data
            const index = updatedProducts.findIndex((p) => p.id === product.id);
            if (index !== -1) {
              updatedProducts[index] = {
                ...updatedProducts[index],
                ...product,
                rating: product.rating || updatedProducts[index].rating || 4.5,
                expiryDate:
                  product.expiryDate ||
                  updatedProducts[index].expiryDate ||
                  new Date().toISOString().split("T")[0],
                isPosted: true,
              };
            }
          }
        });
        // Update the products state
        setProducts(updatedProducts);
      }
    };

    // Load seller products when component mounts
    loadSellerProducts();

    // Also listen for the custom event for backward compatibility
    const handleSellerProducts = (event: any) => {
      loadSellerProducts();
    };

    // Listen for product removal events
    const handleProductRemoved = (event: any) => {
      const { productId } = event.detail;
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId),
      );
    };

    document.addEventListener("sellerProductsLoaded", handleSellerProducts);
    document.addEventListener("productRemoved", handleProductRemoved);

    // Set up an interval to periodically check for new products
    const checkForNewProducts = setInterval(loadSellerProducts, 5000);

    return () => {
      document.removeEventListener(
        "sellerProductsLoaded",
        handleSellerProducts,
      );
      document.removeEventListener("productRemoved", handleProductRemoved);
      clearInterval(checkForNewProducts);
    };
  }, [initialSearchTerm, initialCategory, initialSortBy]);

  // Define categories to match BrowseProducts.tsx
  const categories = [
    "all",
    "fresh-milk",
    "pasteurized",
    "flavored-milk",
    "organic",
    "cheese",
    "yogurt",
    "butter",
  ];

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Check if products are from seller (have isPosted property)
    const aIsPosted = "isPosted" in a;
    const bIsPosted = "isPosted" in b;

    // Always show seller products first
    if (aIsPosted && !bIsPosted) return -1;
    if (!aIsPosted && bIsPosted) return 1;

    // Then apply the selected sort
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default: featured/no specific sort
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Our Products</h2>
      </div>
      <div className="mb-4">
        {products.some((p) => "isPosted" in p) && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-blue-700 text-sm">
              ✨ Products from local sellers appear first
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  onClick={() => onProductClick(product.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="flex flex-col gap-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="md:w-1/4 h-48 md:h-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {product.description}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Category:</span>{" "}
                        {product.category}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Stock:</span>{" "}
                        {product.stock} available
                      </p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-medium">Expires:</span>{" "}
                        {new Date(product.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">
                        ₱{product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          const { addToCart } = useCart();
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                          });
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">
            No products found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

// Default products for demonstration
const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Organic Whole Milk",
    price: 104.99,
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    rating: 4.8,
    category: "milk",
    description:
      "Fresh organic whole milk from grass-fed cows. Our milk is sourced from local farms that prioritize animal welfare and sustainable farming practices. Rich in nutrients and perfect for drinking, cooking, or baking.",
    stock: 45,
    expiryDate: "2024-12-15",
    location: "Batangas Dairy Farm",
  },
  {
    id: "2",
    name: "Low-Fat Milk",
    price: 103.99,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80",
    rating: 4.5,
    category: "milk",
    description:
      "Reduced fat milk with all the essential nutrients. Perfect for those watching their calorie intake without sacrificing taste. Produced using gentle processing methods to preserve natural flavor.",
    stock: 38,
    expiryDate: "2024-11-20",
    location: "Laguna Valley Farms",
  },
  {
    id: "3",
    name: "Artisan Cheese Selection",
    price: 112.99,
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
    rating: 4.9,
    category: "cheese",
    description:
      "Handcrafted selection of premium cheeses from local artisans. Includes brie, cheddar, and gouda varieties. Each cheese is aged to perfection in our climate-controlled cellars for optimal flavor development.",
    stock: 15,
    expiryDate: "2025-01-10",
    location: "Cavite Artisan Dairy",
  },
  {
    id: "4",
    name: "Greek Yogurt",
    price: 105.49,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    rating: 4.7,
    category: "yogurt",
    description:
      "Thick, creamy Greek yogurt made with traditional straining methods. High in protein and probiotics for gut health. Our yogurt contains live active cultures that support digestive health and immune function.",
    stock: 30,
    expiryDate: "2024-10-25",
    location: "Quezon Province Dairy",
  },
  {
    id: "5",
    name: "Chocolate Milk",
    price: 104.29,
    image: "/molo.jpg",

    rating: 4.6,
    category: "milk",
    description:
      "Delicious chocolate-flavored milk made with real cocoa. A perfect treat for kids and adults alike. We use premium cocoa powder and just the right amount of sweetness for a balanced, satisfying flavor.",
    stock: 25,
    expiryDate: "2024-11-05",
    location: "Batangas Dairy Farm",
  },
  {
    id: "6",
    name: "Butter",
    price: 103.49,
    image:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&q=80",
    rating: 4.4,
    category: "butter",
    description:
      "Creamy, salted butter churned from fresh cream. Perfect for cooking, baking, or spreading on warm bread. Our butter is made in small batches to ensure quality and rich, consistent flavor in every package.",
    stock: 50,
    expiryDate: "2025-02-18",
    location: "Laguna Valley Farms",
  },
  {
    id: "7",
    name: "Strawberry Yogurt",
    price: 104.99,
    image:
      "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&q=80",
    rating: 4.3,
    category: "yogurt",
    description:
      "Smooth yogurt blended with real strawberry pieces. A delicious breakfast or snack option with no artificial flavors. We use locally grown strawberries harvested at peak ripeness for the best natural flavor.",
    stock: 22,
    expiryDate: "2024-10-15",
    location: "Quezon Province Dairy",
  },
  {
    id: "8",
    name: "Almond Milk",
    price: 105.99,
    image:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80",
    rating: 4.2,
    category: "milk",
    description:
      "Plant-based milk alternative made from carefully selected almonds. Dairy-free, lactose-free, and perfect for vegans. Our almond milk is fortified with calcium and vitamins D and E to provide essential nutrients.",
    stock: 18,
    expiryDate: "2025-01-05",
    location: "Manila Urban Farms",
  },
];

export default ProductGrid;

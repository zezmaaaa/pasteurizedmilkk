import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ProductCard from "./ProductCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { getCurrentUser } from "@/services/supabase";
import { useEffect } from "react";
import { getHomeLink } from "@/utils/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  Menu,
  X,
  Package,
  ShoppingBag,
  Settings,
} from "lucide-react";
import {
  getAllProducts,
  saveMultipleProducts,
  updateProductPostedStatus,
  removeProduct,
} from "@/services/productService";

const SellerDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: 0,
    category: "",
    stock: 0,
    description: "",
    image: "",
    location: "",
    expiryDate: "",
  });
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  const [sellerId, setSellerId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserType(user.user_metadata?.user_type || null);
        setSellerId(user.id || null);
      }
    };

    checkUser();

    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (
      tabParam &&
      ["products", "addProduct", "posted", "market"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  // Get products from localStorage or use empty array for new sellers
  const [products, setProducts] = useState<
    Array<{
      id: number | string;
      name: string;
      price: number;
      stock: number;
      category: string;
      image: string;
      description?: string;
      location?: string;
      expiryDate?: string;
      isPosted?: boolean;
      sellerId?: string;
    }>
  >([]);

  useEffect(() => {
    // Load only this seller's products from shared product service
    if (sellerId) {
      const allProducts = getAllProducts().filter(
        (p) => p.sellerId === sellerId || !p.sellerId,
      );
      setProducts(allProducts);
    }
  }, [sellerId]);

  // Get orders from localStorage or use empty array for new sellers
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      customer: string;
      date: string;
      total: number;
      status: string;
    }>
  >([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("sellerOrders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Categories for filtering
  const categories = [
    "all",
    "milk",
    "cheese",
    "yogurt",
    "butter",
    "flavored-milk",
    "organic",
  ];

  // Sample products from other sellers
  const otherSellerProducts = [
    {
      id: "101",
      name: "Premium Goat Milk",
      price: 6.99,
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
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80",
      rating: 4.9,
      category: "cheese",
      stock: 15,
      expiryDate: "2025-01-15",
      location: "Artisan Cheese Co.",
    },
    {
      id: "103",
      name: "Vanilla Bean Yogurt",
      price: 4.49,
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
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1603431777007-61db4494a034?w=400&q=80",
      rating: 4.8,
      category: "butter",
      stock: 40,
      expiryDate: "2025-02-20",
      location: "Green Pastures",
    },
    {
      id: "105",
      name: "Chocolate Milk 6-Pack",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
      rating: 4.5,
      category: "flavored-milk",
      stock: 24,
      expiryDate: "2024-11-15",
      location: "Happy Cow Dairy",
    },
    {
      id: "106",
      name: "Strawberry Kefir",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
      rating: 4.4,
      category: "yogurt",
      stock: 18,
      expiryDate: "2024-10-30",
      location: "Probiotic Farm",
    },
    {
      id: "107",
      name: "Organic Whole Milk",
      price: 5.49,
      image:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
      rating: 4.8,
      category: "organic",
      stock: 35,
      expiryDate: "2024-11-25",
      location: "Green Valley Farm",
    },
    {
      id: "108",
      name: "Salted Butter",
      price: 4.29,
      image:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
      rating: 4.6,
      category: "butter",
      stock: 42,
      expiryDate: "2025-01-30",
      location: "Dairy Delights",
    },
  ];

  // Separate posted products (only for this seller)
  const postedProducts = products.filter(
    (p) => p.isPosted === true && (p.sellerId === sellerId || !p.sellerId),
  );
  // Market products should only be from other sellers, not this seller
  const marketProducts = [...otherSellerProducts].filter(
    (p) => p.sellerId !== sellerId,
  );

  // Filter and sort products
  const filteredProducts = marketProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // default: featured/no specific sort
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              to="/seller/home"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/seller/dashboard"
              className="text-sm font-medium text-primary"
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
              My Profile
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-4 bg-background border-b">
            <div className="flex flex-col space-y-3">
              <Link
                to="/seller/dashboard"
                className="text-sm font-medium text-primary px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/seller/login");
                }}
                className="justify-start"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

        <Tabs
          defaultValue="products"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="addProduct">Add New Product</TabsTrigger>
            <TabsTrigger value="posted">Posted Products</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <Button
                onClick={() => {
                  setFormData({
                    id: "",
                    name: "",
                    price: 0,
                    category: "",
                    stock: 0,
                    description: "",
                    image: "",
                    location: "",
                    expiryDate: "",
                  });
                  setActiveTab("addProduct");
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add New Product
              </Button>
            </div>

            {products.filter((p) => p.isPosted !== true).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((p) => p.isPosted !== true)
                  .map((product) => (
                    <Card key={product.id}>
                      <CardHeader className="p-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-gray-600">
                              ₱{product.price.toFixed(2)}
                            </p>
                            <p className="text-sm mt-1">
                              Stock: {product.stock}
                            </p>
                            <p className="text-sm">
                              {product.location || "No location"}
                            </p>
                            <p className="text-sm">
                              {product.expiryDate
                                ? `Expires: ${product.expiryDate}`
                                : "No expiry date"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {product.description || "No description"}
                            </p>
                            <Badge variant="outline" className="mt-2">
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                // Set form data for editing
                                setFormData({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  category: product.category,
                                  stock: product.stock,
                                  description: product.description || "",
                                  image: product.image,
                                  location: product.location || "",
                                  expiryDate: product.expiryDate || "",
                                });
                                setActiveTab("addProduct");
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => {
                                if (window.confirm(`Delete ${product.name}?`)) {
                                  const updatedProducts = products.filter(
                                    (p) => p.id !== product.id,
                                  );
                                  setProducts(updatedProducts);
                                  saveMultipleProducts(
                                    updatedProducts,
                                    sellerId,
                                  );
                                  // Also call removeProduct to ensure it's properly removed
                                  removeProduct(product.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Button
                            className="w-full"
                            variant={product.isPosted ? "secondary" : "default"}
                            onClick={() => {
                              // Update the product's posted status
                              const updatedProducts = [...products];
                              const index = updatedProducts.findIndex(
                                (p) => p.id === product.id,
                              );
                              if (index !== -1) {
                                const newPostedStatus =
                                  !updatedProducts[index].isPosted;
                                updatedProducts[index] = {
                                  ...updatedProducts[index],
                                  isPosted: newPostedStatus,
                                };
                                setProducts(updatedProducts);
                                saveMultipleProducts(updatedProducts, sellerId);
                                // Also update the shared product service
                                updateProductPostedStatus(
                                  product.id,
                                  newPostedStatus,
                                );
                                alert(
                                  newPostedStatus
                                    ? `Product "${product.name}" has been posted to the market!`
                                    : `Product "${product.name}" has been removed from the market!`,
                                );
                              }
                            }}
                          >
                            {product.isPosted
                              ? "Remove from Market"
                              : "Post to Market"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No products yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Add your first product to start selling
                </p>
                <Button
                  onClick={() => {
                    setFormData({
                      id: "",
                      name: "",
                      price: 0,
                      category: "",
                      stock: 0,
                      description: "",
                      image: "",
                      location: "",
                      expiryDate: "",
                    });
                    setActiveTab("addProduct");
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="addProduct">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                {formData.id ? "Edit Product" : "Add New Product"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">Product Name*</Label>
                  <Input
                    id="productName"
                    placeholder="Organic Whole Milk"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="productPrice">Price (₱)*</Label>
                  <Input
                    id="productPrice"
                    placeholder="4.99"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="productCategory">Category*</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milk">Milk</SelectItem>
                      <SelectItem value="cheese">Cheese</SelectItem>
                      <SelectItem value="yogurt">Yogurt</SelectItem>
                      <SelectItem value="butter">Butter</SelectItem>
                      <SelectItem value="flavored-milk">
                        Flavored Milk
                      </SelectItem>
                      <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="productStock">Stock*</Label>
                  <Input
                    id="productStock"
                    placeholder="50"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="productLocation">Location</Label>
                  <Input
                    id="productLocation"
                    placeholder="Batangas Dairy Farm"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="productExpiryDate">Expiry Date</Label>
                  <Input
                    id="productExpiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="productDescription">Description*</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Product description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="productImage">Product Image*</Label>
                  <div className="flex flex-col gap-2">
                    <Input
                      id="productImage"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Or upload from device:
                      </span>
                      <Input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Use the actual file as the image source
                            // This will keep the same image that the user uploaded
                            const imageUrl = URL.createObjectURL(file);

                            // Store the file name in localStorage to remember which file was uploaded
                            localStorage.setItem(
                              `file_${Date.now()}`,
                              file.name,
                            );
                            setFormData({
                              ...formData,
                              image: imageUrl,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button
                    onClick={() => {
                      // Validate form
                      if (
                        !formData.name ||
                        !formData.price ||
                        !formData.category ||
                        !formData.stock ||
                        !formData.image ||
                        !formData.description
                      ) {
                        alert(
                          "Please fill in all required fields marked with *",
                        );
                        return;
                      }

                      // Save product
                      const updatedProducts = [...products];

                      if (formData.id) {
                        // Update existing product
                        const index = updatedProducts.findIndex(
                          (p) => p.id === formData.id,
                        );
                        if (index !== -1) {
                          updatedProducts[index] = formData;
                        }
                      } else {
                        // Add new product
                        const newProduct = {
                          ...formData,
                          id: Date.now().toString(),
                        };
                        updatedProducts.push(newProduct);
                      }

                      // Update state and shared product service
                      setProducts(updatedProducts);
                      saveMultipleProducts(updatedProducts, sellerId);

                      alert("Product saved successfully!");
                      setActiveTab("products");
                    }}
                  >
                    Save Product
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => setActiveTab("products")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="hidden">
            <h2 className="text-xl font-semibold mb-6">Manage Orders</h2>

            {orders.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₱{order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={getStatusColor(order.status)}
                            variant="outline"
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/seller/orders/${order.id}`)
                            }
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Orders will appear here when customers purchase your products
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="posted">
            <h2 className="text-xl font-semibold mb-6">Posted Products</h2>

            {postedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {postedProducts.map((product) => (
                  <Card key={product.id}>
                    <CardHeader className="p-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-gray-600">
                            ₱{product.price.toFixed(2)}
                          </p>
                          <p className="text-sm mt-1">Stock: {product.stock}</p>
                          <p className="text-sm">
                            {product.location || "No location"}
                          </p>
                          <p className="text-sm">
                            {product.expiryDate
                              ? `Expires: ${product.expiryDate}`
                              : "No expiry date"}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {product.description || "No description"}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              // Set form data for editing
                              setFormData({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                category: product.category,
                                stock: product.stock,
                                description: product.description || "",
                                image: product.image,
                                location: product.location || "",
                                expiryDate: product.expiryDate || "",
                              });
                              setActiveTab("addProduct");
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => {
                              if (window.confirm(`Delete ${product.name}?`)) {
                                const updatedProducts = products.filter(
                                  (p) => p.id !== product.id,
                                );
                                setProducts(updatedProducts);
                                saveMultipleProducts(updatedProducts, sellerId);
                                // Also call removeProduct to ensure it's properly removed
                                removeProduct(product.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => {
                            // Update the product's posted status
                            const updatedProducts = [...products];
                            const index = updatedProducts.findIndex(
                              (p) => p.id === product.id,
                            );
                            if (index !== -1) {
                              const newPostedStatus =
                                !updatedProducts[index].isPosted;
                              updatedProducts[index] = {
                                ...updatedProducts[index],
                                isPosted: newPostedStatus,
                              };
                              setProducts(updatedProducts);
                              saveMultipleProducts(updatedProducts, sellerId);
                              alert(
                                newPostedStatus
                                  ? `Product "${product.name}" has been posted to the market!`
                                  : `Product "${product.name}" has been removed from the market!`,
                              );
                            }
                          }}
                        >
                          {product.isPosted
                            ? "Remove from Market"
                            : "Post to Market"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No posted products yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Post your products to make them visible in the market
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="market">
            <h2 className="text-xl font-semibold mb-6">
              Other Sellers' Products
            </h2>

            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Dashboard Summary */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <h3 className="text-2xl font-bold">{products.length}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Settings</p>
                  <h3 className="text-2xl font-bold">
                    <Button
                      variant="link"
                      onClick={() => navigate("/seller/profile")}
                      className="p-0 h-auto font-bold text-2xl"
                    >
                      Profile
                    </Button>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;

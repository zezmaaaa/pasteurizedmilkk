import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getAllProducts } from "@/services/productService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
}

interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews?: number;
  category: string;
  stock: number;
  expiryDate: string;
  specifications?: Record<string, string>;
  location?: string;
  sellerId?: string;
  isPosted?: boolean;
}

interface ProductDetailProps {
  product?: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const [productData, setProductData] = useState<Product>();

  // Fetch product data based on ID
  useEffect(() => {
    if (id) {
      const allProducts = getAllProducts();
      const foundProduct = allProducts.find((p) => p.id.toString() === id);

      if (foundProduct) {
        setProductData({
          ...foundProduct,
          reviews: foundProduct.reviews || 0,
          specifications: foundProduct.specifications || {},
        });
      }
    }
  }, [id]);

  // Use either the fetched product or the default product
  const product = productData || {
    id: "1",
    name: "Organic Whole Milk",
    price: 104.99,
    description:
      "Fresh organic whole milk from grass-fed cows. Our milk is sourced from local farms that prioritize animal welfare and sustainable farming practices. Rich in nutrients and perfect for drinking, cooking, or baking.",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
    rating: 4.8,
    reviews: 124,
    category: "Dairy",
    stock: 45,
    expiryDate: "2024-12-15",
    specifications: {
      Volume: "1 Gallon",
      "Fat Content": "3.25%",
      Source: "Local Farms",
      Pasteurization: "HTST",
      "Shelf Life": "14 days refrigerated",
      Organic: "Yes",
      Allergens: "Contains milk",
      "Expiration Date": "December 15, 2024",
    },
  };
  // If this is a seller product, it might not have reviews or specifications
  const reviewsCount = product.reviews || 0;
  const specifications = product.specifications || {};
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Mock reviews data
  const reviewsData: Review[] = [
    {
      id: "1",
      user: {
        name: "Jane Cooper",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      },
      rating: 5,
      date: "2023-05-15",
      comment:
        "This milk is incredibly fresh and tastes amazing. My family loves it and we've switched to buying this exclusively.",
    },
    {
      id: "2",
      user: {
        name: "Robert Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      },
      rating: 4,
      date: "2023-05-10",
      comment:
        "Great quality milk. The taste is noticeably better than the regular store brands. Would recommend.",
    },
    {
      id: "3",
      user: {
        name: "Sarah Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      rating: 5,
      date: "2023-05-05",
      comment:
        "I appreciate that this comes from local farms. The milk tastes fresh and creamy. Will buy again!",
    },
  ];

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
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

      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div>
              <span className="text-2xl font-bold">
                ₱{product.price.toFixed(2)}
              </span>
              <div className="mt-1">
                <p className="text-sm text-gray-500">
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {new Date(product.expiryDate).toLocaleDateString()}
                </p>
                {product.location && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span>{" "}
                    {product.location}
                  </p>
                )}
                {product.isPosted && (
                  <p className="text-sm text-blue-500 font-medium mt-1">
                    ✓ Posted by local seller
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1"
                  onClick={() => {
                    const { addToCart } = useCart();
                    for (let i = 0; i < quantity; i++) {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      });
                    }
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs
            defaultValue="description"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviewsData.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  {Object.keys(specifications).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between border-b pb-2"
                        >
                          <span className="font-medium">{key}</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No specifications available for this product.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Customer Reviews
                      </h3>
                      <Button>Write a Review</Button>
                    </div>

                    {reviewsCount > 0 ? (
                      <div className="space-y-6">
                        {reviewsData.map((review) => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={review.user.avatar} />
                                <AvatarFallback>
                                  {review.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {review.user.name}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-700">
                              {review.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No reviews yet for this product.
                        </p>
                        <Button className="mt-4">Be the first to review</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

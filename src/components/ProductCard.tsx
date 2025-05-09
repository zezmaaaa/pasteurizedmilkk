import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category?: string;
  stock?: number;
  expiryDate?: string;
  location?: string;
  onViewDetails?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Organic Whole Milk",
  price = 103.99,
  image = "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80",
  rating = 4.5,
  category = "Organic",
  stock = 45,
  expiryDate = "2024-12-15",
  location = "Batangas Dairy Farm",
  onViewDetails,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation

    if (onViewDetails) {
      onViewDetails(id);
    } else {
      navigate(`/product-detail/${id}`);
    }
  };

  const handleWriteReview = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    navigate(`/product/${id}?tab=reviews&action=write`);
  };

  return (
    <Card className="w-full max-w-[280px] overflow-hidden transition-all hover:shadow-lg bg-white">
      <div
        className="relative h-48 cursor-pointer"
        onClick={(e) => handleViewDetails(e)}
      >
        <img src={image} alt={name} className="h-full w-full object-cover" />
        {category && (
          <Badge className="absolute top-2 right-2 bg-primary/90">
            {category}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3
          className="text-lg font-semibold line-clamp-2 cursor-pointer hover:text-primary"
          onClick={(e) => handleViewDetails(e)}
        >
          {name}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold">₱{price.toFixed(2)}</p>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>

        {location && (
          <p className="text-sm text-gray-600 mt-1">From: {location}</p>
        )}
        {stock !== undefined && (
          <p className="text-sm text-gray-600">{stock} in stock</p>
        )}
        {expiryDate && (
          <p className="text-sm text-gray-600">
            Exp: {new Date(expiryDate).toLocaleDateString()}
          </p>
        )}
        {category && (
          <div className="mt-2">
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
              {category}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleWriteReview}
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

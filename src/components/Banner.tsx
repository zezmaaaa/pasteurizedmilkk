import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BannerProps {
  message?: string;
  type?: "info" | "success" | "warning" | "error";
  showCloseButton?: boolean;
  onClose?: () => void;
  expiryDays?: number;
}

const Banner: React.FC<BannerProps> = ({
  message = "Welcome to Milk Shop! Free delivery on orders over ₱500",
  type = "info",
  showCloseButton = true,
  onClose,
  expiryDays = 7,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if banner was previously dismissed
  useEffect(() => {
    const bannerDismissed = localStorage.getItem("bannerDismissed");
    if (bannerDismissed) {
      const dismissedDate = new Date(JSON.parse(bannerDismissed).timestamp);
      const currentDate = new Date();
      const daysDifference = Math.floor(
        (currentDate.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24),
      );

      // If the banner was dismissed less than expiryDays ago, keep it hidden
      if (daysDifference < expiryDays) {
        setIsVisible(false);
      }
    }
  }, [expiryDays]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(
      "bannerDismissed",
      JSON.stringify({ timestamp: new Date().toISOString() }),
    );
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getBannerStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className={`w-full py-3 px-4 border-b ${getBannerStyles()}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">{message}</span>
        </div>
        {showCloseButton && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Banner;

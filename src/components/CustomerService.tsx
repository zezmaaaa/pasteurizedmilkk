import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/services/supabase";
import { getHomeLink } from "@/utils/navigation";

const CustomerService = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page: string }>();
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

  // Content for different customer service pages
  const pageContent = {
    faq: {
      title: "Frequently Asked Questions",
      content: [
        {
          question: "How do I place an order?",
          answer:
            "You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. Follow the steps to provide shipping and payment information.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.",
        },
        {
          question: "How long does delivery take?",
          answer:
            "Delivery typically takes 1-3 business days for local areas and 3-5 business days for nationwide shipping.",
        },
        {
          question: "Are your dairy products organic?",
          answer:
            "Many of our products are certified organic. Each product description specifies whether it is organic or conventional.",
        },
        {
          question: "Do you offer subscriptions?",
          answer:
            "Yes, we offer weekly and monthly subscription options for regular deliveries with a 10% discount.",
        },
      ],
    },
    shipping: {
      title: "Shipping Policy",
      content: [
        {
          heading: "Delivery Areas",
          text: "We currently deliver to all 50 states. Local delivery (within 25 miles) is available for same-day or next-day delivery.",
        },
        {
          heading: "Shipping Methods",
          text: "We use refrigerated shipping to ensure products arrive fresh. Standard shipping (3-5 days) and Express shipping (1-2 days) options are available.",
        },
        {
          heading: "Shipping Costs",
          text: "Shipping rates vary by location, starting at ₱70. Orders over ₱1,000 may qualify for free standard shipping. Express shipping is also available for an additional fee.",
        },
        {
          heading: "Order Tracking",
          text: "Once your order ships, you'll receive a tracking number via email to monitor your delivery status.",
        },
        {
          heading: "Delivery Issues",
          text: "If your order arrives damaged or has quality issues, please contact us within 24 hours of delivery for a replacement or refund.",
        },
      ],
    },
    returns: {
      title: "Returns & Refunds",
      content: [
        {
          heading: "Return Policy",
          text: "Due to the perishable nature of our products, we generally do not accept returns. However, we stand behind the quality of our products.",
        },
        {
          heading: "Quality Guarantee",
          text: "If you're not satisfied with the quality of your products, please contact us within 24 hours of delivery with photos of the issue.",
        },
        {
          heading: "Refund Process",
          text: "Once we verify the quality issue, we'll process a refund to your original payment method within 3-5 business days.",
        },
        {
          heading: "Missing or Incorrect Items",
          text: "If your order is missing items or contains incorrect products, please contact us immediately for resolution.",
        },
        {
          heading: "Cancellations",
          text: "Orders can be cancelled for a full refund if the request is made before the order enters processing (typically within 2 hours of placing the order).",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      content: [
        {
          heading: "Information Collection",
          text: "We collect personal information such as name, address, email, and payment details when you create an account or place an order.",
        },
        {
          heading: "How We Use Your Information",
          text: "We use your information to process orders, provide customer service, send order updates, and occasionally send promotional materials (if you've opted in).",
        },
        {
          heading: "Information Sharing",
          text: "We never sell your personal information to third parties. We share information only with shipping partners and payment processors as necessary to fulfill orders.",
        },
        {
          heading: "Data Security",
          text: "We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.",
        },
        {
          heading: "Cookies & Tracking",
          text: "Our website uses cookies to enhance your browsing experience and analyze site traffic. You can adjust cookie settings in your browser preferences.",
        },
        {
          heading: "Your Rights",
          text: "You have the right to access, correct, or delete your personal information. Contact us at privacy@milkshop.com for assistance.",
        },
      ],
    },
  };

  // Default to FAQ if no page is specified or page doesn't exist
  const currentPage =
    page && pageContent[page as keyof typeof pageContent] ? page : "faq";
  const content = pageContent[currentPage as keyof typeof pageContent];

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

      <div className="container py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/customer-service/faq"
                    className={`block p-2 rounded ${currentPage === "faq" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"}`}
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-service/shipping"
                    className={`block p-2 rounded ${currentPage === "shipping" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"}`}
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-service/returns"
                    className={`block p-2 rounded ${currentPage === "returns" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"}`}
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-service/privacy"
                    className={`block p-2 rounded ${currentPage === "privacy" ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"}`}
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-6">{content.title}</h1>

            {currentPage === "faq" ? (
              <div className="space-y-6">
                {content.content.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-medium mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {content.content.map((item, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-medium mb-2">{item.heading}</h3>
                    <p className="text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container text-center">
          <p>
            &copy; {new Date().getFullYear()} Milk Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerService;

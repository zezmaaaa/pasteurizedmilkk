import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "../Footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-950/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Delivery Areas</h2>
          <p className="mb-4">
            We currently deliver to all major cities and municipalities in the
            Philippines. For remote areas, additional shipping fees may apply.
          </p>
          <p className="mb-4">Our primary service areas include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Metro Manila</li>
            <li>Cebu City</li>
            <li>Davao City</li>
            <li>Butuan City</li>
            <li>Cagayan de Oro</li>
            <li>Other major provincial capitals</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Shipping Times</h2>
          <p className="mb-4">
            We strive to deliver your dairy products as quickly as possible to
            ensure freshness. Estimated delivery times are as follows:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Local City Delivery:</strong> Same day to next day
              delivery
            </li>
            <li>
              <strong>Provincial Areas:</strong> 1-3 business days
            </li>
            <li>
              <strong>Remote Areas:</strong> 3-7 business days
            </li>
          </ul>
          <p className="mb-4">
            Please note that these are estimated times and may vary depending on
            weather conditions, holidays, and other factors beyond our control.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Shipping Fees</h2>
          <p className="mb-4">
            Shipping fees are calculated based on your location, order weight,
            and delivery speed:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Local City Delivery:</strong> ₱50 - ₱100
            </li>
            <li>
              <strong>Provincial Areas:</strong> ₱100 - ₱200
            </li>
            <li>
              <strong>Remote Areas:</strong> ₱200 - ₱300
            </li>
          </ul>
          <p className="mb-4">
            Orders above ₱1,000 qualify for free shipping within local city
            areas.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Special Handling</h2>
          <p className="mb-4">
            Our dairy products require special handling to maintain freshness
            and quality. All products are shipped in insulated packaging with
            ice packs when necessary to ensure they arrive in optimal condition.
          </p>
          <p className="mb-4">
            For any questions or concerns about shipping, please contact our
            customer service team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/faq">FAQ</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/returns">Returns & Refunds</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;

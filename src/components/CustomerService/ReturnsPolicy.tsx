import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "../Footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ReturnsPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-8">Returns & Refunds Policy</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Return Eligibility</h2>
          <p className="mb-4">
            Due to the perishable nature of dairy products, we have a limited
            return policy:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Damaged or Defective Products:</strong> If you receive
              damaged or defective products, you may return them for a full
              refund or replacement.
            </li>
            <li>
              <strong>Incorrect Items:</strong> If you receive items that don't
              match your order, you may return them for a full refund or the
              correct items.
            </li>
            <li>
              <strong>Quality Issues:</strong> If you have concerns about the
              quality of the products received, please contact us within 24
              hours of delivery.
            </li>
          </ul>
          <p className="mb-4">Please note that we cannot accept returns for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              Products that have been opened or partially consumed (unless
              defective)
            </li>
            <li>Products returned more than 24 hours after delivery</li>
            <li>
              Products that were properly delivered but not stored correctly
              after delivery
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Return Process</h2>
          <p className="mb-4">To initiate a return:</p>
          <ol className="list-decimal pl-6 mb-4">
            <li>
              Contact our customer service within 24 hours of receiving your
              order
            </li>
            <li>
              Provide your order number, details of the issue, and photos of the
              products if applicable
            </li>
            <li>
              Our team will review your request and provide instructions for the
              return process
            </li>
            <li>
              Do not discard the products until instructed, as we may need to
              inspect them
            </li>
          </ol>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Refund Process</h2>
          <p className="mb-4">Once your return is approved and processed:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Refunds will be issued to the original payment method</li>
            <li>Processing time for refunds is typically 3-5 business days</li>
            <li>
              You will receive an email confirmation when your refund has been
              processed
            </li>
          </ul>
          <p className="mb-4">
            For orders paid via Cash on Delivery, refunds will be processed
            through bank transfer or GCash.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Returns & Refunds Policy, please
            contact our customer service team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/faq">FAQ</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/shipping">Shipping Policy</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnsPolicy;

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "../Footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect the following types of information when you use our
            services:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, shipping address, and billing information.
            </li>
            <li>
              <strong>Account Information:</strong> Login credentials and user
              preferences.
            </li>
            <li>
              <strong>Transaction Information:</strong> Purchase history, order
              details, and payment information.
            </li>
            <li>
              <strong>Usage Information:</strong> How you interact with our
              website, including browsing behavior and product preferences.
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-4">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Processing and fulfilling your orders</li>
            <li>Managing your account and providing customer support</li>
            <li>Communicating with you about orders, products, and services</li>
            <li>Improving our website and services</li>
            <li>Personalizing your shopping experience</li>
            <li>
              Sending promotional offers and marketing communications (with your
              consent)
            </li>
            <li>Complying with legal obligations</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Information Sharing</h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers:</strong> Third-party companies that
              help us operate our business (payment processors, delivery
              services, etc.)
            </li>
            <li>
              <strong>Sellers:</strong> When you purchase products from sellers
              on our platform, we share necessary information to fulfill your
              order
            </li>
            <li>
              <strong>Legal Authorities:</strong> When required by law or to
              protect our rights
            </li>
          </ul>
          <p className="mb-4">
            We do not sell your personal information to third parties.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and review your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information (with certain limitations)</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Privacy Policy or how we handle
            your information, please contact our customer service team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/faq">FAQ</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

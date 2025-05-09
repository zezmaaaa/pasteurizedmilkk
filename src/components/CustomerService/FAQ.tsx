import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../Footer";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const FAQ = () => {
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
        <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I place an order?</AccordionTrigger>
              <AccordionContent>
                To place an order, browse our products, add items to your cart,
                and proceed to checkout. Fill in your shipping and payment
                information, then confirm your order. You'll receive an order
                confirmation email with details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent>
                We accept credit/debit cards, GCash, and cash on delivery (COD)
                for your convenience.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How long does delivery take?</AccordionTrigger>
              <AccordionContent>
                Delivery times vary depending on your location. Typically,
                orders are delivered within 1-3 business days for local areas
                and 3-7 business days for more remote locations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I track my order?</AccordionTrigger>
              <AccordionContent>
                Yes, once your order is shipped, you'll receive a tracking
                number via email. You can also check your order status by
                logging into your account and viewing your order history.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                What if I receive damaged products?
              </AccordionTrigger>
              <AccordionContent>
                If you receive damaged products, please contact our customer
                service within 24 hours of delivery with photos of the damaged
                items. We'll arrange for a replacement or refund.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>How do I return a product?</AccordionTrigger>
              <AccordionContent>
                To return a product, please contact our customer service within
                7 days of receiving your order. We'll provide you with return
                instructions and a return authorization number. Please note that
                perishable dairy products cannot be returned unless they were
                damaged or defective upon delivery.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>
                How do I become a seller on Milk Shop?
              </AccordionTrigger>
              <AccordionContent>
                To become a seller, click on the "Seller Login" option and then
                register as a new seller. You'll need to provide your business
                details and complete the verification process before you can
                start selling your dairy products.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6">
            Our customer service team is here to help you with any questions or
            concerns.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customer-service/shipping">Shipping Policy</Link>
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

export default FAQ;

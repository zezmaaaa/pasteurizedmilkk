import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally send the form data to a server
    alert("Thank you for your message! We'll get back to you soon.");
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
              to="#"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                const checkUserAndRedirect = async () => {
                  const user = await import("@/services/supabase").then(
                    (module) => module.getCurrentUser(),
                  );
                  if (user) {
                    const userType = user.user_metadata?.user_type;
                    if (userType === "customer") {
                      navigate("/customer/home");
                    } else if (userType === "seller") {
                      navigate("/seller/home");
                    } else {
                      navigate("/");
                    }
                  } else {
                    navigate("/");
                  }
                };
                checkUserAndRedirect();
              }}
            >
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6 sm:flex">
            <Link
              to="#"
              className="text-sm font-medium hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                const checkUserAndRedirect = async () => {
                  const user = await import("@/services/supabase").then(
                    (module) => module.getCurrentUser(),
                  );
                  if (user) {
                    const userType = user.user_metadata?.user_type;
                    if (userType === "customer") {
                      navigate("/customer/home");
                    } else if (userType === "seller") {
                      navigate("/seller/home");
                    } else {
                      navigate("/");
                    }
                  } else {
                    navigate("/");
                  }
                };
                checkUserAndRedirect();
              }}
            >
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
            <Link to="/contact" className="text-sm font-medium text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
            <p className="mb-8">
              Have questions about our products or services? We'd love to hear
              from you. Fill out the form and we'll get back to you as soon as
              possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p>pasteurizedmilk@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p>09987654321</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p>
                    Ampayon, Butuan City
                    <br />
                    Agusan del Norte, Philippines
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-gray-50 p-6 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" type="tel" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} required />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Visit Our Store</h2>
          <div className="aspect-video w-full bg-gray-200 rounded-lg">
            {/* This would normally be a Google Maps embed */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Map would be displayed here</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container text-center">
          <p>
            &copy; {new Date().getFullYear()} Milk Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

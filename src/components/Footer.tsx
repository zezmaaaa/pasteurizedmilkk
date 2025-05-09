import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Milk Shop</h3>
            <p className="text-sm">
              Your trusted source for fresh dairy products directly from local
              farms.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/customer/orders"
                  className="text-sm hover:text-white"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  to="/customer/service"
                  className="text-sm hover:text-white"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/customer/profile"
                  className="text-sm hover:text-white"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-sm not-italic">
              <p>Ampayon, Butuan City</p>
              <p>Butuan City, Philippines</p>
              <p className="mt-2">Email: pasteurizedmilk@gmail.com</p>
              <p>Phone: 09987654321</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Milk Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

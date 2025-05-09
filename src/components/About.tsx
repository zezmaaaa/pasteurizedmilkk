import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

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
            <Link to="/about" className="text-sm font-medium text-primary">
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

      <main className="container py-12">
        <h1 className="text-4xl font-bold mb-8">About Milk Shop</h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-4">
              Milk Shop was founded in 2024 as part of a student project, born
              from our passion for local agriculture and technology. Our goal
              was to create a platform that connects dairy farmers directly with
              consumers who value fresh, high-quality dairy products.
            </p>
            <p>
              What began as a simple idea for a school project has grown into a
              fully functional system, committed to promoting sustainability,
              supporting local farmers, and showcasing the power of student
              innovation.
            </p>
          </div>
          <div>
            <img
              src="/public/abt.jpg"
              className="rounded-lg shadow-md w-3/4 h-auto mx-auto"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Quality</h3>
              <p>
                We partner only with farms that meet our strict quality
                standards, ensuring every product that reaches your table is
                fresh and delicious.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Sustainability</h3>
              <p>
                We're committed to environmentally responsible practices, from
                sustainable farming to eco-friendly packaging and delivery
                methods.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">Community</h3>
              <p>
                By supporting local dairy farmers, we help strengthen local
                economies and preserve traditional farming knowledge and
                practices.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "J-ann Mahilum",
                role: "Developer",
                // Replace this URL with your actual image URL when available
                image: "/public/jann.jpg",
              },
              {
                name: "Efiel Vasquez",
                role: "System Analysist",
                // Replace this URL with your actual image URL when available
                image: "/public/efiel.jpg",
              },
              {
                name: "Jhonchris Torralba",
                role: "Developer",
                // Replace this URL with your actual image URL when available
                image: "/public/jc.jpg",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                {/* 
                  To use your own images:
                  1. Upload your images to a hosting service or place them in your public folder
                  2. Replace the image URLs above with your image URLs
                  3. For local images in public folder, use: "/your-image-name.jpg"
                */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
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

export default About;

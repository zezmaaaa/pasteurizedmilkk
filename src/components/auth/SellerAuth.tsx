import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmail, signUpSeller } from "@/services/supabase";
import {
  validateEmail,
  validatePassword,
  validateBusinessName,
  validateBusinessAddress,
} from "@/utils/validator";

interface SellerAuthProps {
  mode?: "login" | "register";
}

const SellerAuth: React.FC<SellerAuthProps> = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFormErrors({});

    // Validate form inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newFormErrors: Record<string, string> = {};
    if (!emailValidation.isValid)
      newFormErrors.email = emailValidation.error || "";
    if (!passwordValidation.isValid)
      newFormErrors.password = passwordValidation.error || "";

    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await signInWithEmail(email, password);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Check if the user is actually a seller
      if (response.user?.user_metadata?.user_type !== "seller") {
        setError(
          "This account is not registered as a seller. Please use the customer login if you are a customer.",
        );
        return;
      }

      // Redirect to seller home page after successful login
      navigate("/seller/home");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFormErrors({});

    // Validate all form inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const businessNameValidation = validateBusinessName(businessName);
    const businessAddressValidation = validateBusinessAddress(businessAddress);

    const newFormErrors: Record<string, string> = {};
    if (!emailValidation.isValid)
      newFormErrors.email = emailValidation.error || "";
    if (!passwordValidation.isValid)
      newFormErrors.password = passwordValidation.error || "";
    if (!businessNameValidation.isValid)
      newFormErrors.businessName = businessNameValidation.error || "";
    if (!businessAddressValidation.isValid)
      newFormErrors.businessAddress = businessAddressValidation.error || "";

    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await signUpSeller({
        email,
        password,
        business_name: businessName,
        business_address: businessAddress,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      // Redirect to login tab after successful registration
      setActiveTab("login");
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
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

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center justify-center mb-4">
              <img
                src="https://i.ibb.co/Jy3MFQP/milk-logo.png"
                alt="Milk Shop Logo"
                className="h-24 w-auto mb-2"
              />
            </div>
            <CardTitle className="text-2xl text-center">Milk Shop</CardTitle>
            <CardDescription className="text-center">
              Seller Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "login" | "register")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={formErrors.email ? "border-destructive" : ""}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={
                          formErrors.password ? "border-destructive" : ""
                        }
                        required
                      />
                      {formErrors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {formErrors.password}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="Your Dairy Farm"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className={
                        formErrors.businessName ? "border-destructive" : ""
                      }
                      required
                    />
                    {formErrors.businessName && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.businessName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input
                      id="businessAddress"
                      placeholder="123 Dairy Lane, Milk City"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className={
                        formErrors.businessAddress ? "border-destructive" : ""
                      }
                      required
                    />
                    {formErrors.businessAddress && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.businessAddress}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Business Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="business@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={formErrors.email ? "border-destructive" : ""}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={
                          formErrors.password ? "border-destructive" : ""
                        }
                        required
                      />
                      {formErrors.password && (
                        <p className="text-sm text-destructive mt-1">
                          {formErrors.password}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Seller Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Are you a customer?{" "}
              <Link
                to="/customer/login"
                className="text-primary hover:underline"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SellerAuth;

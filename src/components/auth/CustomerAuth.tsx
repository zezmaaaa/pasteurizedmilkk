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
import { signInWithEmail, signUpCustomer } from "@/services/supabase";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validateAddress,
  validatePhoneNumber,
} from "@/utils/validator";

interface CustomerAuthProps {
  mode?: "login" | "register";
}

const CustomerAuth: React.FC<CustomerAuthProps> = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      console.log("Submitting login form with email:", email);
      const response = await signInWithEmail(email, password);
      console.log("Login response:", response);

      if (response.error) {
        setError(response.error);
        return;
      }

      // Check if the user is actually a customer
      if (response.user?.user_metadata?.user_type !== "customer") {
        setError(
          "This account is not registered as a customer. Please use the seller login if you are a seller.",
        );
        return;
      }

      // Check if there's a redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect");

      // Redirect to checkout if that's where they were going, otherwise to customer home
      if (redirectTo === "checkout") {
        navigate("/customer/checkout");
      } else {
        navigate("/customer/home");
      }
    } catch (err) {
      console.error("Login error:", err);
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
    const passwordMatchValidation = validatePasswordMatch(
      password,
      confirmPassword,
    );
    const nameValidation = validateName(name);
    const addressValidation = validateAddress(address);
    const phoneValidation = validatePhoneNumber(phoneNumber);

    const newFormErrors: Record<string, string> = {};
    if (!emailValidation.isValid)
      newFormErrors.email = emailValidation.error || "";
    if (!passwordValidation.isValid)
      newFormErrors.password = passwordValidation.error || "";
    if (!passwordMatchValidation.isValid)
      newFormErrors.confirmPassword = passwordMatchValidation.error || "";
    if (!nameValidation.isValid)
      newFormErrors.name = nameValidation.error || "";
    if (!addressValidation.isValid)
      newFormErrors.address = addressValidation.error || "";
    if (!phoneValidation.isValid)
      newFormErrors.phoneNumber = phoneValidation.error || "";

    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await signUpCustomer({
        email,
        password,
        name,
        address,
        phone_number: phoneNumber,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      // Check if there's a redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect");

      if (redirectTo === "checkout") {
        // If they were trying to checkout, log them in automatically and redirect
        const loginResponse = await signInWithEmail(email, password);
        if (!loginResponse.error) {
          navigate("/customer/checkout");
        } else {
          setActiveTab("login");
        }
      } else {
        // Otherwise just switch to login tab
        setActiveTab("login");
      }
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
                src="/lgog.png"
                alt="Milk Shop Logo"
                className="h-24 w-auto mb-2"
              />
            </div>
            <CardTitle className="text-2xl text-center">Milk Shop</CardTitle>
            <CardDescription className="text-center">
              Customer Portal
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
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
                        className="absolute right-0 top-0"
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={formErrors.name ? "border-destructive" : ""}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
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
                        className="absolute right-0 top-0"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={
                          formErrors.confirmPassword ? "border-destructive" : ""
                        }
                        required
                      />
                      {formErrors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {formErrors.confirmPassword}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Your complete address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={formErrors.address ? "border-destructive" : ""}
                      required
                    />
                    {formErrors.address && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.address}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="Your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={
                        formErrors.phoneNumber ? "border-destructive" : ""
                      }
                      required
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {formErrors.phoneNumber}
                      </p>
                    )}
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Are you a seller?{" "}
              <Link to="/seller/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CustomerAuth;

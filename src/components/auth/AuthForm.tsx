import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  onLogin?: (email: string, password: string) => void;
  onRegister?: (data: {
    name: string;
    email: string;
    password: string;
    accountType: "customer" | "seller";
  }) => void;
  showAccountTypeSelection?: boolean;
  defaultTab?: "login" | "signup";
  redirectAfterLogin?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onLogin,
  onRegister,
  showAccountTypeSelection = true,
  defaultTab = "login",
  redirectAfterLogin,
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"customer" | "seller">(
    "customer",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(email, password);
    } else {
      console.log("Login with:", { email, password, redirectAfterLogin });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRegister) {
      onRegister({ name, email, password, accountType });
    } else {
      console.log("Register with:", {
        name,
        email,
        password,
        accountType,
        redirectAfterLogin,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignupPasswordVisibility = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4">
        <img
          src="https://i.ibb.co/Jy3MFQP/milk-logo.png"
          alt="Milk Shop Logo"
          className="h-24 w-auto mb-2"
        />
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "login" | "signup")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="space-y-4 pt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="milk@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={togglePasswordVisibility}
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
            <div className="flex justify-between">
              <Button type="submit" variant="outline">
                Customer Login
              </Button>
              <Button
                type="button"
                onClick={() => (window.location.href = "/seller/login")}
              >
                Seller Login
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="signup" className="space-y-4 pt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="milk@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showSignupPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleSignupPasswordVisibility}
                >
                  {showSignupPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showSignupPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            {showAccountTypeSelection && (
              <div className="space-y-2">
                <Label htmlFor="account-type">Account Type</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="customer"
                      name="account-type"
                      value="customer"
                      checked={accountType === "customer"}
                      onChange={() => setAccountType("customer")}
                      className="mr-2"
                    />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="seller"
                      name="account-type"
                      value="seller"
                      checked={accountType === "seller"}
                      onChange={() => setAccountType("seller")}
                      className="mr-2"
                    />
                    <Label htmlFor="seller">Seller</Label>
                  </div>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AuthForm;

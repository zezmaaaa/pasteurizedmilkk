import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, LogOut, Save, Trash2 } from "lucide-react";
import { getCurrentUser, signOut, deleteAccount } from "@/services/supabase";
import { useCart } from "@/context/CartContext";
import { getHomeLink } from "@/utils/navigation";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    address: string;
    phone_number: string;
  }>({
    name: "",
    email: "",
    address: "",
    phone_number: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/customer/login");
        return;
      }

      setUserData({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        address: user.user_metadata?.address || "",
        phone_number: user.user_metadata?.phone_number || "",
      });
      setUserType(user.user_metadata?.user_type || null);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    // Implement save changes functionality
    // This would update the user's metadata in Supabase
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link
              to={getHomeLink(userType)}
              className="flex items-center gap-2"
            >
              <span className="text-2xl font-bold text-primary">Milk Shop</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/customer/home"
              className="text-sm font-medium hover:text-primary"
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
              to="/customer/orders"
              className="text-sm font-medium hover:text-primary"
            >
              My Orders
            </Link>
            <Link
              to="/customer/profile"
              className="text-sm font-medium hover:text-primary"
            >
              My Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/customer/cart" className="relative">
              <span className="sr-only">Shopping Cart</span>
              {useCart().getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {useCart().getCartCount()}
                </span>
              )}
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto pb-4 mb-4 border-b">
            <Link
              to="/customer/home"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/customer/orders"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              My Orders
            </Link>
            <Link
              to="/customer/profile"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary"
            >
              My Profile
            </Link>
          </div>

          {/* Profile Content */}
          <div className="w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={userData.address}
                        onChange={(e) =>
                          setUserData({ ...userData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={userData.phone_number}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            phone_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="w-full md:w-auto"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete Account
                      <Trash2 className="ml-2 h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;

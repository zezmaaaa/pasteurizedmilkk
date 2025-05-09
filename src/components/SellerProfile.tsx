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
import { getHomeLink } from "@/utils/navigation";

const SellerProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    business_name: string;
    email: string;
    business_address: string;
  }>({
    business_name: "",
    email: "",
    business_address: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/seller/login");
        return;
      }

      setUserData({
        business_name: user.user_metadata?.business_name || "",
        email: user.email || "",
        business_address: user.user_metadata?.business_address || "",
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
              to="/seller/home"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/seller/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/seller/orders"
              className="text-sm font-medium hover:text-primary"
            >
              Orders
            </Link>
            <Link
              to="/seller/profile"
              className="text-sm font-medium hover:text-primary"
            >
              My Profile
            </Link>
          </nav>

          <div className="flex items-center gap-4">
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
              to="/seller/home"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/seller/dashboard"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              Products
            </Link>
            <Link
              to="/seller/orders"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium hover:text-primary"
            >
              Orders
            </Link>
            <Link
              to="/seller/profile"
              className="px-4 py-2 whitespace-nowrap text-sm font-medium text-primary"
            >
              My Profile
            </Link>
          </div>

          {/* Profile Content */}
          <div className="w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Manage your business information and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input
                        id="business_name"
                        value={userData.business_name}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            business_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_address">Business Address</Label>
                    <Input
                      id="business_address"
                      value={userData.business_address}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          business_address: e.target.value,
                        })
                      }
                    />
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
                        delete your business account and remove your data from
                        our servers.
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

export default SellerProfile;

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  PlusCircle,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"customer" | "seller">("customer");

  // Toggle between customer and seller views for demo purposes
  const toggleRole = () => {
    setUserRole(userRole === "customer" ? "seller" : "customer");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen p-4 border-r">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-xl font-bold">Milk Shop</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {userRole === "customer" ? "John Doe" : "Farm Fresh"}
                </p>
                <p className="text-sm text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={toggleRole}>
              Switch to {userRole === "customer" ? "Seller" : "Customer"}
            </Button>
          </div>

          <nav className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            {userRole === "customer" ? (
              <>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Saved Products
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </>
            )}

            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {userRole === "customer"
                ? "Customer Dashboard"
                : "Seller Dashboard"}
            </h1>
            <p className="text-gray-500">
              {userRole === "customer"
                ? "View your orders, saved products, and account settings"
                : "Manage your products, orders, and view analytics"}
            </p>
          </div>

          {userRole === "customer" ? (
            <CustomerDashboard />
          ) : (
            <SellerDashboard />
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerDashboard() {
  return (
    <div>
      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="saved">Saved Products</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View and track your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1234</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>Organic Whole Milk (2), Butter</TableCell>
                    <TableCell>$18.50</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Delivered
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1235</TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>Low-Fat Milk, Yogurt (3)</TableCell>
                    <TableCell>$12.75</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Shipped
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1236</TableCell>
                    <TableCell>May 5, 2023</TableCell>
                    <TableCell>Chocolate Milk, Cheese</TableCell>
                    <TableCell>$15.25</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Delivered
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Products</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: 1,
                    name: "Organic Whole Milk",
                    price: "$4.99",
                    image:
                      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80",
                  },
                  {
                    id: 2,
                    name: "Farm Fresh Yogurt",
                    price: "$3.50",
                    image:
                      "https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=300&q=80",
                  },
                  {
                    id: 3,
                    name: "Artisan Cheese",
                    price: "$6.75",
                    image:
                      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80",
                  },
                ].map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.price}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm">Add to Cart</Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input id="phone" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address
                      </label>
                      <Input
                        id="address"
                        defaultValue="123 Milk St, Dairy City"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="notifications"
                        className="text-sm font-medium"
                      >
                        Email Notifications
                      </label>
                      <select
                        id="notifications"
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                        defaultValue="all"
                      >
                        <option value="all">All notifications</option>
                        <option value="important">Important only</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SellerDashboard() {
  return (
    <div>
      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove your products
                </CardDescription>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&q=80"
                          alt="Organic Whole Milk"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>Organic Whole Milk</span>
                      </div>
                    </TableCell>
                    <TableCell>Milk</TableCell>
                    <TableCell>$4.99</TableCell>
                    <TableCell>120 units</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=100&q=80"
                          alt="Farm Fresh Yogurt"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>Farm Fresh Yogurt</span>
                      </div>
                    </TableCell>
                    <TableCell>Yogurt</TableCell>
                    <TableCell>$3.50</TableCell>
                    <TableCell>85 units</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&q=80"
                          alt="Artisan Cheese"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>Artisan Cheese</span>
                      </div>
                    </TableCell>
                    <TableCell>Cheese</TableCell>
                    <TableCell>$6.75</TableCell>
                    <TableCell>42 units</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        Low Stock
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Customer Orders</CardTitle>
              <CardDescription>View and manage incoming orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1234</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>May 15, 2023</TableCell>
                    <TableCell>Organic Whole Milk (2), Butter</TableCell>
                    <TableCell>$18.50</TableCell>
                    <TableCell>
                      <select
                        className="text-xs rounded-md border border-input bg-transparent px-2 py-1"
                        defaultValue="delivered"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1235</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>May 14, 2023</TableCell>
                    <TableCell>Low-Fat Milk, Yogurt (3)</TableCell>
                    <TableCell>$12.75</TableCell>
                    <TableCell>
                      <select
                        className="text-xs rounded-md border border-input bg-transparent px-2 py-1"
                        defaultValue="shipped"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#ORD-1236</TableCell>
                    <TableCell>Robert Johnson</TableCell>
                    <TableCell>May 13, 2023</TableCell>
                    <TableCell>Chocolate Milk, Cheese</TableCell>
                    <TableCell>$15.25</TableCell>
                    <TableCell>
                      <select
                        className="text-xs rounded-md border border-input bg-transparent px-2 py-1"
                        defaultValue="processing"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,458.75</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,423</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  +4.6% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Organic Whole Milk</p>
                      <p className="text-xs text-gray-500">$4,675.25 (38%)</p>
                    </div>
                    <p className="text-sm font-medium">935 units</p>
                  </div>
                  <Progress value={38} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Farm Fresh Yogurt</p>
                      <p className="text-xs text-gray-500">$3,242.50 (26%)</p>
                    </div>
                    <p className="text-sm font-medium">926 units</p>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Artisan Cheese</p>
                      <p className="text-xs text-gray-500">$2,541.00 (20%)</p>
                    </div>
                    <p className="text-sm font-medium">376 units</p>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Other Products</p>
                      <p className="text-xs text-gray-500">$2,000.00 (16%)</p>
                    </div>
                    <p className="text-sm font-medium">Various</p>
                  </div>
                  <Progress value={16} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

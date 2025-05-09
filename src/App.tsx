import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home.tsx";
import routes from "tempo-routes";
import About from "./components/About";
import Contact from "./components/Contact";
import { CartProvider } from "./context/CartContext";

// Lazy load components for better performance
const CustomerAuth = lazy(() => import("./components/auth/CustomerAuth"));
const SellerAuth = lazy(() => import("./components/auth/SellerAuth"));
const BrowseProducts = lazy(() => import("./components/BrowseProducts"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const ShoppingCart = lazy(() => import("./components/ShoppingCart"));
const Checkout = lazy(() => import("./components/Checkout"));
const ViewOrders = lazy(() => import("./components/ViewOrders"));
const OrderDetail = lazy(() => import("./components/OrderDetail"));
const SellerDashboard = lazy(() => import("./components/SellerDashboard"));
const CustomerService = lazy(() => import("./components/CustomerService"));
const CustomerHomePage = lazy(() => import("./components/CustomerHomePage"));
const SellerHomePage = lazy(() => import("./components/SellerHomePage"));
const CustomerProfile = lazy(() => import("./components/CustomerProfile"));
const SellerProfile = lazy(() => import("./components/SellerProfile"));
const SellerOrders = lazy(() => import("./components/SellerOrders"));
const SellerOrderDetail = lazy(() => import("./components/SellerOrderDetail"));
const SellerCheckout = lazy(() => import("./components/SellerCheckout"));
const SellerPurchasedOrders = lazy(
  () => import("./components/SellerPurchasedOrders"),
);
const SellerPurchasedOrderDetail = lazy(
  () => import("./components/SellerPurchasedOrderDetail"),
);

function App() {
  return (
    <CartProvider>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <p className="text-xl">Loading...</p>
          </div>
        }
      >
        <>
          {/* For the tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseProducts />} />
            <Route path="/product-detail/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Customer Service Routes */}
            <Route
              path="/customer-service/:page"
              element={<CustomerService />}
            />
            <Route
              path="/faq"
              element={<Navigate to="/customer-service/faq" replace />}
            />
            <Route
              path="/shipping"
              element={<Navigate to="/customer-service/shipping" replace />}
            />
            <Route
              path="/returns"
              element={<Navigate to="/customer-service/returns" replace />}
            />
            <Route
              path="/privacy"
              element={<Navigate to="/customer-service/privacy" replace />}
            />

            {/* Customer Routes */}
            <Route path="/customer">
              <Route path="login" element={<CustomerAuth mode="login" />} />
              <Route
                path="register"
                element={<CustomerAuth mode="register" />}
              />
              <Route path="home" element={<CustomerHomePage />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders" element={<ViewOrders />} />
              <Route path="orders/:orderId" element={<OrderDetail />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Seller Routes */}
            <Route path="/seller">
              <Route path="login" element={<SellerAuth mode="login" />} />
              <Route path="register" element={<SellerAuth mode="register" />} />
              <Route path="home" element={<SellerHomePage />} />
              <Route path="dashboard" element={<SellerDashboard />} />
              <Route path="profile" element={<SellerProfile />} />
              <Route path="orders" element={<SellerOrders />} />
              <Route path="orders/:orderId" element={<SellerOrderDetail />} />
              <Route path="checkout" element={<SellerCheckout />} />
              <Route
                path="purchased-orders"
                element={<SellerPurchasedOrders />}
              />
              <Route
                path="purchased-orders/:orderId"
                element={<SellerPurchasedOrderDetail />}
              />
              <Route
                path="products/:productId/edit"
                element={<SellerDashboard />}
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      </Suspense>
    </CartProvider>
  );
}

export default App;

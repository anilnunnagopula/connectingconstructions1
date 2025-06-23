import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Footer from "./components/Footer";
import Materials from "./pages/Materials";
import MyProducts from "./pages/supplier/MyProducts";
import AddProduct from "./pages/supplier/AddProduct";
import EditProduct from "./pages/supplier/EditProduct";
import { LoadScript } from "@react-google-maps/api";
import CategoryPage from "./pages/CategoryPage";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop";
import CustomerNotifications from "./pages/customer/CustomerNotifications";
import OrderTracking from "./pages/customer/OrderTracking";
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";

// ✅ Import your context provider
import { DarkModeProvider } from "./context/DarkModeContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <DarkModeProvider>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <ScrollToTop />

              <div className="flex-grow">
                <Routes>
                  {/* ✅ Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/about" element={<About />} />

                  <Route path="/supplier/products" element={<MyProducts />} />
                  <Route
                    path="/supplier/add-product"
                    element={<AddProduct />}
                  />
                  <Route path="/supplier/edit/:id" element={<EditProduct />} />
                  <Route
                    path="/category/:category"
                    element={<CategoryPage />}
                  />

                  {/* ✅ Customer Routes (Protected) */}
                  <Route
                    path="/customer-dashboard"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard/my-orders"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <MyOrders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard/cart"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard/checkout"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard/notifications"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <CustomerNotifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer-dashboard/track-order"
                    element={
                      <ProtectedRoute allowedRole="customer">
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ General Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/supplier-dashboard"
                    element={
                      <ProtectedRoute allowedRole="supplier">
                        <SupplierDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* ✅ Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>

              <Chatbot />
              <Footer />
            </div>
          </Router>
        </LoadScript>
      </DarkModeProvider>
    </CartProvider>
  );
}

export default App;

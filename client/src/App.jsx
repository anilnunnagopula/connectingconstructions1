import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";

// Import your pages and components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
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
import EditProduct from "./pages/supplier/EditProduct"; // Make sure this import is present
import CategoryPage from "./pages/CategoryPage";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop";
import CustomerNotifications from "./pages/customer/CustomerNotifications";
import OrderTracking from "./pages/customer/OrderTracking";
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import HelpAndSupport from "./components/HelpAndSupport";
//legal pages
import CorePolicies from "./pages/legal/CorePolicies";
import SmartPlatform from "./pages/legal/SmartPlatform";
import SupplierPartner from "./pages/legal/SupplierPartner";
import CustomerPlatform from "./pages/legal/CustomerPlatform";
import Monetization from "./pages/legal/Monetization";

import TermsAndConditions from "./pages/legal/TermsAndConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import CookiePolicy from "./pages/legal/CookiePolicy.jsx";
import Disclaimer from "./pages/legal/Disclaimer.jsx";
import DataProtection from "./pages/legal/DataProtection.jsx";
import SecurityPractices from "./pages/legal/SecurityPractices.jsx";

import SupplierAgreement from "./pages/legal/SupplierAgreement.jsx";
import ProductGuidelines from "./pages/legal/ProductGuidelines.jsx";
import LogisticsAgreement from "./pages/legal/LogisticsAgreement.jsx";
import PricingPolicy from "./pages/legal/PricingPolicy.jsx";
import ReturnRefundPolicy from "./pages/legal/ReturnRefundPolicy.jsx";
import ShippingPolicy from "./pages/legal/ShippingPolicy.jsx";
import CancellationPolicy from "./pages/legal/CancellationPolicy.jsx";


// Import context providers
import { DarkModeProvider } from "./context/DarkModeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a new query client instance
const queryClient = new QueryClient();

// It's generally better to define LoadScript once at the top level
// and let child components use useJsApiLoader without passing libraries,
// but if you have multiple LoadScript instances, ensure their `id` is unique.
// For simplicity, we'll keep the LoadScript here as per your original structure.
import { LoadScript } from "@react-google-maps/api";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <DarkModeProvider>
              {/* LoadScript should ideally be higher up or used with useJsApiLoader in components */}
              <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                // Libraries should be specified here if LoadScript is used globally,
                // or in each useJsApiLoader call if LoadScript is not global.
                // For now, assuming individual components handle their libraries.
                // If you face "Loader must not be called again with different options" again,
                // consider moving all libraries here: libraries={["places", "maps", "marker"]}
              >
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <ScrollToTop />

                  <div className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                      />
                      <Route path="/verify-otp" element={<VerifyOtp />} />
                      <Route path="/materials" element={<Materials />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/support" element={<HelpAndSupport />} />
                      {/* legal routes  */}
                      <Route
                        path="/legal/supplier-partner"
                        element={<SupplierPartner />}
                      />
                      <Route
                        path="/legal/core-policies"
                        element={<CorePolicies />}
                      />
                      <Route
                        path="/legal/customer-platform"
                        element={<CustomerPlatform />}
                      />
                      <Route
                        path="/legal/smart-platform"
                        element={<SmartPlatform />}
                      />
                      <Route
                        path="/legal/monetization"
                        element={<Monetization />}
                      />
                      {/* legal of core polices  */}
                      <Route
                        path="/legal/termsandconditions"
                        element={<TermsAndConditions />}
                      />
                      <Route
                        path="/legal/privacypolicy"
                        element={<PrivacyPolicy />}
                      />
                      <Route
                        path="/legal/cookiepolicy"
                        element={<CookiePolicy />}
                      />
                      <Route
                        path="/legal/disclaimer"
                        element={<Disclaimer />}
                      />
                      <Route
                        path="/legal/dataprotection"
                        element={<DataProtection />}
                      />
                      <Route
                        path="/legal/securitypractices"
                        element={<SecurityPractices />}
                      />
                      <Route
                        path="/legal/supplieragreement"
                        element={<SupplierAgreement />}
                      />
                      <Route
                        path="/legal/productguidelines"
                        element={<ProductGuidelines />}
                      />
                      <Route
                        path="/legal/logisticsagreement"
                        element={<LogisticsAgreement />}
                      />
                      <Route
                        path="/legal/pricingpolicy"
                        element={<PricingPolicy />}
                      />
                      <Route
                        path="/legal/returnrefundpolicy"
                        element={<ReturnRefundPolicy />}
                      />
                      <Route
                        path="/legal/shippingpolicy"
                        element={<ShippingPolicy />}
                      />
                      <Route
                        path="/legal/cancellationpolicy"
                        element={<CancellationPolicy />}
                      />
                      {/* Supplier Public-ish Routes (can be accessed without ProtectedRoute if desired, but often linked from dashboard) */}
                      <Route
                        path="/supplier/products"
                        element={<MyProducts />}
                      />
                      <Route
                        path="/supplier/add-product"
                        element={<AddProduct />}
                      />
                      <Route
                        path="/supplier/edit-product/:id"
                        element={<EditProduct />}
                      />{" "}
                      <Route
                        path="/category/:category"
                        element={<CategoryPage />}
                      />
                      {/* Customer Routes (Protected) */}
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
                      {/* General Protected Routes */}
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
                      {/* Fallback */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>

                  <Chatbot />
                  <Footer />
                </div>
              </LoadScript>
            </DarkModeProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

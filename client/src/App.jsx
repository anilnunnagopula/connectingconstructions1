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
import CompleteProfile from "./pages/CompleteProfile.jsx";
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
import CustomerLayout from "./layout/CustomerLayout";
import Materials from "./pages/Materials";

import MyProducts from "./pages/supplier/MyProducts";
import AddProduct from "./pages/supplier/AddProduct";
import EditProduct from "./pages/supplier/EditProduct";
import ProductDetail from "./pages/supplier/ProductDetail.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import LocationPage from "./pages/supplier/LocationPage.jsx";
import SettingsPage from "./pages/supplier/SettingsPage.jsx";
import CategoriesPage from "./pages/supplier/CategoriesPage.jsx";
import OrdersPage from "./pages/supplier/OrdersPage.jsx";
import LicenseAndCertificatesPage from "./pages/supplier/LicenseAndCertificatesPage";
import PaymentsPage from "./pages/supplier/PaymentsPage.jsx";
import AnalyticsPage from "./pages/supplier/AnalyticsPage.jsx";
import SyncInventoryPage from "./pages/supplier/SyncInventoryPage.jsx";
import ManageOffersPage from "./pages/supplier/ManageOffersPage.jsx";
import OfferFormPage from "./pages/supplier/OfferFormPage.jsx";
import SupplierBottomNav from "./components/SupplierBottomNav.jsx";

import ActivityLogsPage from "./pages/supplier/ActivityLogsPage";
import CustomerFeedbackPage from "./pages/supplier/CustomerFeedbackPage";
import DeliveryStatusPage from "./pages/supplier/DeliveryStatusPage";
import NotificationsPage from "./pages/supplier/NotificationsPage";
import TopProductsPage from "./pages/supplier/TopProductsPage";

import CategoryPage from "./pages/CategoryPage";
import Chatbot from "./components/Chatbot";
import ScrollToTop from "./components/ScrollToTop";
// import CustomerNotifications from "./pages/customer/CustomerNotifications";
import OrderTracking from "./pages/customer/OrderTracking";
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import HelpAndSupport from "./components/HelpAndSupport";
import CustomerSettingsPage from "./pages/customer/CustomerSettingsPage.jsx";
import OrderSuccess from "./pages/customer/OrderSuccess";
import RequestQuote from "./pages/customer/RequestQuote";
import MyQuotes from "./pages/customer/MyQuotes";
import QuoteDetails from "./pages/customer/QuoteDetails";
import OrderDetails from "./pages/customer/OrderDetails";
import WriteReview from "./pages/customer/WriteReview";
import Wishlist from "./pages/customer/Wishlist";
import AddressManagement from "./pages/customer/AddressManagement";
import QuickReorder from "./pages/customer/QuickReorder";
import Invoices from "./pages/customer/Invoices";
import PaymentMethods from "./pages/customer/PaymentMethods";

import ErrorBoundary from "./components/ErrorBoundary";

import QuoteRequests from "./pages/supplier/QuoteRequests";
import RespondToQuote from "./pages/supplier/RespondToQuote";
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

// Import Customer Policy Components
import OrderPlacementTracking from "./pages/legal/OrderPlacementTracking";
import PaymentRefundGuidelines from "./pages/legal/PaymentRefundGuidelines";
import ReviewSystemIntegrity from "./pages/legal/ReviewSystemIntegrity";
import SupportGrievanceRedressal from "./pages/legal/SupportGrievanceRedressal";
import CustomerAgreement from "./pages/legal/CustomerAgreement";
import PlatformPolicy from "./pages/legal/PlatformPolicy";
import GeneralReviewPolicy from "./pages/legal/GeneralReviewPolicy";
import Disputes from "./pages/legal/Disputes";
import LocationTerms from "./pages/legal/LocationTerms";
import LaborTerms from "./pages/legal/LaborTerms";
import CustomerNotifications from "./pages/customer/CustomerNotifications";

// Import Smart Platform Policy Components
import AIGeneratedInsightsDisclaimer from "./pages/legal/AIGeneratedInsightsDisclaimer";
import AlgorithmicFairnessPolicy from "./pages/legal/AlgorithmicFairnessPolicy";
import TransparentRecommendationLogic from "./pages/legal/TransparentRecommendationLogic";
import UserConsentForSmartFeatures from "./pages/legal/UserConsentForSmartFeatures";

// Import Monetization & Revenue Policy Components
import SubscriptionPlans from "./pages/legal/SubscriptionPolicy.jsx";
import CommissionModelOverview from "./pages/legal/CommissionModelOverview";
import AdPlacementFeaturedListings from "./pages/legal/AdPlacementFeaturedListings";
// import LegalInquiries from "./pages/legal/LegalInquiries";

// AI Components
import VoiceCommand from "./ai/VoiceCommand";

import AffiliateRevenueProgram from "./pages/legal/AffiliateRevenueProgram";
// Import context providers
import { DarkModeProvider } from "./context/DarkModeContext";
import { CartProvider } from "./context/CartContext";
import { ConversationProvider } from "./context/ConversationContext";
import { AuthProvider } from "./context/AuthContext";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Create a new query client instance
const queryClient = new QueryClient();
// ... existing imports

import { LoadScript } from "@react-google-maps/api";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <ConversationProvider>
                <DarkModeProvider>
                  <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  >
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <ScrollToTop />
                      <Chatbot />

                      <div className="flex-grow">
                      <ErrorBoundary>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                          path="/complete-profile"
                          element={<CompleteProfile />}
                        />
                        <Route
                          path="/forgot-password"
                          element={<ForgotPassword />}
                        />
                        <Route
                          path="/reset-password/:token"
                          element={<ResetPassword />}
                        />
                        <Route path="/verify-otp" element={<VerifyOtp />} />
                        <Route path="/materials" element={<Materials />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/support" element={<HelpAndSupport />} />
                        {/* Customer routes  */}
                        <Route
                          path="/customer/settings"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <CustomerLayout>
                                <CustomerSettingsPage />
                              </CustomerLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/notifications"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <CustomerNotifications />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/order-success/:orderId"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <OrderSuccess />
                            </ProtectedRoute>
                          }
                        />
                        {/* Order Details */}
                        <Route
                          path="/customer/orders/:orderId"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <OrderDetails />
                            </ProtectedRoute>
                          }
                        />
                        {/* Write Review */}
                        <Route
                          path="/customer/orders/:orderId/review"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <WriteReview />
                            </ProtectedRoute>
                          }
                        />
                        {/* Wishlist */}
                        <Route
                          path="/customer/wishlist"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <Wishlist />
                            </ProtectedRoute>
                          }
                        />
                        {/* Address Management */}
                        <Route
                          path="/customer/addresses"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <AddressManagement />
                            </ProtectedRoute>
                          }
                        />
                        {/* Quick Reorder */}
                        <Route
                          path="/customer/reorder"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <QuickReorder />
                            </ProtectedRoute>
                          }
                        />
                        {/* Invoices */}
                        <Route
                          path="/customer/invoices"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <Invoices />
                            </ProtectedRoute>
                          }
                        />
                        {/* Payment Methods */}
                        <Route
                          path="/customer/payment-methods"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <PaymentMethods />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/order-tracking"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <OrderTracking />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/materials"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <CustomerLayout>
                                <Materials />
                              </CustomerLayout>
                            </ProtectedRoute>
                          }
                        />
                        {/* Customer Quote Routes */}
                        <Route
                          path="/customer/quotes/request"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <RequestQuote />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/quotes"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <MyQuotes />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/quote-requests"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <QuoteRequests />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/quotes/:id"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <QuoteDetails />
                            </ProtectedRoute>
                          }
                        />
                        {/* Supplier Quote Routes */}
                        <Route
                          path="/supplier/quotes"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <QuoteRequests />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/quotes/respond/:id"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <RespondToQuote />
                            </ProtectedRoute>
                          }
                        />
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
                        {/* Customer Policy Pages */}
                        <Route
                          path="/legal/orderplacementtracking"
                          element={<OrderPlacementTracking />}
                        />
                        <Route
                          path="/legal/paymentrefundguidelines"
                          element={<PaymentRefundGuidelines />}
                        />
                        <Route
                          path="/legal/reviewsystemintegrity"
                          element={<ReviewSystemIntegrity />}
                        />
                        <Route
                          path="/legal/supportgrievance"
                          element={<SupportGrievanceRedressal />}
                        />
                        <Route
                          path="/legal/customeragreement"
                          element={<CustomerAgreement />}
                        />
                        <Route
                          path="/legal/platformpolicy"
                          element={<PlatformPolicy />}
                        />
                        <Route
                          path="/legal/reviewpolicy"
                          element={<GeneralReviewPolicy />}
                        />
                        <Route path="/legal/disputes" element={<Disputes />} />
                        <Route
                          path="/legal/locationterms"
                          element={<LocationTerms />}
                        />
                        <Route
                          path="/legal/laborterms"
                          element={<LaborTerms />}
                        />
                        {/* Smart Platform Policies */}
                        <Route
                          path="/legal/aigeneratedinsightsdisclaimer"
                          element={<AIGeneratedInsightsDisclaimer />}
                        />
                        <Route
                          path="/legal/algorithmicfairnesspolicy"
                          element={<AlgorithmicFairnessPolicy />}
                        />
                        <Route
                          path="/legal/transparentrecommendationlogic"
                          element={<TransparentRecommendationLogic />}
                        />
                        <Route
                          path="/legal/userconsentforsmartfeatures"
                          element={<UserConsentForSmartFeatures />}
                        />
                        {/* Monetization & Revenue Policies */}
                        <Route
                          path="/legal/suppliersubscriptionplans"
                          element={<SubscriptionPlans />}
                        />
                        <Route
                          path="/legal/commissionmodel"
                          element={<CommissionModelOverview />}
                        />
                        <Route
                          path="/legal/adplacement"
                          element={<AdPlacementFeaturedListings />}
                        />
                        <Route
                          path="/legal/affiliaterevenueprogram"
                          element={<AffiliateRevenueProgram />}
                        />
                        {/* Supplier Routes */}
                        <Route
                          path="/supplier/myproducts"
                          element={<MyProducts />}
                        />
                        <Route
                          path="/supplier/add-product"
                          element={<AddProduct />}
                        />
                        <Route
                          path="/supplier/location"
                          element={<LocationPage />}
                        />
                        <Route
                          path="/supplier/settings"
                          element={<SettingsPage />}
                        />
                        <Route
                          path="/supplier/activity-logs"
                          element={<ActivityLogsPage />}
                        />
                        <Route
                          path="/supplier/top-products"
                          element={<TopProductsPage />}
                        />
                        <Route
                          path="/supplier/customer-feedback"
                          element={<CustomerFeedbackPage />}
                        />
                        <Route
                          path="/supplier/delivery-status"
                          element={<DeliveryStatusPage />}
                        />
                        <Route
                          path="/supplier/notifications"
                          element={<NotificationsPage />}
                        />
                        <Route
                          path="/supplier/license-and-certificates"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <LicenseAndCertificatesPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/edit-product/:id"
                          element={<EditProduct />}
                        />
                        <Route
                          path="/supplier/products/:id"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <ProductDetail />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/categories"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <CategoriesPage />
                            </ProtectedRoute>
                          }
                        />
                        // ✅ CORRECT
                        <Route
                          path="/supplier/orders"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <OrdersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/analytics"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <AnalyticsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/payments"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <PaymentsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/sync-inventory"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <SyncInventoryPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/create-offer"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <OfferFormPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/offers/:id/edit"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <OfferFormPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/supplier/offers"
                          element={
                            <ProtectedRoute allowedRole="supplier">
                              <ManageOffersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/category/:category"
                          element={<CategoryPage />}
                        />
                        <Route
                          path="/customer/category/:category"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <CustomerLayout>
                                <CategoryPage />
                              </CustomerLayout>
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/product/:id"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <CustomerLayout>
                                <ProductDetails />
                              </CustomerLayout>
                            </ProtectedRoute>
                          }
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
                          path="/customer/orders"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <MyOrders />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/cart"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <Cart />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/customer/checkout"
                          element={
                            <ProtectedRoute allowedRole="customer">
                              <Checkout />
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
                      </ErrorBoundary>
                    </div>

                      <Footer />
                    </div>
                  </LoadScript>
                </DarkModeProvider>
              </ConversationProvider>
            </CartProvider>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

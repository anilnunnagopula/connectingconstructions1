import React, { useState, useEffect, useCallback } from "react";
import { Store, MapPin, FileText, CreditCard, Lock, User } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import SupplierLayout from "../../layout/SupplierLayout"; // CORRECT IMPORT PATH

// Import Tab Components
import BusinessDetailsTab from "./profile/BusinessDetailsTab";
import ContactLocationTab from "./profile/ContactLocationTab";
import LicensesTab from "./profile/LicensesTab";
import PaymentsTab from "./profile/PaymentsTab";
import SecurityTab from "./profile/SecurityTab";

const baseURL = process.env.REACT_APP_API_URL;

const BusinessProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get tab from URL or default to 'business'
  const initialTab = searchParams.get("tab") || "business";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab if URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabs.some(t => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Update URL when tab changes (optional, but good for navigation)
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`?tab=${tabId}`, { replace: true });
  };
   
  const [userProfileState, setUserProfileState] = useState(null); // Use state directly

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Helper to get token
  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser).token : null;
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    const authToken = getToken();
    setToken(authToken); // Set token state

    if (!authToken) {
      // If no token, redirect to login
      // But maybe wait a bit or show toast
      toast.error("Please log in to view profile.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${baseURL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUserProfileState(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data.");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [getToken, navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfileUpdate = (updatedData) => {
    setUserProfileState(updatedData);
    // Optionally update localStorage if needed
  };

  // Define tabs configuration
  const tabs = [
    { id: "business", label: "Business Details", icon: Store },
    { id: "contact", label: "Contact & Location", icon: MapPin },
    { id: "licenses", label: "Licenses & Docs", icon: FileText },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
  ];

  if (loading) {
    return (
      <SupplierLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <User className="text-blue-600" size={32} />
              Business Profile
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Manage your store identity, documents, and account settings in one place.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation for Tabs */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <nav className="space-y-2 sticky top-24">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                        }
                      `}
                    >
                      <Icon size={20} className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              <div className="bg-transparent dark:bg-transparent rounded-2xl">
                {activeTab === "business" && (
                  <BusinessDetailsTab
                    user={userProfileState}
                    token={token}
                    onUpdate={handleProfileUpdate}
                  />
                )}
                {activeTab === "contact" && (
                  <ContactLocationTab
                    user={userProfileState}
                    token={token}
                    onUpdate={handleProfileUpdate} // Fixed prop name
                  />
                )}
                {/* LicensesTab fetches its own data, just needs token */}
                {activeTab === "licenses" && <LicensesTab token={token} />}
                
                {/* PaymentsTab fetches its own data, just needs token */}
                {activeTab === "payments" && <PaymentsTab token={token} />}
                
                {/* SecurityTab handles its own logic, just needs token */}
                {activeTab === "security" && <SecurityTab token={token} />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default BusinessProfilePage;

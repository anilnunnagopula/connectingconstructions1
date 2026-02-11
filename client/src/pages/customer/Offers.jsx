import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Copy, Gift, Tag, Clock, CheckCircle } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";
import { getOffers } from "../../services/customerApiService";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await getOffers();
      if (response.success) {
        setOffers(response.data);
      } else {
        toast.error("Failed to load offers");
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Error loading offers");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <Gift className="text-purple-600" size={32} />
            Exclusive Offers & Deals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Save big on your construction materials with our latest coupons and discounts.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <Tag size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Active Offers Right Now
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new deals and discounts!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 relative group"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Tag size={120} className="text-purple-600 transform rotate-12" />
                </div>

                <div className="p-6 relative z-10">
                  {/* Badge */}
                  <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                    {offer.type === "PERCENTAGE" 
                      ? `${offer.value}% OFF` 
                      : `₹${offer.value} OFF`}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {offer.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                    {offer.description}
                  </p>

                  {/* Code Section */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 border border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                      Coupon Code
                    </p>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                      <code className="text-lg font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider pl-2">
                        {offer.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(offer.code)}
                        className={`p-2 rounded-md transition-colors ${
                          copiedCode === offer.code
                            ? "bg-green-100 text-green-600"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                        }`}
                        title="Copy Code"
                      >
                        {copiedCode === offer.code ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Expires: {formatDate(offer.endDate)}</span>
                    </div>
                    {offer.minOrderAmount > 0 && (
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        Min Order: ₹{offer.minOrderAmount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Offers;

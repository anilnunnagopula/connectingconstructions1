import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingCart,
  MessageSquare,
  Package,
  MapPin,
  Store,
  AlertTriangle,
  Star,
  Share2,
  Heart,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ReportIssueModal from "../components/ReportIssueModal";

const baseURL = process.env.REACT_APP_API_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(null); // Will be set after product loads
  const [activeImage, setActiveImage] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/products/${id}`);
      
      if (response.data.success) {
        const p = response.data.data;
        setProduct(p);
        setQuantity(p.minOrderQuantity || 1);
      } else {
        setProduct(response.data);
        setQuantity(response.data?.minOrderQuantity || 1);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${baseURL}/api/wishlist`, {
           headers: { Authorization: `Bearer ${user.token}` },
        });
        
        // Handle different response formats as seen in CategoryPage
        let wishlist = [];
        if (response.data.data?.wishlist) wishlist = response.data.data.wishlist;
        else if (response.data.data?.items) wishlist = response.data.data.items;
        else if (Array.isArray(response.data.data)) wishlist = response.data.data;
        else if (Array.isArray(response.data)) wishlist = response.data;

        const found = wishlist.some(item => 
            (item.product?._id === id) || (item.product === id) || (item._id === id)
        );
        setIsInWishlist(found);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };
    checkWishlist();
  }, [id, user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`${baseURL}/api/wishlist/remove/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
         await axios.post(
          `${baseURL}/api/wishlist/add`,
          { productId: id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
       console.error("Wishlist error:", error);
       toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      // Logic for adding to cart
      // Assuming addToCart takes (productId, quantity)
      const success = await addToCart(product._id, quantity);
      if (success) {
         // Success handled by CartContext
      }
    } catch (error) {
       console.error("Detailed Add to Cart Error:", error);
    }
  };

  // Listen for Voice Commands
  useEffect(() => {
    const handleVoiceAdd = () => {
        // Safe check for product availability logic inline to avoid ordering issues
        if (product && product.availability && product.productType !== 'service' && !product.isQuoteOnly) {
            handleAddToCart();
        } else {
            toast.error("This item cannot be added to cart via voice.");
        }
    };
    
    window.addEventListener('voice-add-to-cart', handleVoiceAdd);
    return () => window.removeEventListener('voice-add-to-cart', handleVoiceAdd);
  }, [product, quantity]); // removed canAddToCart dependency

  const handleRequestQuote = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to request a quote");
      navigate("/login");
      return;
    }
    navigate(`/customer/quotes/request?product=${product._id}`);
  };

  const handleMessageSupplier = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to message the supplier");
      navigate("/login");
      return;
    }

    if (!product.supplier || !product.supplier._id) {
      toast.error("Supplier information not available");
      return;
    }

    // Navigate to messages page - the supplier will be auto-selected
    navigate("/customer/messages", {
      state: {
        selectedSupplier: {
          _id: product.supplier._id,
          name: product.supplier.companyName || product.supplier.name,
          profilePictureUrl: product.supplier.profilePictureUrl
        }
      }
    });
  };

  const handleQuantityChange = (change) => {
    const step = product.stepSize || 1;
    const min = product.minOrderQuantity || 1;
    const newQty = quantity + (change * step);
    if (newQty >= min && newQty <= (product.quantity || 999)) {
      setQuantity(newQty);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Package size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isService = product.productType === "service";
  const isQuoteOnly = product.isQuoteOnly;
  const images = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : ["https://via.placeholder.com/400?text=No+Image"];

  // Determine if we should show "Add to Cart" or "Request Quote"
  const canAddToCart = !isService && !isQuoteOnly && product.availability;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
            {product.availability === false && (
               <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                 Out of Stock
               </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImage === idx
                      ? "border-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <button 
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full transition ${isInWishlist ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={24} className={isInWishlist ? "fill-current" : ""} />
              </button>
            </div>
            
            {product.supplier && (
              <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                <Store size={16} />
                <span className="text-sm font-medium">
                  Sold by {product.supplier.companyName || product.supplier.name}
                </span>
                {product.supplier.isVerified && (
                  <span
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold"
                    title="Verified by ConnectConstructions"
                  >
                    ✓ Verified
                  </span>
                )}
              </div>
            )}

            {product.location && (
               <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-500 text-sm">
                 <MapPin size={14} />
                 {product.location.city || product.location.address || "Location available"}
               </div>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            {!isService ? (
              <>
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  / {product.unit}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Service Quote Required
              </span>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>{product.description}</p>
          </div>

          {/* Product Attributes */}
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {product.category}
              </span>
            )}
            {product.brand && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {product.brand}
              </span>
            )}
            {product.grade && (
              <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                {product.grade}
              </span>
            )}
            {product.packaging && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {product.packaging}
              </span>
            )}
            {product.warranty && (
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
                Warranty: {product.warranty}
              </span>
            )}
            {product.countryOfOrigin && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                Made in {product.countryOfOrigin}
              </span>
            )}
          </div>

          {/* Bulk Pricing Tiers */}
          {product.bulkPricing && product.bulkPricing.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Bulk Pricing (Save more on larger orders)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.bulkPricing.map((tier, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800 text-center"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : "+"} {product.unit || "units"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{tier.pricePerUnit?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-500">per {product.unit || "unit"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <h3 className="font-semibold text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-800 text-sm">
                Technical Specifications
              </h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex px-4 py-2.5 text-sm">
                    <span className="w-1/3 text-gray-500 dark:text-gray-400 font-medium">{key}</span>
                    <span className="w-2/3 text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {product.certifications && product.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* HSN & GST Info */}
          {(product.hsnCode || product.gstRate != null) && (
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              {product.hsnCode && <span>HSN: {product.hsnCode}</span>}
              {product.gstRate != null && <span>GST: {product.gstRate}%</span>}
              {product.minOrderQuantity > 1 && (
                <span>Min. Order: {product.minOrderQuantity} {product.unit || "units"}</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
            {canAddToCart ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium min-w-[3rem] text-center dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                      disabled={quantity >= (product.quantity || 999)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.quantity} available
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button 
                     onClick={() => setIsReportModalOpen(true)}
                     className="px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                     title="Report this product"
                  >
                      <AlertTriangle size={20} />
                  </button>
                  <button
                    onClick={handleMessageSupplier}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    title="Message Supplier"
                  >
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleRequestQuote}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <MessageSquare size={20} />
                  Request Quote
                </button>
                <button
                  onClick={handleMessageSupplier}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} />
                  Ask Seller
                </button>
              </div>
            )}

            {!product.availability && !isService && (
               <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                 <Package size={16} />
                 Currently out of stock
               </p>
            )}
          </div>
        </div>
      </div>
      <ReportIssueModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)}
        entityType="Product"
        entityId={id}
        entityName={product?.name}
      />
    </div>
  );
};

export default ProductDetails;

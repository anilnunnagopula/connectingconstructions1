// client/src/pages/CategoryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  UserCircle,
  ShoppingCart,
  Heart,
  MessageSquare,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import LoginPopup from "../components/LoginPopup";
import { useCart } from "../context/CartContext";

const baseURL = process.env.REACT_APP_API_URL;

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [sortBy, setSortBy] = useState("none");
  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  const decodedCategory = decodeURIComponent(category);

  console.log("🔍 CategoryPage Debug:");
  console.log("  Category:", decodedCategory);
  console.log("  User:", user);
  console.log("  Show Popup:", showPopup);
  console.log("  Products Count:", products.length);
  console.log("  Loading:", loading);

  // Load user from localStorage
  useEffect(() => {
    console.log("📦 Loading user from localStorage...");
    try {
      const storedUser = localStorage.getItem("user");
      console.log("  Stored User (raw):", storedUser);

      if (storedUser && storedUser !== "undefined") {
        const parsed = JSON.parse(storedUser);
        console.log("  Parsed User:", parsed);
        setUser(parsed);
      } else {
        console.log("  ❌ No valid user found");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error parsing user:", error);
      setUser(null);
    }
  }, []);

  // Show popup immediately if not logged in
  useEffect(() => {
    console.log("🔐 Checking login status...");
    if (!user) {
      console.log("  ❌ No user - showing login popup");
      setShowPopup(true);
      setLoading(false);
      setProducts([]);
      setFiltered([]);
    } else {
      console.log("  ✅ User logged in:", user.role);
      setShowPopup(false);
    }
  }, [user]);
  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.token || user.role !== "customer") return;

        const response = await axios.get(`${baseURL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const productIds = response.data.data.items.map(
          (item) => item.product._id,
        );
        setWishlistItems(productIds);
      } catch (error) {
        console.error("Load wishlist error:", error);
      }
    };

    if (user?.role === "customer") {
      loadWishlist();
    }
  }, [user]);
  // Fetch products (only if user is logged in)
  const fetchProductsByCategory = useCallback(async () => {
    if (!user) {
      console.log("⏸️  Skipping fetch - no user");
      return;
    }

    console.log("🔄 Fetching products...");
    console.log(
      "  API URL:",
      `${baseURL}/api/products?category=${encodeURIComponent(category)}`,
    );

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${baseURL}/api/products?category=${encodeURIComponent(category)}`,
      );

      console.log("✅ API Response received:");
      console.log("  Status:", response.status);
      console.log("  Data Type:", typeof response.data);
      console.log("  Is Array:", Array.isArray(response.data));
      console.log("  Raw Data:", response.data);

      // Handle different response formats
      let productsArray = [];

      if (Array.isArray(response.data)) {
        console.log("  📦 Format: Direct Array");
        productsArray = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        console.log("  📦 Format: { data: [...] }");
        productsArray = response.data.data;
      } else if (
        response.data.products &&
        Array.isArray(response.data.products)
      ) {
        console.log("  📦 Format: { products: [...] }");
        productsArray = response.data.products;
      } else {
        console.error("❌ Invalid response format:", response.data);
        throw new Error("Invalid response format from server");
      }

      console.log("  Total products:", productsArray.length);

      const productsWithSuppliers = productsArray.filter(
        (p) => p.supplier && p.supplier.name,
      );

      console.log("  Products with suppliers:", productsWithSuppliers.length);

      setProducts(productsWithSuppliers);

      if (productsWithSuppliers.length === 0) {
        console.log("  ℹ️  No products with suppliers found");
        setError(`No products available in "${decodedCategory}" yet.`);
      } else {
        console.log("  ✅ Products loaded successfully");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      console.error("  Error Response:", err.response?.data);
      console.error("  Error Status:", err.response?.status);

      if (err.response?.status === 404) {
        setError(`No products found in "${decodedCategory}".`);
      } else if (err.message === "Invalid response format from server") {
        setError(
          "Server returned invalid data format. Check console for details.",
        );
      } else {
        setError(err.response?.data?.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  }, [category, decodedCategory, user]);

  // Fetch products when user is available
  useEffect(() => {
    console.log("🎯 Fetch trigger - User exists:", !!user);
    if (user) {
      fetchProductsByCategory();
    }
  }, [fetchProductsByCategory, user]);

  // Check if product is in cart
  const isProductInCart = useCallback(
    (productId) => {
      const inCart = cartItems.some(
        (item) => item.product?._id === productId || item.product === productId,
      );
      console.log(`  🛒 Product ${productId} in cart:`, inCart);
      return inCart;
    },
    [cartItems],
  );

  // Filter + sort effect
  useEffect(() => {
    console.log("🔄 Filtering/Sorting products...");
    if (products.length > 0) {
      let sorted = [...products];
      if (sortBy === "price") {
        console.log("  💰 Sorting by price");
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (sortBy === "location") {
        console.log("  📍 Sorting by location");
        sorted.sort((a, b) =>
          (a.location?.text || "").localeCompare(b.location?.text || ""),
        );
      } else if (sortBy === "distance") {
        console.log("  📏 Sorting by distance");
        sorted.sort((a, b) => (a.location?.lat || 0) - (b.location?.lat || 0));
      }
      setFiltered(sorted);
      console.log("  ✅ Filtered products:", sorted.length);
    } else {
      setFiltered([]);
    }
  }, [products, sortBy]);

  // Popup handlers
  const handleClosePopup = () => {
    console.log("❌ Closing popup");
    setShowPopup(false);
  };

  const handleGoBack = () => {
    console.log("⬅️  Going back to home/materials");
    setShowPopup(false);
    if (user?.role === "customer") {
      navigate("/customer/materials");
    } else {
      navigate("/materials"); // Or "/"? Original was "/" but Materials page is at /materials. Let's keep / for public or /materials. Logic implies "Back" from category -> Materials list.
    }
  };

  const handleLoginNow = () => {
    console.log("🔐 Redirecting to login");
    setShowPopup(false);
    navigate("/login", { state: { from: `/category/${category}` } });
  };

  // Add to cart handler
  const handleAddToCart = async (product, quantity = 1) => {
    console.log("🛒 Add to cart:", product.name, "Qty:", quantity);

    if (!user) {
      console.log("  ❌ No user - showing popup");
      setShowPopup(true);
      return;
    }

    if (user.role !== "customer") {
      console.log("  ❌ User is not customer:", user.role);
      toast.error("Only customers can add items to cart");
      return;
    }

    // Check if it's a service
    if (product.productType === "service" || product.isQuoteOnly) {
      console.log("  ℹ️  Product is a service - redirecting to quotes");
      toast.info("This is a service. Please request a quote instead.");
      navigate(`/customer/quotes/request?product=${product._id}`);
      return;
    }

    console.log("  ✅ Adding to cart via context...");
    const success = await addToCart(product._id, quantity);

    if (success) {
      console.log("  ✅ Successfully added to cart");
    } else {
      console.log("  ❌ Failed to add to cart");
    }
  };

  // Request quote for services
  const handleRequestQuote = (product) => {
    if (!user) {
      setShowPopup(true);
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can request quotes");
      return;
    }

    // Navigate to quote request form with product pre-filled
    navigate(`/customer/quotes/request?product=${product._id}`);
  };

  const handleViewDetails = (productId) => {
    console.log("👁️  View details for product:", productId);
    if (user?.role === "customer") {
      navigate(`/customer/product/${productId}`);
    } else {
      navigate(`/product/${productId}`);
    }
  };
  const handleToggleWishlist = async (productId, e) => {
    e.stopPropagation(); // Prevent card click

    if (!user) {
      setShowPopup(true);
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can add to wishlist");
      return;
    }

    try {
      const isInWishlist = wishlistItems.includes(productId);

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${baseURL}/api/wishlist/remove/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        // Add to wishlist
        await axios.post(
          `${baseURL}/api/wishlist`,
          { productId },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        setWishlistItems((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    }
  };

  // Loading state
  if (loading && !showPopup) {
    console.log("⏳ Rendering: Loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading {decodedCategory} products...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !showPopup) {
    console.log("❌ Rendering: Error state");
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Products Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => {
              if (user?.role === "customer") {
                navigate("/customer/materials");
              } else {
                navigate("/materials");
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Other Categories
          </button>
        </div>
      </div>
    );
  }

  console.log("🎨 Rendering: Main content");

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative">
      {/* Login Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50">
          <LoginPopup
            onClose={handleClosePopup}
            onGoBack={handleGoBack}
            onLoginNow={handleLoginNow}
            categoryName={category}
          />
        </div>
      )}

      <div className={`${showPopup ? "opacity-20 pointer-events-none" : ""}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-400">
              {decodedCategory}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filtered.length} products available
            </p>
          </div>

          {/* Sort Dropdown */}
          <select
            className="border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="none">Sort By</option>
            <option value="price">💰 Price: Low to High</option>
            <option value="location">📍 Location</option>
            <option value="distance">📏 Distance</option>
          </select>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isInCart={isProductInCart(product._id)}
                isInWishlist={wishlistItems.includes(product._id)} // ✅ ADD THIS
                onAddToCart={handleAddToCart}
                onRequestQuote={handleRequestQuote}
                onViewDetails={handleViewDetails}
                onToggleWishlist={handleToggleWishlist} // ✅ ADD THIS
                user={user}
                showLoginPopup={() => setShowPopup(true)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏗️</div>
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              No products found in "{decodedCategory}"
            </p>
            <button
              onClick={() => {
                if (user?.role === "customer") {
                  navigate("/customer/materials");
                } else {
                  navigate("/materials");
                }
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};;

// ===== PRODUCT CARD COMPONENT =====
const ProductCard = ({
  product,
  isInCart,
  isInWishlist,
  onAddToCart,
  onRequestQuote,
  onViewDetails,
  onToggleWishlist,
  user,
  showLoginPopup,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  const isService = product.productType === "service" || product.isQuoteOnly;
  const isMaterial = product.productType === "material";

  console.log("🎴 Rendering ProductCard:", product.name, {
    isService,
    isMaterial,
    productType: product.productType,
    isQuoteOnly: product.isQuoteOnly,
  });

  const handleAddClick = () => {
    console.log("➕ Add button clicked:", product.name);

    if (!user) {
      console.log("  ❌ No user - showing popup");
      showLoginPopup();
      return;
    }

    if (isMaterial) {
      console.log("  📦 Material - showing quantity selector");
      setShowQuantity(true);
    } else {
      console.log("  🛒 Adding to cart with qty 1");
      onAddToCart(product, 1);
    }
  };

  const handleConfirmQuantity = () => {
    console.log("✅ Confirming quantity:", quantity);
    onAddToCart(product, quantity);
    setShowQuantity(false);
    setQuantity(1);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
      onClick={() => onViewDetails(product._id)}
    >
      {/* Product Image */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product._id, e);
          }}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition z-10 group"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={
              isInWishlist
                ? "text-red-500 fill-red-500"
                : "text-gray-400 group-hover:text-red-500"
            }
          />
        </button>
        {product.imageUrls?.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No Image
          </div>
        )}

        {/* Availability Badge */}
        {!product.availability && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Out of Stock
          </div>
        )}

        {/* Product Type Badge */}
        {isService && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Service
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{product.name}</h3>

        {/* Price */}
        <div className="mb-2">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ₹{product.price.toLocaleString("en-IN")}
            {product.unit && (
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                /{product.unit}
              </span>
            )}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Supplier Info */}
        {product.supplier && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {product.supplier.profilePictureUrl ? (
              <img
                src={product.supplier.profilePictureUrl}
                alt={product.supplier.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <UserCircle size={20} />
            )}
            <span className="truncate">{product.supplier.name}</span>
          </div>
        )}

        {/* Quantity Selector (for materials) */}
        {showQuantity && isMaterial && (
          <div
            className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium mb-2">Select Quantity:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-lg px-4">
                {quantity} {product.unit || "units"}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
                className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmQuantity();
              }}
              className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto space-y-2">
          {isService ? (
            // Service: Request Quote Button
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestQuote(product);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Request Quote
            </button>
          ) : isInCart ? (
            // Already in cart
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = "/customer/cart";
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
            >
              View in Cart
            </button>
          ) : product.availability ? (
            // Available: Add to Cart
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddClick();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          ) : (
            // Out of stock: Notify button
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.info("We'll notify you when this is back in stock!");
              }}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition"
            >
              Notify When Available
            </button>
          )}

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product._id);
            }}
            className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 rounded-lg font-medium transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
// client/src/pages/customer/WriteReview.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Star, Send } from "lucide-react";
import CustomerLayout from "../../layout/CustomerLayout";

const baseURL = process.env.REACT_APP_API_URL;

const WriteReview = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    qualityRating: 0,
    valueRating: 0,
    deliveryRating: 0,
  });

  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(`${baseURL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const orderData = response.data.data;

      if (orderData.orderStatus !== "delivered") {
        toast.error("You can only review delivered orders");
        navigate("/customer/orders");
        return;
      }

      setOrder(orderData);

      // Auto-select first product if only one
      if (orderData.items.length === 1) {
        setSelectedProduct(orderData.items[0].product);
      }
    } catch (error) {
      console.error("❌ Load order error:", error);
      toast.error("Failed to load order");
      navigate("/customer/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating, field = "rating") => {
    setFormData({ ...formData, [field]: rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select a product to review");
      return;
    }

    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `${baseURL}/api/reviews`,
        {
          productId: selectedProduct._id,
          orderId: order._id,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("Review submitted successfully!");
      navigate(`/customer/orders/${orderId}`);
    } catch (error) {
      console.error("❌ Submit review error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRate, hover, onHover, label }) => (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                star <= (hover || rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/customer/orders/${orderId}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Write a Review
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Order {order?.orderNumber}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          {order && order.items.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Select Product to Review
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setSelectedProduct(item.product)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition ${
                      selectedProduct?._id === item.product._id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0">
                      {item.productSnapshot?.imageUrl && (
                        <img
                          src={item.productSnapshot.imageUrl}
                          alt={item.productSnapshot.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.productSnapshot?.name || item.product?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity} {item.productSnapshot?.unit}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedProduct && (
            <>
              {/* Overall Rating */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Overall Rating *
                </h2>
                <StarRating
                  rating={formData.rating}
                  hover={hoverRating}
                  onRate={(r) => handleRatingClick(r, "rating")}
                  onHover={setHoverRating}
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {formData.rating === 0 && "Select your rating"}
                  {formData.rating === 1 && "Poor"}
                  {formData.rating === 2 && "Fair"}
                  {formData.rating === 3 && "Good"}
                  {formData.rating === 4 && "Very Good"}
                  {formData.rating === 5 && "Excellent"}
                </p>
              </div>

              {/* Detailed Ratings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Detailed Ratings (Optional)
                </h2>
                <div className="space-y-4">
                  <StarRating
                    rating={formData.qualityRating}
                    onRate={(r) => handleRatingClick(r, "qualityRating")}
                    label="Product Quality"
                  />
                  <StarRating
                    rating={formData.valueRating}
                    onRate={(r) => handleRatingClick(r, "valueRating")}
                    label="Value for Money"
                  />
                  <StarRating
                    rating={formData.deliveryRating}
                    onRate={(r) => handleRatingClick(r, "deliveryRating")}
                    label="Delivery Experience"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Summarize your experience"
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Review Comment */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Share your detailed experience with this product..."
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.comment.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/customer/orders/${orderId}`)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </CustomerLayout>
  );
};

export default WriteReview;

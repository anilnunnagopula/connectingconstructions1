// client/src/pages/supplier/CustomerFeedbackPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import SupplierLayout from "../../layout/SupplierLayout";

const baseURL = process.env.REACT_APP_API_URL;

const CustomerFeedbackPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [ratingFilter, setRatingFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const getToken = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser)?.token || null;
    } catch {
      return null;
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      toast.error("Please log in as a supplier");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${baseURL}/api/supplier/customer-feedback?page=${currentPage}&limit=${limit}&sort=${sortBy}&order=${sortOrder}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(response.data.results || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        toast.error("Failed to load customer feedback");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortOrder, getToken, navigate]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Calculate stats from loaded reviews
  const allReviewsForStats = reviews;
  const avgRating = allReviewsForStats.length > 0
    ? (allReviewsForStats.reduce((sum, r) => sum + r.rating, 0) / allReviewsForStats.length).toFixed(1)
    : 0;
  const positiveCount = allReviewsForStats.filter((r) => r.rating >= 4).length;
  const negativeCount = allReviewsForStats.filter((r) => r.rating <= 2).length;

  // Filter reviews by rating and search
  const filteredReviews = reviews.filter((review) => {
    if (ratingFilter !== null && Math.floor(review.rating) !== ratingFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (review.comment || "").toLowerCase().includes(term) ||
        (review.user?.name || "").toLowerCase().includes(term) ||
        (review.product?.name || "").toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Star display component
  const StarRating = ({ rating, size = 16 }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}
          fill={star <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );

  // Skeleton loader
  const ReviewSkeleton = () => (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );

  return (
    <SupplierLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Customer Feedback
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalCount} review{totalCount !== 1 ? "s" : ""} across your products
            </p>
          </div>
          <button
            onClick={fetchFeedback}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <Star size={18} className="text-amber-600" fill="currentColor" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare size={18} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <ThumbsUp size={18} className="text-green-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{positiveCount}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
                <ThumbsDown size={18} className="text-red-600" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{negativeCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, product, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setRatingFilter(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    ratingFilter === null
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                {[5, 4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatingFilter(ratingFilter === r ? null : r)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1 ${
                      ratingFilter === r
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                    }`}
                  >
                    {r}<Star size={10} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("_");
                setSortBy(field);
                setSortOrder(order);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="rating_asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => <ReviewSkeleton key={i} />)
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-100 dark:border-gray-700 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Reviews Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || ratingFilter
                  ? "Try adjusting your filters"
                  : "Customer reviews will appear here once products receive feedback"}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Customer Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {(review.user?.name || "?")[0].toUpperCase()}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {review.user?.name || "Anonymous"}
                      </span>
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {review.createdAt
                          ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                          : ""}
                      </span>
                    </div>

                    {/* Product info */}
                    {review.product && (
                      <div className="flex items-center gap-2 mb-2">
                        {review.product.imageUrls?.[0] && (
                          <img
                            src={review.product.imageUrls[0]}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {review.product.name}
                        </span>
                      </div>
                    )}

                    {/* Comment */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {review.comment || "No comment provided"}
                    </p>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex-shrink-0">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                      review.rating >= 4
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : review.rating >= 3
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {review.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={18} />
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default CustomerFeedbackPage;

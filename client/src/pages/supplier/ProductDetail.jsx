// pages/supplier/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import SupplierLayout from "../../layout/SupplierLayout";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // For user feedback messages
  const [messageType, setMessageType] = useState(""); // Type of message (success, error)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      setMessage(""); // Clear previous messages
      setMessageType("");

      let token = null;
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          token = user.token;
        }
      } catch (err) {
        console.error("Error parsing user from localStorage in ProductDetail:", err);
        setMessage("Authentication error. Please log in again.");
        setMessageType("error");
        setLoading(false);
        navigate("/login"); // Redirect to login if user data is bad
        return;
      }

      if (!token) {
        setMessage("You are not authorized. Please log in.");
        setMessageType("error");
        setLoading(false);
        navigate("/login"); // Redirect if no token
        return;
      }

      // Use the protected supplier endpoint
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/supplier/myproducts/${id}`;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send the token
          }
        });
        const data = await response.json();

        if (!response.ok) {
          // If response is not OK, it's an error from the backend (e.g., 404, 403)
          throw new Error(data.message || data.error || 'Failed to fetch product details.');
        }
        setProduct(data); // Backend now sends product directly as per recent fix
        setMessage("Product details loaded.");
        setMessageType("success");
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
        setMessage(err.message || "An error occurred fetching product details.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]); // Add navigate to dependency array

  // Message display timeout for user feedback
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000); // Message disappears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-400"></div>
        <p className="mt-4 text-lg font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-8 rounded-lg shadow-xl text-center border border-red-200 dark:border-red-700">
          <p className="font-bold text-2xl mb-4">Error Loading Product!</p>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate('/supplier/myproducts')} // Go back to My Products
            className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Go to My Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
      // This should ideally be caught by the error state if fetch fails,
      // but as a fallback, if product is null after loading, show a message.
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
          <div className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 p-8 rounded-lg shadow-xl text-center border border-yellow-200 dark:border-yellow-700">
            <p className="font-bold text-2xl mb-4">Product Not Found</p>
            <p className="text-lg mb-6">The product you are looking for does not exist or you do not have permission to view it.</p>
            <button
              onClick={() => navigate('/supplier/myproducts')}
              className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Go to My Products
            </button>
          </div>
        </div>
      );
  }

  // --- Start of UI for Product Details (Enhanced) ---
  return (
    <SupplierLayout>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-5 px-4 sm:px-6 lg:px-5 font-inter">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-12 md:p-12 transition-all duration-300">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white">
            Product Details: {product.name}
          </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium shadow-md ${
            messageType === "success" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" :
            messageType === "error" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200" :
            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          } transition-colors duration-300`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery/Carousel */}
          <div>
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <div className="space-y-4">
                {/* Main image (can be a carousel if you implement one) */}
                <img
                  src={product.imageUrls[0]} // Display first image as main
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                />
                {/* Thumbnails for other images */}
                <div className="grid grid-cols-3 gap-3">
                  {product.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md cursor-pointer border border-transparent hover:border-blue-500 transition-all duration-200"
                      // onClick={() => { /* Logic to change main image in carousel */ }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-xl font-semibold">
                No Images Available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-300 mb-4">
              ₹{parseFloat(product.price).toLocaleString('en-IN')}
            </h1>

            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description || "No detailed description provided."}
            </p>

            <div className="space-y-3 mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
                <span className="font-semibold w-28">Category:</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
                <span className="font-semibold w-28">Quantity:</span>
                {product.quantity} units
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-center">
                <span className="font-semibold w-28">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                  product.availability
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}>
                  {product.availability ? "Available" : "Not Available"}
                </span>
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 flex items-start">
                <span className="font-semibold w-28 flex-shrink-0">Location:</span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {product.location?.text || "Location not set"}
                </span>
              </p>
            </div>

            {/* Contact Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-auto">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Information</h3>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Mobile:</span> {product.contact?.mobile || "N/A"}
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Email:</span> {product.contact?.email || "N/A"}
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Address:</span> {product.contact?.address || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => navigate(`/supplier/edit-product/${product._id}`)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit Product
              </button>
              {/* This button will be passed a prop to handleDeleteProduct from MyProducts
                  or you can re-implement the delete logic here.
                  For consistency, let's just make it navigate back to MyProducts
                  where they can delete, or implement the full delete logic again.
                  For a clean UX on a detail page, it's often good to have the delete option.
              */}
              <button
                onClick={() => { /* Implement delete logic directly or via confirmation modal */
                  setMessage("Delete functionality will be here.");
                  setMessageType("info");
                  // You might want to call handleDeleteProduct logic directly here
                  // Or simply navigate back to MyProducts to delete from there.
                  // For a full solution, this would include confirmation and API call.
                }}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m-1.022.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.961a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165M12 2.25L12 2.25c-1.103 0-2.203.15-3.303.447L12 2.25c-1.103 0-2.203.15-3.303.447" />
                </svg>
                Delete Product
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default ProductDetail;
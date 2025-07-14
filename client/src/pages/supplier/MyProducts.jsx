import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getApps, getApp } from "firebase/app";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' }); // For success/error messages after CRUD
  const appId = process.env.REACT_APP_FIREBASE_APP_ID || "default-app-id";

  // 1. Firebase Initialization and Authentication
  useEffect(() => {
    try { 
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
      };
      console.log("🔥 Firebase Config:", firebaseConfig);

      if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) {
        setError("Firebase configuration is missing or empty. Please ensure your Firebase project is set up and linked to this environment.");
        setIsAuthReady(true);
        return; // Exit early if config is missing
      }

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Sign in anonymously if no user is authenticated
          try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (anonError) {
            console.error("Firebase anonymous sign-in failed:", anonError);
            setError("Authentication failed. Please try again.");
          }
        }
        setIsAuthReady(true); // Auth state is ready
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (err) {
      console.error("Firebase initialization error:", err);
      // Only set generic error if not already set by specific config checks
      if (!error) {
        setError("Failed to initialize application. Please try again later.");
      }
      setIsAuthReady(true); // Mark ready even on error to stop loading indicator
    }
  }, []);

  // 2. Fetch Products from Firestore (Real-time with onSnapshot)
  useEffect(() => {
    if (!isAuthReady || !db || !userId) {
      return; // Wait for Firebase to be ready and user to be authenticated
    }

    setLoading(true);
    setError(null); // Clear previous errors when attempting to load

    // Collection path for private user data
    const productsCollectionRef = collection(
      db,
      `artifacts/${appId}/users/${userId}/products`
    );
    // Query to filter products by the current supplier's ID (which is the userId)
    // IMPORTANT: Firebase security rules must allow this read.
    const q = query(productsCollectionRef, where("supplierId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id, // Store Firestore document ID
        ...doc.data()
      }));
      setProducts(fetchedProducts);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products:", err);
      setError("Failed to load your products. Please ensure Firebase security rules allow read access for your user ID.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup snapshot listener
  }, [isAuthReady, db, userId]); // Re-run when auth or db changes

  // Clear action messages after a few seconds
  useEffect(() => {
    if (actionMessage.text) {
      const timer = setTimeout(() => {
        setActionMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Handle navigation to edit page using product ID
  const handleEdit = (productId) => {
    navigate(`/supplier/edit/${productId}`); // Pass Firestore document ID
  };

  // Toggle product availability in Firestore
  const handleAvailabilityToggle = async (productId, currentAvailability) => {
    if (!db || !userId) {
      setActionMessage({ type: 'error', text: 'Authentication not ready or user not identified.' });
      return;
    }
    setLoading(true);
    try {
      const productRef = doc(db, `artifacts/${__app_id}/users/${userId}/products`, productId);
      await updateDoc(productRef, {
        availability: !currentAvailability,
      });
      setActionMessage({ type: 'success', text: 'Availability updated successfully!' });
    } catch (err) {
      console.error("Error toggling availability:", err);
      setActionMessage({ type: 'error', text: `Failed to update availability: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };
  //handle delete
  const handleDelete = async (productId) => {
    if (!db || !userId) {
      setActionMessage({
        type: "error",
        text: "Authentication not ready or user not identified.",
      });
      return;
    }
    setLoading(true);
    try {
      const productRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/products`,
        productId
      );
      await deleteDoc(productRef);
      setActionMessage({
        type: "success",
        text: "Product deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting product:", err);
      setActionMessage({
        type: "error",
        text: `Failed to delete product: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };


  // Render loading/error states before main content
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-xl">Initializing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-md shadow-md text-center">
          Error: {error}
          <p className="mt-2 text-sm">Please ensure your Firebase project is correctly configured and security rules allow access.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-xl">Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg my-10 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        📦 My Products
      </h1>

      {/* User ID display for debugging/multi-user context */}
      {userId && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">
          Your Supplier ID: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-sm">{userId}</span>
        </p>
      )}

      {/* Action Message Display */}
      {actionMessage.text && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${
            actionMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            No products added yet!
          </p>
          <button
            onClick={() => navigate('/add-product')}  
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
          >
            ➕ Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-gray-50 dark:bg-gray-800 shadow-md p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 flex flex-col">
              {item.imageUrl && ( // Use imageUrl from Firestore
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4 border border-gray-300 dark:border-gray-600"
                  // Fallback for broken images
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555555?text=No+Image"; }}
                />
              )}
              {!item.imageUrl && ( // Placeholder if no image
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Image
                </div>
              )}

              <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-300">{item.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Price:</strong> ₹{item.price}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Quantity:</strong>{" "}
                <span
                  className={
                    item.quantity < 5
                      ? "text-red-600 font-semibold"
                      : "text-green-600"
                  }
                >
                  {item.quantity} {item.quantity < 5 ? "(Low Stock!)" : ""}
                </span>
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    item.availability ? "text-green-600" : "text-red-600"
                  }
                >
                  {item.availability ? "Available" : "Not Available"}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Location:</strong>{" "}
                {item.location && item.location.text ? item.location.text : "Not provided"}
              </p>

              {item.location &&
                typeof item.location.lat === "number" &&
                typeof item.location.lng === "number" && (
                  <a
                    href={`https://maps.google.com/?q=${item.location.lat},${item.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm mt-1 mb-2 inline-block"
                  >
                    📍 View on Map
                  </a>
                )}

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                <strong>Contact:</strong> {item.contact?.mobile} |{" "}
                {item.contact?.email}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                <strong>Address:</strong> {item.contact?.address}
              </p>

              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(item.id)} // Pass Firestore ID
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-200 font-semibold text-sm flex-1"
                  disabled={loading}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleAvailabilityToggle(item.id, item.availability)} // Pass Firestore ID and current availability
                  className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm flex-1"
                  disabled={loading}
                >
                  {item.availability ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)} // Pass Firestore ID
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors duration-200 font-semibold text-sm flex-1"
                  disabled={loading}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;

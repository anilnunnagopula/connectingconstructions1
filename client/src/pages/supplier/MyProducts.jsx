import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import api from "../../api"; // Import your centralized API functions

const MyProducts = () => {
  const navigate = useNavigate();
  // Get user from AuthContext (this user object contains MongoDB _id, roles, token, etc.)
  const { user: authContextUser, isAuthenticated, isAuthLoading } = useAuth();
  const queryClient = useQueryClient(); // For invalidating React Query caches

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  // This state will hold the Firebase Auth UID, which is crucial for Firestore rules
  const [firebaseAuthUid, setFirebaseAuthUid] = useState(null);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  // Firebase App ID from environment variables
  const appId = process.env.REACT_APP_FIREBASE_APP_ID || "default-app-id";

  // 1. Firebase Initialization and Authentication (Ensure UID is set)
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

      if (!firebaseConfig.apiKey) {
        setFirebaseError(
          "Firebase API Key is missing. Please check your .env file."
        );
        setIsFirebaseReady(true);
        return;
      }

      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      // Listen for Firebase Auth state changes
      const unsubscribeAuth = onAuthStateChanged(
        firebaseAuth,
        async (currentUser) => {
          if (currentUser) {
            // IMPORTANT: Set the Firebase UID here
            setFirebaseAuthUid(currentUser.uid);
            console.log("Firebase Auth: User signed in, UID:", currentUser.uid);
          } else {
            setFirebaseAuthUid(null); // Clear UID if no user
            console.log(
              "Firebase Auth: No user, attempting sign-in or anonymous."
            );
            // This part is specific to Canvas environment's auth setup.
            try {
              if (
                typeof __initial_auth_token !== "undefined" &&
                __initial_auth_token
              ) {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                console.log("Firebase: Signed in with custom token.");
              } else {
                await signInAnonymously(firebaseAuth);
                console.log("Firebase: Signed in anonymously.");
              }
            } catch (anonError) {
              console.error(
                "Firebase anonymous/custom token sign-in failed:",
                anonError
              );
              setFirebaseError(
                "Firebase authentication failed. Please check setup."
              );
            }
          }
          setIsFirebaseReady(true); // Firebase Auth state is ready
        }
      );

      return () => unsubscribeAuth(); // Cleanup auth listener
    } catch (err) {
      console.error("Firebase initialization error:", err);
      setFirebaseError(`Failed to initialize Firebase: ${err.message}`);
      setIsFirebaseReady(true);
    }
  }, []); // Run only once on component mount

  // 2. Fetch Products from Firestore using React Query and onSnapshot
  const {
    data: products,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["myProducts", firebaseAuthUid], // Query key depends on Firebase Auth UID
    queryFn: async () => {
      // Wait for Firebase to be ready AND a Firebase Auth UID to be available
      if (!db || !firebaseAuthUid) {
        throw new Error(
          "Firestore or Firebase Auth UID not ready for product fetch."
        );
      }

      console.log(
        "MyProducts: Attempting to fetch products for Firebase Auth UID:",
        firebaseAuthUid
      );
      console.log("MyProducts: Using Firebase App ID:", appId);

      // Return a promise that resolves with the products from onSnapshot
      return new Promise((resolve, reject) => {
        const productsCollectionRef = collection(
          db,
          `artifacts/${appId}/users/${firebaseAuthUid}/products` // Use Firebase UID in path
        );
        // Query to filter products by the current supplier's ID (which is the Firebase UID)
        // This 'where' clause is good practice for data integrity but relies on rule allowing it.
        const q = query(
          productsCollectionRef,
          where("supplierId", "==", firebaseAuthUid)
        );

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const fetchedProducts = snapshot.docs.map((doc) => ({
              id: doc.id, // Store Firestore document ID
              ...doc.data(),
            }));
            console.log("MyProducts: Fetched products:", fetchedProducts);
            resolve(fetchedProducts); // Resolve the promise with fetched data
          },
          (err) => {
            console.error("Error fetching products (onSnapshot):", err);
            console.error("Firestore Error Code:", err.code);
            console.error("Firestore Error Message:", err.message);
            reject(
              new Error(
                "Failed to load your products. Please ensure Firebase security rules allow read access for your user ID."
              )
            );
          }
        );

        // Return unsubscribe function for cleanup. React Query will handle this.
        return unsubscribe;
      });
    },
    // Only run query when Firebase is ready AND authenticated with a UID
    enabled: isFirebaseReady && isAuthenticated && !!firebaseAuthUid,
    staleTime: Infinity, // Keep data fresh, rely on onSnapshot for real-time updates
    cacheTime: 0, // Don't cache, onSnapshot is real-time
  });

  // React Query mutations for CRUD operations
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ productId, currentAvailability }) => {
      if (!db || !firebaseAuthUid)
        throw new Error("Firebase Auth UID not ready.");
      const productRef = doc(
        db,
        `artifacts/${appId}/users/${firebaseAuthUid}/products`,
        productId
      );
      await updateDoc(productRef, { availability: !currentAvailability });
    },
    onSuccess: () => {
      setActionMessage({
        type: "success",
        text: "Availability updated successfully!",
      });
      // No need to invalidate 'myProducts' because onSnapshot handles real-time updates
    },
    onError: (err) => {
      setActionMessage({
        type: "error",
        text: `Failed to update availability: ${err.message}`,
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      if (!db || !firebaseAuthUid)
        throw new Error("Firebase Auth UID not ready.");
      const productRef = doc(
        db,
        `artifacts/${appId}/users/${firebaseAuthUid}/products`,
        productId
      );
      await deleteDoc(productRef);
    },
    onSuccess: () => {
      setActionMessage({
        type: "success",
        text: "Product deleted successfully!",
      });
      // No need to invalidate 'myProducts' because onSnapshot handles real-time updates
    },
    onError: (err) => {
      setActionMessage({
        type: "error",
        text: `Failed to delete product: ${err.message}`,
      });
    },
  });

  // Clear action messages after a few seconds
  useEffect(() => {
    if (actionMessage.text) {
      const timer = setTimeout(() => {
        setActionMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Handle navigation to edit page using product ID
  const handleEdit = (productId) => {
    navigate(`/supplier/edit-product/${productId}`); // Pass Firestore document ID
  };

  // Toggle product availability
  const handleAvailabilityToggle = (productId, currentAvailability) => {
    toggleAvailabilityMutation.mutate({ productId, currentAvailability });
  };

  // Handle delete
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Use a custom modal instead of window.confirm in production
      deleteProductMutation.mutate(productId);
    }
  };

  // Render loading/error states
  if (!isFirebaseReady || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-xl">Initializing Firebase and Authentication...</p>
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p className="text-xl">Firebase Error: {firebaseError}</p>
      </div>
    );
  }

  // Check if authenticated via AuthContext AND if Firebase Auth UID is available
  if (!isAuthenticated || !authContextUser || !firebaseAuthUid) {
    // This case should be handled by ProtectedRoute, but as a fallback
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p className="text-xl">Please log in to view your products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-xl">Loading your products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p className="text-xl">Error: {fetchError.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg mt-10 mb-10 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center">My Products</h2>

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
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <p className="text-lg mb-4">You haven't added any products yet.</p>
          <button
            onClick={() => navigate("/supplier/add-product")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-right">Price</th>
                <th className="py-3 px-6 text-right">Quantity</th>
                <th className="py-3 px-6 text-center">Availability</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = `https://placehold.co/64x64/E0E0E0/333333?text=No+Image`; // Placeholder
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-right">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-6 text-right">{product.quantity}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.availability
                          ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                          : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100"
                      }`}
                    >
                      {product.availability ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-3">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="w-6 h-6 transform hover:text-blue-500 hover:scale-110"
                        title="Edit Product"
                        disabled={
                          toggleAvailabilityMutation.isLoading ||
                          deleteProductMutation.isLoading
                        }
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          handleAvailabilityToggle(
                            product.id,
                            product.availability
                          )
                        }
                        className="w-6 h-6 transform hover:text-yellow-500 hover:scale-110"
                        title={
                          product.availability
                            ? "Mark as Unavailable"
                            : "Mark as Available"
                        }
                        disabled={
                          toggleAvailabilityMutation.isLoading ||
                          deleteProductMutation.isLoading
                        }
                      >
                        {product.availability ? "🚫" : "✅"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-6 h-6 transform hover:text-red-500 hover:scale-110"
                        title="Delete Product"
                        disabled={
                          toggleAvailabilityMutation.isLoading ||
                          deleteProductMutation.isLoading
                        }
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyProducts;

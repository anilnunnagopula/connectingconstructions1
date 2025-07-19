import React from "react";
import { useNavigate } from "react-router-dom";

// ... (Your useAuth hook and comments remain the same) ...
const useAuth = () => {
  const userString = localStorage.getItem("user"); // <--- This line is the key
  let isLoggedIn = false;
  let user = null;

  if (userString) {
    // <--- This condition is evaluating to false
    try {
      user = JSON.parse(userString);
      isLoggedIn = true;
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
    }
  }
  console.log("useAuth hook: isLoggedIn =", isLoggedIn, ", user =", user);
  return { isLoggedIn, user };
};

const PageNotFound = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  // Add these console logs to see what values are received by the component
  console.log("PageNotFound component rendered.");
  console.log("  isLoggedIn:", isLoggedIn);
  console.log("  user object:", user);
  if (user) {
    console.log("  user.role:", user.role);
  } else {
    console.log("  user object is null or undefined.");
  }

  const handleGoHome = () => {
    console.log("handleGoHome button clicked.");
    console.log("  isLoggedIn at click:", isLoggedIn);
    console.log("  user at click:", user);
    if (user) {
      console.log("  user.role at click:", user.role);
    }

    if (isLoggedIn && user) {
      if (user.role === "customer") {
        console.log("  Navigating to /customer-dashboard");
        navigate("/customer-dashboard");
      } else if (user.role === "supplier") {
        console.log("  Navigating to /supplier-dashboard");
        navigate("/supplier-dashboard");
      } else {
        console.log(
          "  Fallback: Logged in but role is not customer/supplier. Navigating to /"
        );
        navigate("/");
      }
    } else {
      console.log("  Not logged in. Navigating to /");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 animate-bounce">
        404 - Oops! Page Not Found{" "}
        <span role="img" aria-label="confused face">
          😵‍💫
        </span>
      </h1>

      <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">
        Either the page doesn’t exist, or it’s still under construction.
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
        {isLoggedIn && user
          ? `Looks like you're logged in as a ${
              user.role || "user"
            }. Would you like to go to your dashboard?`
          : `Wanna go back home?`}
      </p>

      <button
        onClick={handleGoHome}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105 duration-300 ease-in-out shadow-lg"
      >
        ⬅️{" "}
        {isLoggedIn &&
        user &&
        (user.role === "customer" || user.role === "supplier")
          ? "Go to Dashboard"
          : "Go Home"}
      </button>

      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </div>
  );
};

export default PageNotFound;

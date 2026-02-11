// client/src/components/HelpAndSupport.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  increment,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import axios from "axios"; // Added axios
import { db, auth } from "../firebase/firebaseConfig";

const HELP_CATEGORIES = [
  "Getting Started",
  "Account Management",
  "Product Information",
  "Ordering & Delivery",
  "Troubleshooting",
  "Payments",
  "Returns & Refunds",
  "Contact Us",
  "Privacy Policy",
];

const HelpAndSupport = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userId, setUserId] = useState(null);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Handle anonymous login
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      } else {
        setUserId(user.uid);
      }
    });

    const q = query(collection(db, "help_articles"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(fetched);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load articles.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat =
      selectedCategory === "All" || a.category === selectedCategory;
    const matchText =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.keywords || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchText;
  });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await axios.post("/api/contact", {
        ...contactForm,
        userId,
      });
      setMessage("✅ Message sent successfully! We will get back to you soon.");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const voteHelpful = async (id, type) => {
    try {
      const docRef = doc(db, "help_articles", id);
      await updateDoc(docRef, {
        [type === "yes" ? "helpfulYes" : "helpfulNo"]: increment(1),
      });
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Help & Support</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded mb-4 border"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {["All", ...HELP_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 && !loading ? (
          <div className="col-span-1 md:col-span-2 text-center py-10">
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              No FAQs found.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or category filter, or contact support
              below.
            </p>
          </div>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className="p-4 border rounded shadow">
              <h2 className="font-bold text-lg mb-1">{a.title}</h2>
              <p className="text-sm mb-2">{a.content}</p>
              <p className="text-xs text-gray-500 mb-2">
                Category: {a.category}
              </p>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => voteHelpful(a.id, "yes")}
                  className="text-green-600 hover:underline"
                >
                  👍 {a.helpfulYes || 0}
                </button>
                <button
                  onClick={() => voteHelpful(a.id, "no")}
                  className="text-red-600 hover:underline"
                >
                  👎 {a.helpfulNo || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-10 border-t pt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Can't find the answer you're looking for? Reach out to our support
            team.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
            📩 Contact Support
          </h3>
          {message && (
            <div
              className={`p-3 rounded mb-4 ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                required
                rows="4"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Describe your issue..."
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;

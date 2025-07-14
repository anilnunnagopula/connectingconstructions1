import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  increment,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../firebase/firebaseConfig"; // ✅ Use your working Firebase config

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
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    category: "",
    keywords: "",
  });
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

  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      setMessage("All fields are required.");
      return;
    }
    try {
      await addDoc(collection(db, "help_articles"), {
        ...newArticle,
        keywords: newArticle.keywords.toLowerCase(),
        createdAt: serverTimestamp(),
        createdBy: userId,
        views: 0,
        helpfulYes: 0,
        helpfulNo: 0,
      });
      setMessage("Article added.");
      setNewArticle({ title: "", content: "", category: "", keywords: "" });
    } catch (err) {
      console.error(err);
      setMessage("Failed to add article.");
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
          <p className="text-center col-span-2">No articles found.</p>
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

      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold mb-2">Add New Article</h3>
        {message && <p className="mb-2 text-sm text-blue-600">{message}</p>}
        <input
          className="block w-full mb-2 p-2 border rounded"
          placeholder="Title"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
        />
        <select
          className="block w-full mb-2 p-2 border rounded"
          value={newArticle.category}
          onChange={(e) =>
            setNewArticle({ ...newArticle, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          {HELP_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <textarea
          className="block w-full mb-2 p-2 border rounded"
          placeholder="Content"
          value={newArticle.content}
          onChange={(e) =>
            setNewArticle({ ...newArticle, content: e.target.value })
          }
        />
        <input
          className="block w-full mb-2 p-2 border rounded"
          placeholder="Keywords"
          value={newArticle.keywords}
          onChange={(e) =>
            setNewArticle({ ...newArticle, keywords: e.target.value })
          }
        />
        <button
          onClick={handleAddArticle}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Article
        </button>
      </div>
    </div>
  );
};

export default HelpAndSupport;

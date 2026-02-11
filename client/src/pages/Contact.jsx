import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target[0].value;
    const email = e.target[1].value;
    const message = e.target[2].value;

    try {
      const baseURL = process.env.REACT_APP_API_URL;
      await axios.post(`${baseURL}/api/contact`, { name, email, message });
      
      toast.success("Message sent successfully!");
      e.target.reset(); 
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
        setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 px-4 py-6 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            💬 Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            We're here to help user to find constrcution materials and suppliers  list their products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact Info Cards */}
          
          <div className="space-y-8">
            {/* Phone */}
            <a
              href="tel:+919398828248"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaPhone className="text-blue-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Call Us</h3>
                  <p>+91 93988 28248</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaEnvelope className="text-green-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p>anilnunnagopula15@gmail.com</p>
                </div>
              </div>
            </a>

            {/* Location */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=CVR+College+Road,+Mangalpally,+Hyderabad,+Telangana"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-start gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-[1.02] transition cursor-pointer">
                <FaMapMarkerAlt className="text-red-600 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p>CVR College Road, Mangalpally, Hyderabad, Telangana</p>
                </div>
              </div>
            </a>
          </div>
          
          {/* Right: Contact Form */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-300">
              📩 Send us a message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <textarea
                rows="4"
                placeholder="Your message..."
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
              ></textarea>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send Message 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

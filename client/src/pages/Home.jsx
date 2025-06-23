import React from "react";
import categories from "../utils/Categories";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    const encoded = encodeURIComponent(category);
    navigate(`/category/${encoded}`);
  };

  return (
    <div>
      {/* 🔹 Hero Section */}
      <div
        className="w-full h-[90vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/building.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The Amazon for Builders
          </h1>
          <p className="text-xl md:text-2xl font-light mb-6">
            Connecting the Core and the Code
          </p>
          <div className="flex gap-4">
            <a
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold"
            >
              Register
            </a>
            <a
              href="/login"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-md font-semibold"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* 🔹 Category Showcase */}
      <div className="py-10 px-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-10">
          Explore Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(item)}
              className="bg-white shadow-md p-4 rounded-lg text-center hover:scale-105 transition duration-300 cursor-pointer"
            >
              <div className="w-full h-48 overflow-hidden rounded-md mb-3">
                <img
                  src={`${
                    process.env.PUBLIC_URL
                  }/categories/${item.toLowerCase()}.jpg`}
                  alt={item}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

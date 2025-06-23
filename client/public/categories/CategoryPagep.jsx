import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams(); // like "Cement", "Sand", etc.

  // fetch or filter products by category
  const allProducts =
    JSON.parse(localStorage.getItem("supplierProducts")) || [];
  const filtered = allProducts.filter((p) => p.category === category);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 {category} Suppliers</h2>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((product, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p>📍 {product.location}</p>
              <p>📞 {product.contact?.mobile}</p>
              <p>💰 ₹{product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;

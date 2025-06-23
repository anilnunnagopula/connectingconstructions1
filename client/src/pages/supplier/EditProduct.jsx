import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const allProducts =
      JSON.parse(localStorage.getItem("supplierProducts")) || [];
    const existing = allProducts[parseInt(id)];
    if (existing) {
      setProduct(existing);
    } else {
      alert("Product not found!");
      navigate("/supplier/products");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const allProducts =
      JSON.parse(localStorage.getItem("supplierProducts")) || [];
    allProducts[parseInt(id)] = product;
    localStorage.setItem("supplierProducts", JSON.stringify(allProducts));
    navigate("/supplier/products"); // Redirect after update
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Product</h1>

      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-2 rounded"
        />
        <input
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
        />
        <input
          name="location"
          value={product.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
        />
        <input
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded"
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProduct;

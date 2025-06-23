import React, { useState } from "react";

const ProductDescriptionGenerator = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setDescription("");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You're a professional construction material assistant.",
            },
            {
              role: "user",
              content: `Write a product description for: ${productName}. Include key features and ideal use cases.`,
            },
          ],
        }),
      });

      const data = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        setDescription(data.choices[0].message.content);
      } else {
        setDescription("⚠️ Something went wrong with the AI response.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setDescription("❌ Error generating description.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-lg space-y-4">
      <h2 className="text-xl font-bold">🪄 Auto Product Description</h2>

      <input
        className="w-full p-2 border rounded"
        placeholder="Enter product name..."
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={generateDescription}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {description && (
        <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-line">
          {description}
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionGenerator;

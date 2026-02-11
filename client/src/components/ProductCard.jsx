// client/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block border border-gray-100 dark:border-gray-700"
    >
      <div className="relative aspect-square">
        <img
          src={product.images?.[0] || product.imageUrls?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.supplier?.isVerified && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <ShieldCheck size={12} />
            Verified
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center text-yellow-500 text-xs font-bold">
            <Star size={12} className="fill-current mr-1" />
            {product.rating || "4.5"}
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Supplier Info */}
        {product.supplier && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.supplier.companyName || product.supplier.name}
            </span>
            {product.supplier?.isVerified && (
              <BadgeCheck size={14} className="text-blue-500" />
            )}
            {product.supplier?.supplierTier && product.supplier.supplierTier !== 'standard' && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                product.supplier.supplierTier === 'platinum' ? 'bg-slate-800 text-white border border-slate-600' :
                product.supplier.supplierTier === 'gold' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                'bg-gray-100 text-gray-800 border border-gray-200' // Silver
              }`}>
                {product.supplier.supplierTier}
              </span>
            )}
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              ₹{product.price?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

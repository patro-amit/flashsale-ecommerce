import React, { useState } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';

function ProductCard({ product, onAddToCart }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 200);
  };

  const stockStatus = product.stock <= 5 ? 'text-red-600' : product.stock <= 15 ? 'text-amber-600' : 'text-green-600';
  const stockText = product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop';
          }}
        />
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          -{product.discount}%
        </div>
        {/* Stock Status Badge */}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
          {stockText}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Name */}
        <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
          {product.name}
        </h4>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-lg text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className={`text-sm font-semibold ${stockStatus}`}>
            {stockText}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full py-3 px-4 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition transform hover:scale-105 active:scale-95 ${
            product.stock === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : isAdding
                ? 'bg-blue-700 text-white scale-105'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ShoppingCart className={`size-5 ${isAdding ? 'animate-bounce' : ''}`} />
          <span>{isAdding ? 'Adding...' : 'Buy Now'}</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

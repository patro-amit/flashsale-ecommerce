import React from 'react';
import { ShoppingCart, AlertCircle, RotateCw } from 'lucide-react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onAddToCart, loading, onRetry }) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Premium Tech Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 h-96 animate-pulse">
              <div className="h-48 bg-slate-200 rounded-t-xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <AlertCircle className="size-16 text-slate-400" />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Products Available</h3>
            <p className="text-slate-600 mb-6">We're having trouble loading the products. Please try again.</p>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <RotateCw className="size-5" />
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Premium Tech Products</h3>
        <p className="text-slate-600">{products.length} items available with up to 29% discount</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;

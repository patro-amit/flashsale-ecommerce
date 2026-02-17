import React from 'react';
import { ShoppingCart, Zap } from 'lucide-react';

function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Zap className="size-7 text-blue-600" strokeWidth={3} />
            <h1 className="text-2xl font-bold text-slate-900">
              Flash<span className="text-blue-600">Sale</span>
            </h1>
          </div>

          {/* Center - Tagline */}
          <div className="hidden md:block text-center">
            <p className="text-sm font-semibold text-slate-600">
              Limited Time Offers
            </p>
          </div>

          {/* Cart Icon */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold transition group"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">{cartCount > 0 ? 'Cart' : 'Empty'}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full size-6 flex items-center justify-center group-hover:bg-red-600 transition">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

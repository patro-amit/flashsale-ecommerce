import React from 'react';
import { X, Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

function Cart({ cart, onClose, onUpdateQuantity, onRemove, onCheckout, isProcessing }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Shopping Cart</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition"
        >
          <X className="size-6" />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-20">
          <ShoppingCart className="size-16 text-slate-400" />
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h3>
            <p className="text-slate-600 mb-6">Add some premium tech products to get started!</p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-lg p-6 flex gap-6 hover:shadow-md transition"
              >
                {/* Item Image */}
                <div className="w-24 h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop';
                    }}
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-slate-600 line-clamp-1">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-lg font-bold text-blue-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="font-semibold text-slate-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-20 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>

              <div className="space-y-2 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-slate-900">
                <span>Total</span>
                <span className="text-3xl text-blue-600">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={onCheckout}
                disabled={isProcessing || cart.length === 0}
                className="w-full py-4 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition transform hover:scale-105 active:scale-95"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 px-6 border-2 border-slate-300 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Continue Shopping
              </button>

              <p className="text-xs text-slate-500 text-center pt-2">
                💳 Secure checkout powered by AWS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

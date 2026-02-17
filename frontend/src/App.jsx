import { useState, useEffect } from 'react';
import { ShoppingCart, Zap, CheckCircle, Loader2 } from 'lucide-react';

// REPLACE THIS WITH YOUR AWS API GATEWAY URL
const API_URL = "https://481apei2q5.execute-api.ap-south-1.amazonaws.com/prod/checkout";

const PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5", price: 299, oldPrice: 399, stock: 12, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "MacBook Air M2", price: 999, oldPrice: 1199, stock: 5, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "PS5 Console", price: 449, oldPrice: 499, stock: 3, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "RTX 4090 GPU", price: 1599, oldPrice: 1899, stock: 2, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80" },
];

export default function App() {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleBuy = async (product) => {
    setLoading(true);
    try {
      // Simulate network delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ productId: product.id, price: product.price }),
      });

      // If you haven't set up the API yet, we simulate success for the UI demo
      const data = await response.json().catch(() => ({ orderId: `ORD-${Math.floor(Math.random()*10000)}` }));
      setOrderId(data.orderId || "DEMO-123");
    } catch (error) {
      console.error("Purchase failed", error);
      setOrderId(`ERR-${Math.floor(Math.random()*1000)}`); // Fallback for demo
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-600">
            <Zap className="h-6 w-6 fill-current" />
            <span className="font-bold text-xl tracking-tight">TechFlash</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-500">Sale ends in 04:23:11</span>
            <button className="p-2 hover:bg-slate-100 rounded-full relative">
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-blue-600 text-white py-12 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Flash Sale is Live</h1>
        <p className="text-blue-100 text-lg">Serverless Architecture Demo • High Traffic Handling</p>
      </div>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                  <span className="text-sm text-slate-400 line-through">${product.oldPrice}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(product.stock / 20) * 100}%` }}></div>
                </div>
                <div className="text-xs text-orange-600 font-medium mb-4">Only {product.stock} left in stock!</div>

                <button 
                  onClick={() => handleBuy(product)}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Success Modal */}
      {orderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 mb-6">Your request was processed by AWS Lambda.</p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-sm text-slate-600 mb-6">
              Order ID: {orderId}
            </div>
            <button 
              onClick={() => setOrderId(null)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
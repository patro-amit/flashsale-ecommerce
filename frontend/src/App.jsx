import { useState, useEffect } from 'react';
import { ShoppingCart, Zap, CheckCircle, Loader2, Trash2, Plus, Minus } from 'lucide-react';

// REPLACE THIS WITH YOUR AWS API GATEWAY URL
const API_URL = "https://481apei2q5.execute-api.ap-south-1.amazonaws.com/prod/checkout";

const PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5", price: 24999, oldPrice: 33000, stock: 12, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "MacBook Air M2", price: 82999, oldPrice: 99999, stock: 5, img: "/images/macbook.jpeg" },
  { id: 3, name: "PS5 Console", price: 37999, oldPrice: 41999, stock: 3, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "RTX 4090 GPU", price: 132999, oldPrice: 157999, stock: 2, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "iPhone 15 Pro", price: 79999, oldPrice: 99999, stock: 8, img: "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Samsung 4K Smart TV", price: 44999, oldPrice: 59999, stock: 6, img: "/images/samsung-tv.jpeg" },
  { id: 7, name: "DJI Air 3 Drone", price: 119999, oldPrice: 149999, stock: 4, img: "/images/dji-drone.jpeg" },
  { id: 8, name: "Canon EOS R6 Camera", price: 189999, oldPrice: 249999, stock: 3, img: "/images/canon-camera.jpeg" },
  { id: 9, name: "Apple Watch Series 9", price: 32999, oldPrice: 39999, stock: 10, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
  { id: 10, name: "iPad Pro 12.9", price: 67999, oldPrice: 89999, stock: 7, img: "/images/ipad-pro.png" },
  { id: 11, name: "Google Pixel 8 Pro", price: 54999, oldPrice: 69999, stock: 9, img: "/images/google-pixel.jpeg" },
  { id: 12, name: "AirPods Max", price: 54999, oldPrice: 64999, stock: 5, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" },
];
 

export default function App() {
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBuy = async (product) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We send the Product ID so Lambda knows what to check
        body: JSON.stringify({ productId: product.id, price: product.price }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // SUCCESS: The Backend said yes!
        setOrderId(data.orderId);
      } else {
        // FAILURE: The Backend said "Sold Out"
        alert(`Failed: ${data.message}`); // Show "Sold Out" alert
      }
    } catch (error) {
      console.error("Network Error", error);
      alert("System Error: Check API URL");
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
            <button 
              onClick={() => setShowCart(!showCart)}
              className="p-2 hover:bg-slate-100 rounded-full relative"
            >
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-[11px] text-white flex items-center justify-center font-bold">{cartCount}</span>
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <span className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
                  <span className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(product.stock / 20) * 100}%` }}></div>
                </div>
                <div className="text-xs text-orange-600 font-medium mb-4">Only {product.stock} left in stock!</div>

                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCart(false)}></div>
      )}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={() => setShowCart(false)} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-3">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-12 text-center border border-slate-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="ml-auto font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">{formatPrice(cartTotal)}</span>
            </div>
            <button
              onClick={handleBuyAll}
              disabled={loading || cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Checkout
                </>
              )}
            </button>
          </div>
        )}
      </div>

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
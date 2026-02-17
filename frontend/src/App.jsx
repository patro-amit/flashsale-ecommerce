import { useState, useEffect } from 'react';
import { ShoppingCart, Zap, CheckCircle, Loader2, Trash2, Plus, Minus, X } from 'lucide-react';

// YOUR API GATEWAY URL
const API_URL = "https://481apei2q5.execute-api.ap-south-1.amazonaws.com/prod/checkout";

const PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5", price: 24999, oldPrice: 33000, stock: 12, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "MacBook Air M2", price: 82999, oldPrice: 99999, stock: 5, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "PS5 Console", price: 37999, oldPrice: 41999, stock: 3, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "RTX 4090 GPU", price: 132999, oldPrice: 157999, stock: 2, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "iPhone 15 Pro", price: 79999, oldPrice: 99999, stock: 8, img: "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Samsung 4K Smart TV", price: 44999, oldPrice: 59999, stock: 6, img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "DJI Air 3 Drone", price: 119999, oldPrice: 149999, stock: 4, img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "Canon EOS R6", price: 189999, oldPrice: 249999, stock: 3, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80" },
  { id: 9, name: "Apple Watch S9", price: 32999, oldPrice: 39999, stock: 10, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
  { id: 10, name: "iPad Pro 12.9", price: 67999, oldPrice: 89999, stock: 7, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80" },
  { id: 11, name: "Google Pixel 8", price: 54999, oldPrice: 69999, stock: 9, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&w=500&q=80" },
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
    // Optional: Open cart immediately when adding
    setShowCart(true); 
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

  // --- THE MISSING FUNCTION THAT CAUSED THE CRASH ---
  const handleBuyAll = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    
    // For this demo, we'll process the first item in the cart or loop through them.
    // Since your backend expects a single item, let's loop and buy them one by one.
    // In a real app, you'd send the whole cart array to a different API endpoint.
    
    let lastOrderId = null;
    let errorOccurred = false;

    for (const item of cart) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Sending request for each item quantity times or just once per item type
          body: JSON.stringify({ productId: item.id, price: item.price }),
        });

        const data = await response.json();

        if (response.status === 200) {
          lastOrderId = data.orderId;
        } else {
          errorOccurred = true;
          alert(`Failed to buy ${item.name}: ${data.message}`);
          break; // Stop if one fails
        }
      } catch (error) {
        console.error("Network Error", error);
        errorOccurred = true;
        break;
      }
    }

    if (!errorOccurred && lastOrderId) {
      setOrderId(lastOrderId);
      setCart([]); // Clear cart on success
      setShowCart(false); // Close sidebar
    }
    
    setLoading(false);
  };
  // ------------------------------------------------

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-600 cursor-pointer" onClick={() => window.location.reload()}>
            <Zap className="h-6 w-6 fill-current" />
            <span className="font-bold text-xl tracking-tight">TechFlash</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm font-medium text-slate-500">Sale ends in 04:23:11</span>
            <button 
              onClick={() => setShowCart(!showCart)}
              className="p-2 hover:bg-slate-100 rounded-full relative transition-colors"
            >
              <ShoppingCart className="h-6 w-6 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full text-[11px] text-white flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Flash Sale is Live</h1>
        <p className="text-blue-100 text-lg font-medium">Serverless Architecture Demo • High Traffic Handling</p>
      </div>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-56 overflow-hidden bg-slate-100 relative group">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                </span>
                {product.stock < 5 && product.stock > 0 && (
                  <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    Fast Selling
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 text-slate-900 line-clamp-1">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</span>
                  <span className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
                </div>
                
                {/* Stock Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                     <span className={`${product.stock === 0 ? 'text-red-500' : 'text-slate-500'}`}>
                       {product.stock === 0 ? "Sold Out" : `Available: ${product.stock}`}
                     </span>
                     <span className="text-slate-400">Total: 20</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${product.stock < 5 ? 'bg-red-500' : 'bg-orange-500'}`} 
                      style={{ width: `${(product.stock / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 active:bg-slate-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {product.stock === 0 ? "Out of Stock" : (
                    <>
                      <Plus className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowCart(false)}></div>
      )}
      
      {/* Shopping Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-800">Your Cart ({cartCount})</h2>
          </div>
          <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <ShoppingCart className="h-16 w-16 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <button onClick={() => setShowCart(false)} className="text-blue-600 font-semibold hover:underline">
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 animate-in slide-in-from-right-5 duration-300">
                <div className="h-20 w-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-blue-600 font-bold mb-3">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded shadow-sm transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <button
              onClick={handleBuyAll}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing Order...
                </>
              ) : (
                <>
                  Checkout Now <span className="text-blue-200">• {formatPrice(cartTotal)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {orderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Order Placed!</h2>
            <p className="text-slate-500 mb-6">Your order has been securely processed by AWS Lambda & DynamoDB.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Transaction ID</p>
              <p className="font-mono text-sm text-slate-700 font-semibold break-all">{orderId}</p>
            </div>
            
            <button 
              onClick={() => {
                setOrderId(null);
                setCart([]);
                setShowCart(false);
              }}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
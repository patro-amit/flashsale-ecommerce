import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import LoadingOverlay from './components/LoadingOverlay';
import OrderModal from './components/OrderModal';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const json = await response.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart.map(({ id, name, price, quantity }) => ({
            id,
            name,
            price,
            quantity,
          })),
          customerEmail: 'flash-sale-customer@example.com',
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      const json = await response.json();
      
      if (json.success) {
        setOrderId(json.data.orderId);
        setCart([]);
        setShowCart(false);
      } else {
        throw new Error(json.message || 'Order creation failed');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearError = () => setError(null);
  const closeOrderModal = () => setOrderId(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar cartCount={cart.length} onCartClick={() => setShowCart(!showCart)} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 m-4 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800 text-xl">×</button>
        </div>
      )}

      {showCart ? (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          isProcessing={isProcessing}
        />
      ) : (
        <>
          <Hero />
          <ProductGrid
            products={products}
            onAddToCart={addToCart}
            loading={loading}
            onRetry={fetchProducts}
          />
        </>
      )}

      {isProcessing && <LoadingOverlay />}
      {orderId && <OrderModal orderId={orderId} onClose={closeOrderModal} />}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { ShoppingCart, Star, Truck, RotateCcw, Mail, ArrowRight, Heart } from 'lucide-react';

const Home = () => {
  const [newest, setNewest] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [email, setEmail] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch Newest Arrivals
    fetch('http://127.0.0.1:8000/api/products/newest?limit=5')
      .then(res => res.json())
      .then(data => setNewest(data));

    // Fetch Best Sellers
    fetch('http://127.0.0.1:8000/api/products/most-sold?limit=5')
      .then(res => res.json())
      .then(data => setBestSellers(data));

    // Get total count for the footer/call-to-action
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(data => setTotalCount(data.length));
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <div className="homepage-container bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[500px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22white%22 stroke-width=%221%22/></svg>')] bg-repeat"></div>
        
        <div className="relative h-full flex items-center justify-between px-8 md:px-16 lg:px-24">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Welcome to MyStore</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">Discover premium quality products handpicked for you. Shop the latest trends and bestsellers.</p>
            <div className="flex gap-4">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                Shop Now <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition">
                View Collection
              </button>
            </div>
          </div>
          
          {bestSellers[0] && (
            <div className="hidden lg:flex flex-1 justify-center">
              <img 
                src={bestSellers[0].image} 
                alt="Featured Product" 
                className="h-80 object-cover rounded-lg shadow-2xl" 
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. Trust Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-16 lg:px-24 py-16 bg-gray-50">
        <div className="flex items-center gap-4">
          <Truck className="text-slate-900" size={32} />
          <div>
            <h3 className="font-semibold text-lg">Free Shipping</h3>
            <p className="text-gray-600">On orders over $50</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <RotateCcw className="text-slate-900" size={32} />
          <div>
            <h3 className="font-semibold text-lg">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Star className="text-slate-900" size={32} />
          <div>
            <h3 className="font-semibold text-lg">Trusted by Customers</h3>
            <p className="text-gray-600">4.9/5 ratings</p>
          </div>
        </div>
      </section>

      {/* 3. Just Dropped Section */}
      <section className="px-8 md:px-16 lg:px-24 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Just Dropped 🔥</h2>
          <a href="/shop" className="text-slate-900 font-semibold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={20} />
          </a>
        </div>
        <div className="flex overflow-x-auto gap-6 pb-4 scroll-smooth">
          {newest.slice(0, 10).map(product => (
            <div key={product.id} className="flex-shrink-0 w-56 group cursor-pointer">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 aspect-square">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
                >
                  <Heart 
                    size={20} 
                    className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-slate-900">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-bold text-slate-900">${product.price}</p>
                <button className="bg-slate-900 text-white rounded-full p-2 hover:bg-slate-800 transition">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers Grid */}
      <section className="px-8 md:px-16 lg:px-24 py-16 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Right Now ⭐</h2>
          <a href="/shop" className="text-slate-900 font-semibold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={20} />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bestSellers.slice(0, 10).map(product => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">
              <div className="relative bg-gray-100 aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  SALE
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">(124)</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-900">${product.price}</p>
                  <button className="bg-slate-900 text-white rounded-full p-2 hover:bg-slate-800 transition">
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Newsletter Signup */}
      <section className="mx-8 md:mx-16 lg:mx-24 my-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 md:p-12 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Get Exclusive Offers</h2>
          <p className="text-gray-300 mb-6">Subscribe to our newsletter and get 10% off your first order.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none"
            />
            <button 
              type="submit"
              className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2 whitespace-nowrap"
            >
              <Mail size={18} />
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 6. Browse Collection CTA */}
      <section className="text-center py-20 px-8">
        <h2 className="text-3xl font-bold mb-4">Browse Our Full Collection</h2>
        <p className="text-gray-600 mb-6 text-lg">Explore {totalCount} handpicked products</p>
        <button className="bg-slate-900 text-white px-10 py-3 rounded-lg font-semibold hover:bg-slate-800 transition inline-flex items-center gap-2">
          View All Products <ArrowRight size={20} />
        </button>
      </section>
    </div>
  );
};
export default Home;
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "New iPhone 15 Pro Max",
      subtitle: "Titanium. So strong. So light. So Pro.",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
      buttonText: "Shop Now",
      color: "from-purple-700 to-pink-600"
    },
    {
      id: 2,
      title: "Gaming PCs & Laptops",
      subtitle: "Unleash Maximum Performance",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
      buttonText: "Explore Gaming",
      color: "from-blue-700 to-purple-600"
    },
    {
      id: 3,
      title: "Accessories Sale",
      subtitle: "Up to 50% Off Headphones & Cases",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      buttonText: "View Deals",
      color: "from-pink-700 to-purple-600"
    }
  ];

  const categories = [
    { id: 1, name: "Smartphones", icon: "📱", count: 245, color: "bg-gradient-to-r from-purple-500 to-pink-400" },
    { id: 2, name: "Laptops", icon: "💻", count: 189, color: "bg-gradient-to-r from-blue-500 to-purple-400" },
    { id: 3, name: "Tablets", icon: "📟", count: 124, color: "bg-gradient-to-r from-pink-500 to-purple-400" },
    { id: 4, name: "Gaming", icon: "🎮", count: 167, color: "bg-gradient-to-r from-green-500 to-blue-400" },
    { id: 5, name: "Accessories", icon: "🎧", count: 312, color: "bg-gradient-to-r from-orange-500 to-pink-400" },
    { id: 6, name: "Smart Watches", icon: "⌚", count: 98, color: "bg-gradient-to-r from-cyan-500 to-blue-400" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      category: "Smartphone",
      price: 999,
      originalPrice: 1099,
      rating: 4.8,
      reviewCount: 1245,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "MacBook Pro 14\"",
      category: "Laptop",
      price: 1999,
      originalPrice: 2199,
      rating: 4.9,
      reviewCount: 892,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
      badge: "New"
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      category: "Headphones",
      price: 349,
      originalPrice: 399,
      rating: 4.7,
      reviewCount: 2341,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      badge: "Sale"
    },
    {
      id: 4,
      name: "PlayStation 5",
      category: "Gaming",
      price: 499,
      originalPrice: 549,
      rating: 4.6,
      reviewCount: 1567,
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80",
      badge: "Hot"
    },
  ];

  const features = [
    {
      icon: <Truck className="text-purple-600" size={32} />,
      title: "Free Shipping",
      description: "On orders over $99"
    },
    {
      icon: <Shield className="text-purple-600" size={32} />,
      title: "2-Year Warranty",
      description: "On all products"
    },
    {
      icon: <RefreshCw className="text-purple-600" size={32} />,
      title: "30-Day Returns",
      description: "Hassle-free returns"
    },
    {
      icon: <ShoppingBag className="text-purple-600" size={32} />,
      title: "Secure Payment",
      description: "100% secure transactions"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden rounded-lg mx-4 mt-4 lg:mx-8">
        <div className="relative h-[400px] lg:h-[500px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-gray-200 mb-8">
                      {slide.subtitle}
                    </p>
                    <Link
                      to="/products"
                      className={`inline-flex items-center px-8 py-3 bg-gradient-to-r ${slide.color} text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 no-underline`}
                    >
                      {slide.buttonText}
                      <ArrowRight className="ml-2" size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
          <Link to="/categories" className="text-purple-600 hover:text-purple-700 font-medium flex items-center no-underline">
            View All
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-1 no-underline"
            >
              <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-gray-500 text-sm">{category.count} Products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12 bg-gradient-to-b from-purple-50 to-white rounded-2xl my-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium tech products at unbeatable prices
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    product.badge === "Sale" ? "bg-pink-500" :
                    product.badge === "New" ? "bg-green-500" :
                    product.badge === "Best Seller" ? "bg-purple-500" : "bg-orange-500"
                  }`}>
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShoppingBag size={20} className="text-purple-600" />
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-gray-500 text-sm mb-1">{product.category}</p>
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm ml-2">
                    ({product.reviewCount})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-md transition-all hover:scale-105">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 no-underline"
          >
            View All Products
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Tech Deals</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 10% off your first order, plus exclusive deals on the latest tech products.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          
          <p className="text-purple-200 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MS</span>
                </div>
                <h3 className="text-2xl font-bold">MyStore</h3>
              </div>
              <p className="text-gray-400">
                Your one-stop shop for premium electronics and tech products.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-gray-400 hover:text-white no-underline">Products</Link></li>
                <li><Link to="/categories" className="text-gray-400 hover:text-white no-underline">Categories</Link></li>
                <li><Link to="/deals" className="text-gray-400 hover:text-white no-underline">Deals</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white no-underline">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-400 hover:text-white no-underline">Contact Us</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white no-underline">FAQ</Link></li>
                <li><Link to="/shipping" className="text-gray-400 hover:text-white no-underline">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-gray-400 hover:text-white no-underline">Returns Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <p className="text-gray-400">
                123 Tech Street<br />
                San Francisco, CA 94107<br />
                contact@mystore.com<br />
                (555) 123-4567
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
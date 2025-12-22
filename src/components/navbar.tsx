import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Home, Package, Tag, Zap } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem("auth_token");

  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Open search modal");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <div className="sticky top-0 z-40 shadow-lg bg-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden text-gray-600 hover:text-purple-600"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
              
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MS</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MyStore
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 hover:scale-105"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 hover:scale-105"
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 hover:scale-105"
              >
                Categories
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Desktop Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-4">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative items-center ">
                    <input
                      type="text"
                      placeholder="        Search products, brands, and categories..."
                      className="px-4 py-2.5 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                    />
                    <button
                      type="submit"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                    >
                      <Search size={15} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Mobile Search Button */}
              <button 
                onClick={handleSearch}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={24} className="text-gray-600 hover:text-purple-600" />
              </button>

              {/* Cart Button */}
              <Link to="/cart" className="relative group">
                <div className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <ShoppingCart size={20} className="text-gray-700 group-hover:text-purple-600" />
                  <span className="hidden md:inline font-medium text-gray-700 group-hover:text-purple-600">
                    Cart
                  </span>
                </div>
              </Link>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <User size={20} className="text-gray-600 group-hover:text-purple-600" />
                    <span className="font-medium text-gray-700 group-hover:text-purple-600">
                      Profile
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <User size={20} className="text-gray-600 group-hover:text-purple-600" />
                      <span className="font-medium text-gray-700 group-hover:text-purple-600">
                        Login
                      </span>
                    </Link>
                    <Link 
                      to="/registration"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 no-underline text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isSidebarOpen ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={closeSidebar}
        />

        {/* Sidebar Panel */}
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">MS</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">MyStore</h2>
              </div>
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="p-4">
            {/* User Section */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                      <User className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-800 text-sm font-semibold">Logged in</p>
                      <Link 
                        to="/profile"
                        onClick={closeSidebar}
                        className="text-xs text-purple-600 hover:text-purple-700 no-underline font-medium"
                      >
                        Go to Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-2">Welcome to MyStore</p>
                  <div className="flex space-x-3">
                    <Link 
                      to="/login"
                      onClick={closeSidebar}
                      className="flex-1 px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg font-medium text-center hover:bg-purple-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/registration"
                      onClick={closeSidebar}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-center hover:shadow-md transition-shadow"
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              <Link 
                to="/" 
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link 
                to="/products" 
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Package size={20} />
                <span>Products</span>
              </Link>
              <Link 
                to="/categories" 
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Tag size={20} />
                <span>Categories</span>
              </Link>
              <Link 
                to="/deals" 
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-purple-600 font-medium"
              >
                <Zap size={20} />
                <span>Deals</span>
              </Link>
              <Link 
                to="/cart" 
                onClick={closeSidebar}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-purple-600 font-medium"
              >
                <ShoppingCart size={20} />
                <span>My Cart</span>
                <span className="ml-auto bg-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  3
                </span>
              </Link>
            </nav>

            {/* Additional Links */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-gray-500 text-xs font-semibold uppercase mb-3">
                More
              </h3>
              <div className="space-y-2">
                <Link 
                  to="/profile" 
                  onClick={closeSidebar}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-purple-600"
                >
                  <User size={18} />
                  <span className="text-sm">My Account</span>
                </Link>
                <Link 
                  to="/orders" 
                  onClick={closeSidebar}
                  className="block p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-purple-600 text-sm"
                >
                  My Orders
                </Link>
                <Link 
                  to="/wishlist" 
                  onClick={closeSidebar}
                  className="block p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-purple-600 text-sm"
                >
                  Wishlist
                </Link>
                <Link 
                  to="/settings" 
                  onClick={closeSidebar}
                  className="block p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-purple-600 text-sm"
                >
                  Settings
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t">
              <div className="text-center">
                <p className="text-gray-500 text-xs">
                  © 2024 MyStore. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
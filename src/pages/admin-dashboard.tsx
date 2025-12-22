import { useState } from "react";
import { Users, UserPlus, Trash2, Package, Edit, BarChart2 } from "lucide-react";

type Admin = {
  id: number;
  name: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "admins" | "products">("overview");

  // Dummy data – later you can replace with real API calls
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 1, name: "Main Admin", email: "admin@mystore.com" },
  ]);
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Sample Product", price: 99.99, stock: 10 },
  ]);

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "" });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", stock: "" });

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim()) return;
    setAdmins(prev => [
      ...prev,
      { id: Date.now(), name: newAdmin.name.trim(), email: newAdmin.email.trim() },
    ]);
    setNewAdmin({ name: "", email: "" });
  };

  const handleDeleteAdmin = (id: number) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const startAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", stock: "" });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    if (!productForm.name.trim() || isNaN(price) || isNaN(stock)) return;

    if (editingProduct) {
      // update
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id ? { ...p, name: productForm.name.trim(), price, stock } : p
        )
      );
    } else {
      // create
      setProducts(prev => [
        ...prev,
        { id: Date.now(), name: productForm.name.trim(), price, stock },
      ]);
    }

    setEditingProduct(null);
    setProductForm({ name: "", price: "", stock: "" });
  };

  // Simple mock stats
  const stats = {
    totalAdmins: admins.length,
    totalProducts: products.length,
    totalSales: 12450,
    todaysOrders: 27,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage admins, products, and view store statistics.
          </p>
        </header>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === "overview"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === "admins"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Admins</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${
                activeTab === "products"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Admins
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{stats.totalAdmins}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Products
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total Sales
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-800">${stats.totalSales}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Today&apos;s Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{stats.todaysOrders}</p>
            </div>
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === "admins" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Admin list */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>Admins</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Email</th>
                      <th className="px-4 py-2 text-right text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id} className="border-t">
                        <td className="px-4 py-2">{admin.name}</td>
                        <td className="px-4 py-2 text-gray-600">{admin.email}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {admins.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-4 text-center text-gray-500 text-sm"
                        >
                          No admins yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add admin form */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Add New Admin</span>
              </h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Admin name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={e => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-150"
                >
                  Add Admin
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products list */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>Products</span>
                </h2>
                <button
                  onClick={startAddProduct}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-md"
                >
                  <Package className="w-4 h-4 mr-1" />
                  New Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Price</th>
                      <th className="px-4 py-2 text-left text-gray-500 font-medium">Stock</th>
                      <th className="px-4 py-2 text-right text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-t">
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2 text-gray-700">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{product.stock}</td>
                        <td className="px-4 py-2 text-right space-x-2">
                          <button
                            onClick={() => startEditProduct(product)}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-purple-600 hover:bg-purple-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-4 text-center text-gray-500 text-sm"
                        >
                          No products yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add / Edit product form */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>{editingProduct ? "Edit Product" : "Add Product"}</span>
              </h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.stock}
                    onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-150"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



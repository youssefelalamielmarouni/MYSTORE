import { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Package, Edit, BarChart2, CheckCircle, XCircle, X, DollarSign, ShoppingCart, AlertTriangle, Eye, UserCheck, Globe } from "lucide-react";

type Admin = {
  id: number;
  name: string;
  email: string;
};

type ProductImage = {
  id: number;
  url?: string;
  path?: string;
};

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  images?: ProductImage[];
  images_urls?: string[];
};

type Notification = {
  id: number;
  message: string;
  type: "success" | "error";
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "admins" | "products">("overview");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingProductImages, setExistingProductImages] = useState<ProductImage[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState<number | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [visitorAnalytics, setVisitorAnalytics] = useState<any>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Auto-dismiss notifications after 4 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const showNotification = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Fetch admins from API
  const fetchAdmins = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      showNotification("You must be logged in to view admins.", "error");
      return;
    }

    setIsLoadingAdmins(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/admins", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch admins");
      }

      // Handle different response formats
      const adminsList = Array.isArray(data) ? data : (data.data || data.admins || []);

      // Map admins to match our structure
      const mappedAdmins = adminsList.map((admin: any) => ({
        id: admin.id,
        name: admin.name || admin.user?.name || "",
        email: admin.email || admin.user?.email || "",
      }));

      setAdmins(mappedAdmins);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching admins";
      showNotification(errorMessage, "error");
      console.error("Admins fetch error:", err);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      showNotification("You must be logged in to view products.", "error");
      return;
    }

    setIsLoadingProducts(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch products");
      }

      // Handle paginated response - extract data array
      const productsList = Array.isArray(data) ? data : (data.data || data.products || []);

      // Map products to match our structure and handle images
      const mappedProducts = productsList.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        stock: product.stock,
        images: product.images?.map((img: any, index: number) => ({
          id: img.id,
          url: product.images_urls?.[index] || `http://127.0.0.1:8000/storage/${img.path}`,
          path: img.path,
        })) || [],
        images_urls: product.images_urls || [],
      }));

      setProducts(mappedProducts);
      
      // Check for low stock products and show alert
      checkLowStockProducts(mappedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching products";
      showNotification(errorMessage, "error");
      console.error("Products fetch error:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch metrics from API
  const fetchMetrics = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    setIsLoadingMetrics(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/metrics", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch metrics");
      }

      setMetrics(data);
    } catch (err) {
      console.error("Metrics fetch error:", err);
      // Don't show notification for metrics errors to avoid spam
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Fetch visitor analytics from API
  const fetchVisitorAnalytics = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    setIsLoadingAnalytics(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/visitor-analytics?days=30", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch visitor analytics");
      }

      setVisitorAnalytics(data);
    } catch (err) {
      console.error("Visitor analytics fetch error:", err);
      // Don't show notification for analytics errors to avoid spam
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  // Check for low stock products
  const checkLowStockProducts = (productsList: Product[]) => {
    const LOW_STOCK_THRESHOLD = 10; // Alert if stock is below 10 units
    const lowStockProducts = productsList.filter(p => p.stock < LOW_STOCK_THRESHOLD);

    if (lowStockProducts.length > 0) {
      const productNames = lowStockProducts.map(p => `"${p.name}" (${p.stock} units)`).join(", ");
      const message = `⚠️ Low Stock Alert: ${productNames}`;
      showNotification(message, "error");
      console.warn("Low stock products detected:", lowStockProducts);
    }
  };

  // Load data when component mounts or when tabs are active
  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "admins") {
      fetchAdmins();
    } else if (activeTab === "overview") {
      fetchMetrics();
      fetchVisitorAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Check for low stock on component mount
  useEffect(() => {
    const checkLowStockOnMount = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/products", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          const productsList = Array.isArray(data) ? data : (data.data || data.products || []);
          const mappedProducts = productsList.map((product: any) => ({
            id: product.id,
            name: product.name,
            stock: product.stock,
          }));
          checkLowStockProducts(mappedProducts);
        }
      } catch (err) {
        console.error("Error checking low stock on mount:", err);
      }
    };

    checkLowStockOnMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAddAdmin = () => {
    setEditingAdmin(null);
    setNewAdmin({ name: "", email: "", password: "" });
  };

  const startEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      password: "", // Don't pre-fill password for security
    });
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.name.trim() || !newAdmin.email.trim()) {
      showNotification("Please fill in name and email", "error");
      return;
    }

    // Password is required for new admins, optional for updates
    if (!editingAdmin && !newAdmin.password.trim()) {
      showNotification("Password is required for new admins", "error");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      showNotification("You must be logged in to manage admins.", "error");
      return;
    }

    setIsSubmittingAdmin(true);
    const adminName = newAdmin.name.trim();

    try {
      const url = editingAdmin
        ? `http://127.0.0.1:8000/api/admin/users/${editingAdmin.id}`
        : "http://127.0.0.1:8000/api/admin/users/create-admin";

      const body: any = {
        name: adminName,
        email: newAdmin.email.trim(),
      };

      // Include password if provided (required for create, optional for update)
      if (newAdmin.password.trim()) {
        body.password = newAdmin.password;
      }

      console.log(`${editingAdmin ? "Updating" : "Creating"} admin:`, { url, body });

      const response = await fetch(url, {
        method: editingAdmin ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      console.log(`Response status: ${response.status}`, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || `Failed to ${editingAdmin ? "update" : "create"} admin`);
      }

      // Refresh admins list from API
      await fetchAdmins();

      setNewAdmin({ name: "", email: "", password: "" });
      setEditingAdmin(null);
      showNotification(
        `Admin "${adminName}" ${editingAdmin ? "updated" : "created"} successfully!`,
        "success"
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `An error occurred while ${editingAdmin ? "updating" : "creating"} the admin`;
      showNotification(errorMessage, "error");
      console.error("Admin save error:", err);
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    const admin = admins.find(a => a.id === id);

    if (!window.confirm(`Are you sure you want to delete admin "${admin?.name || "User"}"? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      showNotification("You must be logged in to delete admins.", "error");
      return;
    }

    try {
      const url = `http://127.0.0.1:8000/api/admin/users/${id}`;
      console.log("Deleting admin:", { url });

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(`Delete response status: ${response.status}`, data);

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete admin");
      }

      // Remove from UI after successful deletion
      setAdmins(prev => prev.filter(a => a.id !== id));
      showNotification(`Admin "${admin?.name || "User"}" deleted successfully!`, "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting the admin";
      showNotification(errorMessage, "error");
      console.error("Admin delete error:", err);
      // Refresh the list to ensure consistency
      await fetchAdmins();
    }
  };

  const startAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", description: "", price: "", stock: "" });
    setProductImages([]);
    setExistingProductImages([]);
    setImagesToRemove([]);
    setProductError(null);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    const priceValue = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: priceValue.toString(),
      stock: product.stock.toString(),
    });
    setProductImages([]);
    // Use images from product, ensuring they have URLs
    const imagesWithUrls = (product.images || []).map((img, index) => ({
      ...img,
      url: img.url || product.images_urls?.[index] || `http://127.0.0.1:8000/storage/${img.path || ''}`,
    }));
    setExistingProductImages(imagesWithUrls);
    setImagesToRemove([]);
    setProductError(null);
  };

  const handleRemoveImage = (imageId: number) => {
    setImagesToRemove(prev => [...prev, imageId]);
    setExistingProductImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      showNotification("You must be logged in to delete products.", "error");
      return;
    }

    setIsDeletingProduct(productId);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete product");
      }

      // Refresh products list
      await fetchProducts();

      // If the deleted product was being edited, reset the form
      if (editingProduct && editingProduct.id === productId) {
        startAddProduct();
      }

      showNotification(`Product "${productName}" deleted successfully!`, "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting the product";
      showNotification(errorMessage, "error");
      console.error("Product delete error:", err);
    } finally {
      setIsDeletingProduct(null);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError(null);

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    if (!productForm.name.trim() || isNaN(price) || isNaN(stock)) {
      setProductError("Please fill in all required fields correctly.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setProductError("You must be logged in to add products.");
      return;
    }

    setIsSubmittingProduct(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", productForm.name.trim());
      formData.append("description", productForm.description.trim() || "");
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());

      // For editing, use POST with _method=PUT (Laravel method spoofing)
      if (editingProduct) {
        formData.append("_method", "PUT");

        // Append image IDs to remove
        imagesToRemove.forEach((imageId) => {
          formData.append("remove_image_ids[]", imageId.toString());
        });
      }

      // Append new images if any
      productImages.forEach((image) => {
        formData.append("images[]", image);
      });

      const url = editingProduct
        ? `http://127.0.0.1:8000/api/products/${editingProduct.id}`
        : "http://127.0.0.1:8000/api/products";

      const response = await fetch(url, {
        method: "POST", // Always use POST (Laravel uses _method for PUT)
        headers: {
          "Authorization": `Bearer ${token}`,
          // Don't set Content-Type header - browser will set it with boundary for FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to save product");
      }

      // Reset form
      setEditingProduct(null);
      setProductForm({ name: "", description: "", price: "", stock: "" });
      setProductImages([]);
      setExistingProductImages([]);
      setImagesToRemove([]);

      // Refresh products list from API
      await fetchProducts();

      // Show success notification
      showNotification(
        editingProduct
          ? `Product "${productForm.name.trim()}" updated successfully!`
          : `Product "${productForm.name.trim()}" created successfully!`,
        "success"
      );

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while saving the product";
      setProductError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Product save error:", err);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setProductImages(filesArray);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-in slide-in-from-right ${notification.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
                }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <p
                className={`flex-1 text-sm font-medium ${notification.type === "success" ? "text-green-800" : "text-red-800"
                  }`}
              >
                {notification.message}
              </p>
              <button
                onClick={() => removeNotification(notification.id)}
                className={`flex-shrink-0 ${notification.type === "success" ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"
                  }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

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
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${activeTab === "overview"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${activeTab === "admins"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Admins</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-3 px-1 border-b-2 text-sm font-medium flex items-center space-x-2 ${activeTab === "products"
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
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Users
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {isLoadingMetrics ? "..." : (metrics?.summary?.total_users || 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Admins
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {isLoadingMetrics ? "..." : (metrics?.summary?.total_admins || 0)}
                    </p>
                  </div>
                  <UserPlus className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Products
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {isLoadingMetrics ? "..." : (metrics?.summary?.total_products || 0)}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-600 opacity-50" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Orders
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {isLoadingMetrics ? "..." : (metrics?.summary?.total_orders || 0)}
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-orange-600 opacity-50" />
                </div>
              </div>
            </div>

            {/* Sales Metrics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Sales Metrics</span>
              </h2>
              {isLoadingMetrics ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Revenue
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      ${(metrics?.sales?.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Sales Count
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {metrics?.sales?.total_sales_count || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Average Order Value
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      ${(metrics?.sales?.average_order_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                  <span>Orders by Status</span>
                </h2>
                {isLoadingMetrics ? (
                  <p className="text-gray-500">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Completed</span>
                      <span className="text-lg font-bold text-green-600">
                        {metrics?.orders?.by_status?.completed || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {metrics?.orders?.by_status?.pending || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Cancelled</span>
                      <span className="text-lg font-bold text-red-600">
                        {metrics?.orders?.by_status?.cancelled || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span>Orders by Payment</span>
                </h2>
                {isLoadingMetrics ? (
                  <p className="text-gray-500">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Paid</span>
                      <span className="text-lg font-bold text-green-600">
                        {metrics?.orders?.by_payment?.paid || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Unpaid</span>
                      <span className="text-lg font-bold text-orange-600">
                        {metrics?.orders?.by_payment?.unpaid || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Inventory Alerts</span>
              </h2>
              {isLoadingMetrics ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {metrics?.inventory?.low_stock_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Products with low inventory</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">
                      {metrics?.inventory?.out_of_stock_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Products out of stock</p>
                  </div>
                </div>
              )}
            </div>

            {/* Visitor Analytics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <span>Visitor Analytics (Last 30 Days)</span>
              </h2>
              {isLoadingAnalytics ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">Unique Visitors</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {visitorAnalytics?.unique_visitors || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <UserCheck className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-700">Authenticated</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {visitorAnalytics?.authenticated_visitors || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-5 h-5 text-gray-600" />
                        <p className="text-sm font-medium text-gray-700">Guest Visitors</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-600">
                        {visitorAnalytics?.guest_visitors || 0}
                      </p>
                    </div>
                  </div>

                  {visitorAnalytics?.top_pages && visitorAnalytics.top_pages.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-700 mb-3">Top 10 Most Visited Pages</h3>
                      <div className="space-y-2">
                        {visitorAnalytics.top_pages.slice(0, 10).map((page: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-700">{page.path || page.page || `Page ${index + 1}`}</span>
                            <span className="text-sm font-semibold text-purple-600">{page.views || page.count || 0} views</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {visitorAnalytics?.daily_trends && visitorAnalytics.daily_trends.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-700 mb-3">Daily Visitor Trends</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {visitorAnalytics.daily_trends.map((day: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-xs text-gray-600">{day.date || day.day || `Day ${index + 1}`}</span>
                            <span className="text-xs font-semibold text-gray-700">{day.visitors || day.count || 0} visitors</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {visitorAnalytics?.page_views_per_day && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-700 mb-3">Page Views Per Day</h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {visitorAnalytics.page_views_per_day}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                    {isLoadingAdmins ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-gray-500 text-sm"
                        >
                          Loading admins...
                        </td>
                      </tr>
                    ) : (
                      <>
                        {admins.map(admin => (
                          <tr key={admin.id} className="border-t">
                            <td className="px-4 py-2">{admin.name}</td>
                            <td className="px-4 py-2 text-gray-600">{admin.email}</td>
                            <td className="px-4 py-2 text-right space-x-2">
                              <button
                                onClick={() => startEditAdmin(admin)}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-purple-600 hover:bg-purple-50"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
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
                        {admins.length === 0 && !isLoadingAdmins && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-4 text-center text-gray-500 text-sm"
                            >
                              No admins yet.
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add / Edit admin form */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  {editingAdmin ? (
                    <>
                      <Edit className="w-5 h-5 text-purple-600" />
                      <span>Edit Admin</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 text-purple-600" />
                      <span>Add New Admin</span>
                    </>
                  )}
                </h2>
                {editingAdmin && (
                  <button
                    onClick={startAddAdmin}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newAdmin.name}
                    onChange={e => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="John Admin"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email}
                    onChange={e => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingAdmin ? "(Leave blank to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={e => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder={editingAdmin ? "newpass123 (optional)" : "password123"}
                    required={!editingAdmin}
                    minLength={editingAdmin ? 0 : 6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingAdmin
                    ? (editingAdmin ? "Updating..." : "Creating...")
                    : (editingAdmin ? "Update Admin" : "Create Admin")}
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
                    {isLoadingProducts ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500 text-sm"
                        >
                          Loading products...
                        </td>
                      </tr>
                    ) : (
                      <>
                        {products.map(product => {
                          const priceValue = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                          return (
                            <tr key={product.id} className="border-t">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2 text-gray-700">
                                ${priceValue.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-gray-700">{product.stock}</td>
                              <td className="px-4 py-2 text-right space-x-2">
                                <button
                                  onClick={() => startEditProduct(product)}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-purple-600 hover:bg-purple-50"
                                  disabled={isDeletingProduct === product.id}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  disabled={isDeletingProduct === product.id}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  {isDeletingProduct === product.id ? "Deleting..." : "Delete"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {products.length === 0 && !isLoadingProducts && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-4 text-center text-gray-500 text-sm"
                            >
                              No products yet.
                            </td>
                          </tr>
                        )}
                      </>
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

              {productError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{productError}</p>
                </div>
              )}

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="T-shirt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="Cotton tee"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={productForm.price}
                    onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="19.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productForm.stock}
                    onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    placeholder="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images {!editingProduct && "(Optional)"}
                  </label>

                  {/* Show existing images when editing */}
                  {editingProduct && existingProductImages.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Existing Images:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingProductImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url || `https://via.placeholder.com/100?text=Image+${image.id}`}
                              alt={`Product ${image.id}`}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New images input */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                  {productImages.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500">
                      {productImages.length} new file(s) selected
                    </p>
                  )}
                  {editingProduct && imagesToRemove.length > 0 && (
                    <p className="mt-1 text-xs text-orange-600">
                      {imagesToRemove.length} image(s) marked for removal
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md hover:scale-[1.01] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingProduct
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


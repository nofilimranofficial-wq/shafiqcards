import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(""); // empty for all
  const limit = 25; // As requested

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(page, limit, category);
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to load your collection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        fetchProducts(); // Refresh current page
        alert("Product deleted successfully.");
      } catch (err) {
        alert("Failed to delete product: " + err.message);
      }
    }
  };

  // Client-side search for the current page
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-[#c59d5f]/20 border-t-[#c59d5f] rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Accessing Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col xl:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 display-serif">Product Collection</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and refine your premium inventory.</p>
        </div>

        <div className="flex flex-col md:flex-row w-full xl:w-auto gap-4 items-center">
           {/* Category Filter */}
           <select 
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-sm appearance-none cursor-pointer"
           >
              <option value="">All Categories</option>
              <option value="invitation">Invitations</option>
              <option value="envelope">Envelopes</option>
              <option value="box">Boxes</option>
              <option value="reel">Digital Reels</option>
           </select>

           <div className="relative flex-grow md:w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search this page..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-sm"
              />
           </div>
           
           <Link 
            to="/admin/create-product" 
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-amber-300/30 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Add New Masterpiece
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Product Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden sm:table-cell">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:table-cell">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 shadow-sm">
                        {product.mediaUrls?.[0] ? (
                          product.category === 'reel' ? (
                            <video 
                              src={product.mediaUrls[0]} 
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              muted
                              preload="metadata"
                              controls
                            />
                          ) : (
                            <img src={product.mediaUrls[0]} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                             <span className="material-symbols-outlined">image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-1">{product.title}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                           {product.description?.match(/Price:\s*(\d+)/)?.[1] ? `PKR ${product.description.match(/Price:\s*(\d+)/)[1]}` : 'Price N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-semibold text-slate-600 capitalize whitespace-nowrap">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
                       {product.isActive ? (
                         <>
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                           <span className="text-emerald-600">Active</span>
                         </>
                       ) : (
                         <>
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                           <span className="text-slate-500">Inactive</span>
                         </>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                        className="p-2 hover:bg-amber-100 text-slate-500 hover:text-amber-600 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id, product.title)}
                        className="p-2 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">inventory</span>
                    <p className="text-slate-500 font-medium">No products match your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em]">
              Vault Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

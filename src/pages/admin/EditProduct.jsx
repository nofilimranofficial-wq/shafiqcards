import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../utils/api";

const extractFieldFromDescription = (description = '', label) => {
  const regex = new RegExp(`${label}:\\s*([^\\n]+)`, 'i');
  return description?.match(regex)?.[1]?.trim() || '';
};

const stripMetadataFromDescription = (description = '') => {
  return description
    .replace(/Price:\s*\d+[\d,]*\s*/gi, '')
    .replace(/Card Number:\s*[^\n]+\s*/gi, '')
    .trim();
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "invitation",
    price: "",
    cardNumber: "",
    description: "",
    isActive: true
  });
  const [existingMedia, setExistingMedia] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        const sanitizedDescription = stripMetadataFromDescription(product.description || '');
        const cardNumber = extractFieldFromDescription(product.description || '', 'Card Number');

        setFormData({
          title: product.title || '',
          category: product.category || 'invitation',
          price: product.price || '',
          cardNumber,
          description: sanitizedDescription,
          isActive: product.isActive !== false
        });
        setExistingMedia(product.mediaUrls || []);
      } catch (err) {
        setError("Product not found or access denied.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const removeExistingMedia = (index) => {
    const mediaToRemove = existingMedia[index];
    setExistingMedia(existingMedia.filter((_, i) => i !== index));
    setRemovedMedia([...removedMedia, mediaToRemove]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title || '');
      submitData.append("category", formData.category);
      submitData.append("price", formData.price || '');
      submitData.append("isActive", formData.isActive);

      let descriptionText = stripMetadataFromDescription(formData.description || '');
      if (formData.cardNumber) {
        descriptionText = `${descriptionText}${descriptionText ? '\n\n' : ''}Card Number: ${formData.cardNumber}`;
      }
      submitData.append("description", descriptionText);
      submitData.append("mediaUrls", JSON.stringify(existingMedia));

      if (newFiles.length > 0) {
        for (let i = 0; i < newFiles.length; i++) {
          submitData.append("media", newFiles[i]);
        }
      }

      await updateProduct(id, submitData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 2000);
    } catch (err) {
      setError(err.message || "Failed to update product details.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Fetching Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 display-serif">Edit Masterpiece</h1>
          <p className="text-slate-600 mt-1 font-medium">Refine the details of your fine collection.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products')}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors"
        >
          Discard Changes
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">{error}</div>}
      {success && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium">Changes preserved successfully. Returning to vault...</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Title</label>
            <input 
              type="text" required name="title" value={formData.title} onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange} required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="invitation">Wedding Invitation</option>
              <option value="envelope">Premium Envelope</option>
              <option value="box">Corporate Box</option>
              <option value="reel">Digital Reel</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Price (PKR)</label>
            <input 
               type="number" name="price" value={formData.price} onChange={handleChange}
               className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Code</label>
            <input 
               type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
               className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
          <textarea 
            required name="description" value={formData.description} onChange={handleChange} rows="5"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none transition-all text-sm resize-none"
          ></textarea>
        </div>

        {/* Existing Media Preview */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Existing Assets</label>
          <div className="flex flex-wrap gap-4 p-6 bg-slate-50 border border-slate-200 rounded-[2rem]">
            {existingMedia.map((url, i) => (
              <div key={i} className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                {formData.category === 'reel' ? (
                  <video src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" muted preload="metadata" controls />
                ) : (
                  <img src={url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
                <button
                  type="button"
                  onClick={() => removeExistingMedia(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove this media"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
            {existingMedia.length === 0 && <p className="text-slate-600 text-xs font-medium italic">No media currently assigned.</p>}
          </div>
        </div>

        {/* Upload New Media */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Add New Media (+)</label>
          <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 border-dashed rounded-[2rem] hover:border-slate-400 transition-all bg-slate-50 group">
            <div className="space-y-4 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-400 group-hover:text-slate-600 transition-colors">upload_file</span>
              <div className="text-sm text-slate-500">
                <label className="relative cursor-pointer rounded-xl font-bold text-slate-700 hover:text-slate-900 transition-colors focus-within:outline-none">
                  <span>Select additional files</span>
                  <input type="file" multiple name="media" onChange={handleFileChange} className="sr-only" accept="image/*,video/mp4,video/quicktime" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/5">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                id="isActive" className="w-5 h-5 rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-slate-300 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Published to site</label>
           </div>
           <div className="flex gap-4">
              <button 
                type="button" onClick={() => navigate('/admin/products')}
                className="px-8 py-4 bg-slate-100 text-slate-700 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" disabled={submitting}
                className={`px-10 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all active:scale-[0.98] ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Syncing...' : 'Update Product'}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

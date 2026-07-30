import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../utils/api';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'invitation',
    description: '',
    adminNote: '',
    keywords: '',
    cardNumber: '',
    isActive: true,
  });
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleKeywordKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const rawValue = formData.keywords || '';
      const normalized = rawValue.replace(/\s*,\s*$/, '').trim();
      if (!normalized) return;
      setFormData((prev) => ({ ...prev, keywords: `${normalized}, ` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (files.length === 0) {
      setError('Please select at least one media file.');
      return;
    }

    const parsedKeywords = formData.keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    if (parsedKeywords.length < 2 || parsedKeywords.length > 10) {
      setError('Please add between 2 and 10 keywords separated by commas.');
      return;
    }

    setLoading(true);
    
    // Build multipart/form-data
    const submitData = new FormData();
    submitData.append('title', formData.title || '');
    submitData.append('category', formData.category);
    submitData.append('adminNote', formData.adminNote || '');

    let descriptionText = formData.description || '';
    if (formData.cardNumber) {
      descriptionText = `${descriptionText}${descriptionText ? '\n\n' : ''}Card Number: ${formData.cardNumber}`;
    }
    submitData.append('description', descriptionText);
    submitData.append('keywords', formData.keywords || '');

    for (let i = 0; i < files.length; i++) {
      submitData.append('media', files[i]);
    }

    try {
      await createProduct(submitData);
      setSuccess(true);
      setFormData({
        title: '',
        category: 'invitation',
        description: '',
        adminNote: '',
        keywords: '',
        cardNumber: '',
        isActive: true,
      });
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Error creating product. Validation failed or files were too large.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 display-serif">Create New Product</h1>
          <p className="text-slate-500 mt-1 font-medium">Add a new masterpiece to your premium collection.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-600 transition-colors"
        >
          Cancel & Return
        </button>
      </div>

      {error && <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium">{error}</div>}
      {success && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium">Product finalized and published. You can add another product or stay on this page.</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Title</label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 placeholder-slate-400 shadow-sm"
              placeholder="e.g. Royal Gilded Invitation"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
            <select 
              name="category" value={formData.category} onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 cursor-pointer shadow-sm appearance-none"
            >
              <option value="invitation">Wedding Invitation</option>
              <option value="envelope">Premium Envelope</option>
              <option value="box">Corporate Box</option>
              <option value="reel">Digital Reel</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Admin Notes</label>
            <textarea
              name="adminNote"
              value={formData.adminNote}
              onChange={handleChange}
              rows="4"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 placeholder-slate-400 shadow-sm resize-none"
              placeholder="Write internal notes for other admins. This will not show to customers."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Keywords</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              onKeyDown={handleKeywordKeyDown}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 placeholder-slate-400 shadow-sm"
              placeholder="e.g. floral, gold foil, luxury"
            />
            <p className="text-xs text-slate-500">Type a keyword and press <span className="font-semibold">Ctrl+Enter</span> to confirm it, then add the next one. Use 2–10 keywords separated by commas.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Code</label>
            <input 
               type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
               className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 placeholder-slate-400 shadow-sm"
               placeholder="SFC-1101"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
          <textarea 
            name="description" value={formData.description} onChange={handleChange} rows="5"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition-all duration-300 placeholder-slate-400 shadow-sm resize-none"
            placeholder="Describe the craftsmanship, paper quality, and artistic details..."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Media Assets *</label>
          <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-200 border-dashed rounded-[2rem] hover:border-amber-300 hover:bg-slate-50 transition-all duration-500 bg-slate-50 group">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-16 w-16 text-slate-400 group-hover:text-amber-600 group-hover:scale-110 transition-all duration-500">
                <span className="material-symbols-outlined text-5xl">cloud_upload</span>
              </div>
              <div className="flex flex-col text-sm text-slate-500">
                <label className="relative cursor-pointer rounded-xl font-bold text-amber-600 hover:text-amber-700 transition-colors focus-within:outline-none">
                  <span>Click to select media</span>
                  <input ref={fileInputRef} type="file" multiple name="media" onChange={handleFileChange} className="sr-only" accept="image/*,video/mp4,video/quicktime" />
                </label>
                <p className="mt-1">Drag and drop assets here</p>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">PNG, JPG, WEBP, MP4 (Max 50MB per file)</p>
            </div>
          </div>
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from(files).map((f, i) => (
                <div key={i} className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                  {f.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-200">
           <div className="flex items-center gap-3">
              <input 
                type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange}
                id="isActive" className="w-5 h-5 rounded-lg border border-slate-300 bg-white text-amber-600 focus:ring-amber-300 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-slate-600 uppercase tracking-widest cursor-pointer">Publish to site</label>
           </div>
           <div className="flex gap-4">
              <button 
                type="button" onClick={() => navigate('/admin/dashboard')}
                className="px-8 py-4 bg-slate-50 text-slate-700 font-bold uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-100 transition-all duration-300 border border-slate-200"
              >
                Cancel
              </button>
           </div>
          <button 
            type="submit" disabled={loading}
            className={`px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-lg hover:shadow-amber-300/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Assets...
              </div>
            ) : 'Publish Masterpiece'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

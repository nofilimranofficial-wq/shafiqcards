import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { formatDescription, isAuthenticated, getToken } from '../utils/api';

const ImageGallery = ({ images = [], alt = '' }) => {
  const cleanImages = Array.isArray(images) ? Array.from(new Set(images)) : [];
  const [mainIdx, setMainIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (cleanImages.length <= 1 || paused) return;
    const id = setInterval(() => {
      setMainIdx((prev) => (prev + 1) % cleanImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [cleanImages, paused]);

  useEffect(() => {
    setMainIdx(0);
  }, [images]);

  if (cleanImages.length === 0) {
    return (
      <div className="relative flex-1 rounded-3xl border border-dashed border-gray-300 bg-gray-50 aspect-[1/1] flex items-center justify-center text-sm text-gray-500">
        No preview available
      </div>
    );
  }

  const currentImage = cleanImages[mainIdx];

  const handleMouseMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    setCursorPosition({ x, y });
  };

  return (
    <div className="relative flex flex-col sm:flex-row gap-4">
      <div
        ref={containerRef}
        className="relative flex-1 overflow-visible rounded-3xl bg-slate-100 aspect-[1/1] max-h-[600px]"
        onMouseEnter={() => {
          setPreviewVisible(true);
          setPaused(true);
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setPreviewVisible(false);
          setPaused(false);
        }}
      >
        <img
          src={currentImage}
          alt={alt}
          className="w-full h-full object-cover bg-slate-100"
        />

        {cleanImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {mainIdx + 1} / {cleanImages.length}
          </div>
        )}

        <div
          className={`hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-460px] transition-all duration-300 ${
            previewVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-[420px] h-[420px] rounded-[2rem] overflow-hidden bg-white shadow-2xl ring-1 ring-slate-200">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundSize: '200%',
                backgroundPosition: `${cursorPosition.x * 100}% ${cursorPosition.y * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex sm:flex-col gap-3 w-full sm:w-20 overflow-x-auto sm:overflow-x-visible">
        {cleanImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setMainIdx(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
              mainIdx === i ? 'border-amber-600' : 'border-gray-300'
            }`}
          >
            <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover bg-slate-100" />
          </button>
        ))}
      </div>
    </div>
  );
};

const EnvelopesDetails = () => {
  const { type, index } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const [item, setItem] = useState(null);
  const [description, setDescription] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  const productType = type === 'boxes' ? 'boxes' : 'envelopes';
  const mappedCategory = productType === 'boxes' ? 'box' : 'envelope';
  const codePrefix = productType === 'boxes' ? 'SFC-Box-' : 'SFC-ENV-';
  const category = productType === 'boxes' ? 'Corporate Packaging' : 'Elegant Envelopes';
  const title = productType === 'boxes' ? 'Corporate Box' : 'Envelope';
  const backLink = productType === 'boxes' ? '/box-packaging' : '/envelopes';
  const backText = productType === 'boxes' ? 'Back to boxes collection' : 'Back to envelopes collection';
  const defaultDescription = productType === 'boxes'
    ? 'Premium corporate packaging solution perfect for branded gifting and presentations.'
    : 'Beautiful and elegant envelope design perfect for your special occasions.';
  const basePrice = 0;

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      try {
        let fetchedProduct = null;

        const authQuery = isAuthenticated() ? '?admin=true' : '';
        const authHeaders = isAuthenticated()
          ? { Authorization: `Bearer ${getToken()}` }
          : {};
        if (productId) {
          const res = await fetch(`${API_BASE_URL}/products/${productId}${authQuery}`, {
            headers: authHeaders,
          });
          if (res.ok) {
            const data = await res.json();
            fetchedProduct = data.data.product;
          }
        }

        if (!fetchedProduct) {
          const res = await fetch(`${API_BASE_URL}/products/category/${mappedCategory}${authQuery}`, {
            headers: authHeaders,
          });
          if (res.ok) {
            const data = await res.json();
            const products = data.data.products;
            const idxNum = Number(index) || 1;
            const p = products[idxNum - 1] || products[0];
            if (p) {
              fetchedProduct = p;
            }
          }
        }

        if (fetchedProduct) {
          const idxNum = Number(index) || 1;
          setItem({
            index: idxNum,
            paths: Array.isArray(fetchedProduct.mediaUrls) ? fetchedProduct.mediaUrls : [],
            position: idxNum,
            code: fetchedProduct.code,
            title: fetchedProduct.title || `${title} ${idxNum}`
          });
          setDescription(fetchedProduct.description || defaultDescription);
          setAdminNote(fetchedProduct.adminNote || '');
        }
      } catch (e) {
        console.error('Failed to load product details', e);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [index, productId, mappedCategory, defaultDescription]);


  if (!item) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          {loading ? (
            <p>Loading product details...</p>
          ) : (
            <p className="text-red-600">Product not found.</p>
          )}
        </div>
      </section>
    );
  }

  const code = item.code || `${codePrefix}${productType === 'boxes' ? 1101 + item.position : 2101 + item.position}`;
  const handleAddToCart = () => {
    const cartItem = {
      id: code,
      name: item.title || `${title} ${item.index}`,
      price: 0,
      quantity,
      image: item.paths[0],
      type: productType
    };
    setCart((current) => [...current, cartItem]);
    alert(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const val = Math.max(1, Math.min(999, Number(e.target.value) || 1));
    setQuantity(val);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <Link to={backLink} className="text-gray-600 hover:text-gray-700 underline mb-8 block text-sm font-semibold">
          &larr; {backText}
        </Link>

        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery images={item.paths} alt={`${title} ${item.index}`} />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <h1 className="display-serif text-3xl font-bold mb-2">{item.title || `${title} ${item.index}`}</h1>
              <p className="text-sm text-gray-500 mb-2">Product Code: {code}</p>
              <p className="inline-block bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit">
                {category}
              </p>

              

              {/* Description */}
              <p className="text-gray-700 mb-8 leading-relaxed">
                {formatDescription(description)}
              </p>

              {isAuthenticated() && adminNote && (
                <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">Admin Notes</h2>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{adminNote}</p>
                </div>
              )}

              {/* Social Sharing */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Follow Us:</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.facebook.com/shafiqcards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                    title="Visit Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/shafiqcards/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center transition-colors"
                    title="Visit Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11.806-2.806 1.44 1.44 0 01-.806 2.806z"/>
                    </svg>
                  </a>
                  {/* <a
                    href="mailto:shafiqcards1@gmail.com"
                    className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
                    title="Contact via Gmail"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a> */}
                </div>
              </div>

              {/* WhatsApp Contact CTA */}
              <a
                href={`https://wa.me/923492578726?text=Kindly give me the details of this ${code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-lg transition-colors duration-200"
              >
                <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  fill="currentColor"
  viewBox="0 0 24 24"
>
  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.89.5 3.72 1.46 5.32L2 22l4.92-1.57c1.55.85 3.3 1.3 5.12 1.3h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01c-1.63 0-3.23-.44-4.62-1.27l-.33-.2-2.92.93.95-2.85-.21-.35a7.88 7.88 0 01-1.21-4.19c0-4.35 3.54-7.88 7.89-7.88 2.1 0 4.07.82 5.55 2.31a7.8 7.8 0 012.31 5.55c0 4.35-3.54 7.88-7.89 7.88zm4.33-5.96c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.1-.1.24-.26.36-.39.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/>
</svg>
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnvelopesDetails;

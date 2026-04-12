import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { isAuthenticated, formatDescription } from '../utils/api';

// Pricing data for envelopes
const envelopePricing = {
  basePrice: 200,
  category: 'Elegant Envelopes'
};

const ImageGallery = ({ images = [], alt = '' }) => {
  const [mainIdx, setMainIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (paused) return;
    const id = setInterval(() => {
      setMainIdx((p) => (p + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images, paused]);

  useEffect(() => {
    setMainIdx(0);
  }, [images]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Main image display (top on small, left on larger) */}
      <div
        className="flex-1 relative bg-gray-100 rounded-2xl overflow-hidden h-96"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <img
          src={images[mainIdx]}
          alt={alt}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {mainIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-3 w-full sm:w-20 overflow-x-auto sm:overflow-x-visible">
        {images.length > 0 && images.map((img, i) => (
          <button
            key={i}
            onClick={() => setMainIdx(i)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              mainIdx === i ? 'border-amber-600' : 'border-gray-300'
            }`}
          >
            <img src={img} alt={`${alt} ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

const EnvelopesDetails = () => {
  const { index } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const [envelope, setEnvelope] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);


  useEffect(() => {
    const loadEnvelope = async () => {
      setLoading(true);
      try {
        if (productId) {
          const res = await fetch(`${API_BASE_URL}/products/${productId}`);
          if (res.ok) {
            const data = await res.json();
            const p = data.data.product;
            setEnvelope({
              index: Number(index) || 1,
              paths: p.mediaUrls,
              position: Number(index) || 1,
            });
            setDescription(p.description || 'Beautiful and elegant envelope design perfect for your special occasions.');
            return;
          }
        }

        // Fallback filter
        const res = await fetch(`${API_BASE_URL}/products/category/envelope`);
        if (res.ok) {
          const data = await res.json();
          const products = data.data.products;
          const idxNum = Number(index);
          const p = products[idxNum - 1] || products[0];
          if (p) {
            setEnvelope({
              index: idxNum,
              paths: p.mediaUrls,
              position: idxNum,
            });
            setDescription(p.description || 'Beautiful and elegant envelope design perfect for your special occasions.');
          }
        }
      } catch (e) {
        console.error('Failed to load envelope details', e);
      } finally {
        setLoading(false);
      }
    };
    loadEnvelope();
  }, [index, productId]);


  if (!envelope) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          {loading ? (
            <p>Loading envelope details...</p>
          ) : (
            <p className="text-red-600">Envelope not found.</p>
          )}
        </div>
      </section>
    );
  }

  const code = `SFC-ENV-${2101 + envelope.position}`;
  const price = envelopePricing.basePrice;
  const category = envelopePricing.category;
  const totalPrice = price * quantity;

  const handleAddToCart = () => {
    const item = {
      id: code,
      name: `Envelope No: ${envelope.index}`,
      price,
      quantity,
      image: envelope.paths[0],
      type: 'envelopes'
    };
    setCart([...cart, item]);
    alert(`Added ${quantity} envelope(s) to cart!`);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const val = Math.max(1, Math.min(999, Number(e.target.value) || 1));
    setQuantity(val);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <Link to="/envelopes" className="text-gray-600 hover:text-gray-700 underline mb-8 block text-sm font-semibold">
          &larr; Back to envelopes collection
        </Link>

        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Image Gallery */}
            <div>
              <ImageGallery images={envelope.paths} alt={`Envelope ${envelope.index}`} />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <h1 className="display-serif text-3xl font-bold mb-2">Envelope No: {envelope.index}</h1>
              <p className="text-sm text-gray-500 mb-2">Product Code: {code}</p>
              <p className="inline-block bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit">
                {category}
              </p>

              

              {/* Description */}
              <p className="text-gray-700 mb-8 leading-relaxed">
                {formatDescription(description)}
              </p>

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

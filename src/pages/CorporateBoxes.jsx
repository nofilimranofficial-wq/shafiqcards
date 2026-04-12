import { formatDescription } from '../utils/api';
import React, { useEffect, useRef, useState } from 'react';

import { useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import useGsap from '../hooks/useGsap';
import { fetchProductsByCategory } from '../config';

const CorporateBoxes = () => {
  useGsap();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadBoxes = async () => {
      setInitialLoad(true);
      try {
        const { products } = await fetchProductsByCategory('box');
        setBoxes(
          products.map((p, idx) => ({
            src: p.mediaUrls[0] || '',
            id: p._id,
            name: p.title || `Corporate Box ${idx + 1}`,
            description: formatDescription(p.description) || `Elegant packaging solution for corporate gifting and branding.`
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setInitialLoad(false);
      }
    };
    loadBoxes();
  }, []);
  
  // Filter valid boxes
  const filteredItems = boxes.map((box, idx) => ({ 
    ...box,
    originalIdx: idx,
    code: `SFC-Box-${1101 + idx}`
  })).filter((item) => {
    return item.code.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
  });
  
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = cardRefs.current.filter(Boolean);
    gsap.set(cards, { y: 50, opacity: 0, rotationY: -15 });
    const tl = gsap.to(cards, {
      y: 0,
      opacity: 1,
      rotationY: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'back.out(1.7)',
      paused: true
    });

    const st = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%'
      }
    });
    st.add(tl.play());
    setLoaded(true);

    return () => {
      try {
        st.kill();
        tl.kill();
      } catch (e) {}
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
          <div className="p-12 lg:p-16">
            <div className="text-center mb-16">
              <h2 className="display-serif text-5xl lg:text-6xl leading-tight tracking-tight text-slate-900 mb-6">
                Corporate Packaging Solutions
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Discover our premium collection of corporate boxes, perfect for gifting, branding, and professional packaging needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {initialLoad ? (
                <div className="col-span-full py-20 text-center text-slate-500">Loading box designs...</div>
              ) : filteredItems.slice(0, visibleCount).map(({ src, originalIdx, code, name, description, id }) => (
                <Link
                  key={originalIdx}
                  to={`/product/boxes/${originalIdx + 1}?id=${id}`}
                  className="group relative"
                >
                  <div
                    ref={(el) => (cardRefs.current[originalIdx] = el)}
                    className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-gray-300 transform hover:-translate-y-2"
                  >
                    <div className="overflow-hidden rounded-xl mb-4 bg-slate-100 relative">
                      {src ? (
                        <img
                          src={src}
                          alt={name}
                          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1">{code}</div>
                      <p className="text-sm text-slate-500 mb-4">{description}</p>
                      <button className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {visibleCount < filteredItems.length && (
              <div className="text-center mt-16">
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setVisibleCount(prev => Math.min(prev + 15, filteredItems.length));
                      setIsLoading(false);
                    }, 1200);
                  }}
                  disabled={isLoading}
                  className="px-10 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:from-slate-700 hover:to-slate-800 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <span className="animate-spin text-xl">⟳</span>
                      Loading Designs...
                    </span>
                  ) : (
                    'Explore More Boxes'
                  )}
                </button>
              </div>
            )}

            <div className="text-center mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Custom Corporate Packaging</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Need bespoke boxes tailored to your brand? Our design team creates custom packaging solutions for your corporate needs.
              </p>
              <a
                href="https://wa.me/1234567890?text=Hello, I'm interested in custom corporate boxes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Request Custom Design
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateBoxes;

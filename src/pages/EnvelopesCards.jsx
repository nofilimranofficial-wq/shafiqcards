import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import useGsap from '../hooks/useGsap';
import { fetchProductsByCategory } from '../config';

// Small carousel component that auto-rotates through `images`.
const CardCarousel = ({ images = [], alt = '', interval = 2500, onHoverAdvance }) => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (paused) return;

    const id = setInterval(() => {
      setIdx((p) => (p + 1) % images.length);
    }, interval);

    return () => clearInterval(id);
  }, [images, interval, paused]);

  useEffect(() => {
    setIdx(0);
  }, [images]);

  return (
    <img
      src={images[idx]}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      loading="lazy"
      onMouseEnter={() => {
        if (onHoverAdvance) onHoverAdvance();
        if (images && images.length > 1) setIdx((p) => (p + 1) % images.length);
        setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
    />
  );
};

const EnvelopesCards = () => {
  useGsap();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  // images: { index, paths, variantsLoaded }
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // load precomputed groups from JSON file
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const { products } = await fetchProductsByCategory('envelope');

        setImages(
          products.map((p, idx) => {
            return {
              index: idx + 1,
              id: p._id,
              paths: p.mediaUrls.slice(0, 3)
            };
          })
        );
      } catch (e) {
        console.error('Failed to load envelopes list', e);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);
  
  // images now is an array of groups: { index, paths: [...] }
  const filteredItems = images.map((group, idx) => ({
    index: group.index,
    id: group.id,
    srcs: group.paths,
    src: group.paths[0] || '',
    code: `SFC-${2101 + idx}`,
    name: `Envelope ${idx + 1}`,
    description: ''
  })).filter((item) => {
    let s = search.toLowerCase().trim();
    if (!s) return true; // no search => keep all

    // normalize some common word forms
    if (s.includes('elegance')) {
      s = s.replace('elegance', 'elegant');
    }

    // break search into terms and ignore common stopwords
    const stop = new Set(['i','want','a','an','the','like','looking','please','for','with','and']);
    const terms = s.split(/\s+/).filter((t) => t && !stop.has(t));
    if (terms.length) {
      const hay = (
        item.code + ' ' + item.name + ' ' + item.description
      ).toLowerCase();
      // if any term is found, keep the item
      const anyMatch = terms.some((t) => hay.includes(t));
      if (anyMatch) return true;
    }

    // if search contains a number, check index
    const m = s.match(/\d+/);
    if (m) {
      const num = parseInt(m[0], 10);
      if (num === item.index || num === idx + 1) {
        return true;
      }
    }
    return false;
  });
  
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    // animate each card separately when it scrolls into view
    const cards = cardRefs.current.filter(Boolean);
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [loading, filteredItems.length, visibleCount]);

  if (loading) {
    return (
      <section className="py-12 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white slider-card rounded-2xl overflow-hidden">
            <div className="p-10 lg:p-14">
              <div className="text-center mb-12">
                <h2 className="display-serif text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900 mb-4">
                  Our Elegant Envelope Collection
                </h2>
              </div>
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">⟳</div>
                  <p className="text-slate-600">Loading available designs...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6" ref={containerRef}>
        <div className="bg-white slider-card rounded-2xl overflow-hidden">
          <div className="p-10 lg:p-14">
            <div className="text-center mb-12">
              <h2 className="display-serif text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900 mb-4">
                Our Elegant Envelope Collection
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover our premium envelope designs, perfect for complementing your wedding invitations with style and sophistication.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {filteredItems.slice(0, visibleCount).map(({ srcs, code, name, id, index }, idx) => (
                <div
                  key={idx}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="flex flex-col items-center gap-3"
                >
                  <Link to={`/envelope/${index}?id=${id}`} className="block w-full">
                    <div className="overflow-hidden rounded-2xl w-full aspect-[4/3] bg-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                      <CardCarousel images={srcs} alt={name} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pb-4">
                        <a
                          href={`https://wa.me/923492578726?text=Kindly give me the details of this ${code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-200 flex items-center gap-2"
                        >
                          Order via WhatsApp
                        </a>
                      </div>
                    </div>
                  </Link>
                  <div className="text-center">
                    <div className="text-xs text-slate-400">{code}</div>
                    <div className="text-sm font-semibold text-slate-700">{name}</div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < filteredItems.length && (
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setVisibleCount(prev => Math.min(prev + 20, filteredItems.length));
                      setIsLoading(false);
                    }, 1000);
                  }}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gray-500 text-white rounded-none font-bold animate-pulse shadow-lg hover:shadow-xl hover:bg-gray-400 hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⟳</span>
                      Loading...
                    </span>
                  ) : (
                    'Show More Envelopes'
                  )}
                </button>
              </div>
            )}

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-4">Need custom envelopes? Contact us for personalized designs.</p>
              <a
                href="https://wa.me/+923492578726?text=Hello, I'm interested in custom envelope designs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-colors shadow-lg hover:shadow-xl"
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

export default EnvelopesCards;

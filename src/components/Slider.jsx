import React, { useState, useEffect, useRef } from 'react';
import { fetchProductsByCategory } from '../config';

const Slider = () => {
  const [slides, setSlides] = useState([]); // Will hold duplicated images for scrollable content
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchSlides = async () => {
      const { products } = await fetchProductsByCategory('invitation', 1, 3);
      if (products && products.length > 0) {
        const fetchUrls = products.map(p => p.mediaUrls[0] || '').filter(url => url !== '');
        if (fetchUrls.length > 0) {
          // duplicate for more scrollable content just like before
          setSlides([...fetchUrls, ...fetchUrls]);
        }
      }
    };
    fetchSlides();
  }, []);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((i) => (i + 1) % slides.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [isMobile, slides.length]);


  const scrollToSlide = (index) => {
    if (scrollRef.current) {
      const cardWidth = 200; // Approximate width per card
      scrollRef.current.scrollLeft = index * cardWidth;
      setCurrentIndex(index);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-100">
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white slider-card rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 sm:p-8 md:p-10 lg:p-14">
            {/* Mobile: Title at top */}
            <div className="text-center mb-6 md:hidden">
              <h2 className="display-serif text-3xl sm:text-4xl leading-tight tracking-tight text-slate-900">SHAFIQ CARDS</h2>
              <div className="mt-2 text-sm text-slate-500">You are invited</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 md:gap-8 items-start">
              {/* Desktop: Left big vertical title */}
              <div className="hidden lg:flex flex-col justify-center text-left">
                <h2 className="display-serif text-4xl lg:text-6xl xl:text-7xl leading-tight tracking-tight text-slate-900">SHAFIQ<br/>CARDS</h2>
                <div className="mt-6 lg:mt-8 text-sm text-slate-500">You are invited</div>
              </div>

              <div className="space-y-6">
                {/* Center: three image cards */}
                <div className="w-full flex justify-center">
                  <div ref={scrollRef} className={`flex flex-row items-center gap-4 sm:gap-6 lg:gap-8 ${isMobile ? 'overflow-x-auto hide-scrollbar px-2 sm:px-0' : 'justify-center'}`}>
                    {(isMobile ? slides : slides.slice(0, 3)).map((src, i) => (
                      <div key={i} className={`flex flex-col items-center gap-2 sm:gap-3 flex-shrink-0 ${i === currentIndex ? 'scale-100' : 'scale-95 opacity-70'} transition-all duration-300`}>
                        <div className="overflow-hidden rounded-[20px] sm:rounded-[20px] md:rounded-[20px] min-w-[220px] sm:min-w-[200px] lg:min-w-[240px] h-64 sm:h-56 md:h-64 lg:h-80 bg-slate-200 hover:bg-slate-100 shadow-md transition-colors duration-300">
                          <img src={src} alt={`Slide ${i+1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-400">0{i+1}.</div>
                          <div className="text-sm font-semibold text-slate-700">Premium Invitation</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blog style why-us section below images */}
                <div className="w-full">
                  <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-600 font-semibold mb-4">Why Us</p>
                      <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">Our Specialty & Commitment</h3>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        Shafiq Cards delivers premium wedding stationery with thoughtful design, fast delivery and a strong brand presence. Every order is made to shine and represent your special occasion.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl bg-white border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">Best Quality</p>
                        <p className="text-sm text-slate-600 mt-2">Luxury paper, rich printing and precise finishing for every invitation.</p>
                      </div>
                      <div className="rounded-3xl bg-white border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">On-Time Delivery</p>
                        <p className="text-sm text-slate-600 mt-2">Reliable production and shipping so your invitations arrive when promised.</p>
                      </div>
                      <div className="rounded-3xl bg-white border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900">Brand Image</p>
                        <p className="text-sm text-slate-600 mt-2">A distinctive look and professional finish that elevates every event.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;

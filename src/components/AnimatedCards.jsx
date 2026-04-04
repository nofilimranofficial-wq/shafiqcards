import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import useGsap from '../hooks/useGsap';
import { fetchProductsByCategory } from '../config';

const AnimatedCards = ({ limit = 20, buttonText = "View All Designs", buttonLink = "#" }) => {
  useGsap();
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const { products } = await fetchProductsByCategory('invitation', 1, limit);
      setProducts(products);
      setImages(products.map(p => p.mediaUrls[0] || ''));
    };
    fetchImages();
  }, [limit]);


  // Initialize animations only after images load
  useEffect(() => {
    if (!containerRef.current || images.length === 0) return;
    const cards = cardRefs.current.filter(Boolean);
    gsap.set(cards, { y: 30, opacity: 0, scale: 0.98 });
    const tl = gsap.to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.06,
      duration: 0.7,
      ease: 'power3.out',
      paused: true
    });

    const st = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%'
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
  }, [images]);

  return (
    <section className="py-12 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6" ref={containerRef}>
        <div className="bg-white slider-card rounded-2xl overflow-hidden">
          <div className="p-10 lg:p-14">
            <div className="text-center mb-12">
              <h2 className="display-serif text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900 mb-4">
                Wedding Invitation Collection
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover our exquisite range of wedding invitations, crafted with elegance and attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {images.length > 0 ? images.map((src, idx) => (
                <Link
                  key={idx}
                  to={`/product/invitations/${idx + 1}?id=${products[idx]?._id}`}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div className="overflow-hidden rounded-2xl w-full aspect-[3/4] bg-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <img src={src} alt={products[idx]?.title || `Design ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{products[idx]?.title || `Invitations Design ${idx + 1}`}</div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center text-slate-500">Loading Latest Cards...</div>
              )}
            </div>


            <div className="text-center mt-12">
              <Link to={buttonLink} className="inline-block px-8 py-3 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl">
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedCards;

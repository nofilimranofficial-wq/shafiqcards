import React, { useEffect, useState } from 'react';
import { fetchProductsByCategory } from '../config';

const initialCategories = [
  { title: 'Latest Collection', tag: 'Latest Collection', size: 'large', type: 'invitation' },
  { title: 'Ready Made', tag: 'Ready Made', size: 'small', type: 'invitation' },
  { title: 'Stationery', tag: 'Stationery', size: 'small', type: 'invitation' },
  { title: 'Packaging', tag: 'Packaging', size: 'large', type: 'box' },
  { title: 'Digital Invites', tag: 'Digital Invites', size: 'large', type: 'reel' },
  { title: 'Gifts', tag: 'Gifts', size: 'small', type: 'box' },
  { title: 'Corporate Boxes', tag: 'Corporate Boxes', size: 'large', type: 'box' },
  { title: 'Envelopes', tag: 'Envelopes', size: 'small', type: 'envelope' }
];

const CategoryCards = () => {
  const [categories, setCategories] = useState(initialCategories.map(c => ({...c, img: null})));

  useEffect(() => {
    const fetchCovers = async () => {
      const invRes = await fetchProductsByCategory('invitation', 1, 3);
      const boxRes = await fetchProductsByCategory('box', 1, 3);
      const envRes = await fetchProductsByCategory('envelope', 1, 1);
      const reelRes = await fetchProductsByCategory('reel', 1, 1);
      
      const invImgs = invRes.products?.map(p => p.mediaUrls[0]) || [];
      const boxImgs = boxRes.products?.map(p => p.mediaUrls[0]) || [];
      const envImgs = envRes.products?.map(p => p.mediaUrls[0]) || [];
      const reelImgs = reelRes.products?.map(p => p.mediaUrls[0]) || [];

      // Fallback placeholder grey box if no media yet
      const fallback = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

      setCategories([
        { ...initialCategories[0], img: invImgs[0] || fallback },
        { ...initialCategories[1], img: invImgs[1] || fallback },
        { ...initialCategories[2], img: invImgs[2] || fallback },
        { ...initialCategories[3], img: boxImgs[0] || fallback },
        { ...initialCategories[4], img: reelImgs[0] || null }, // Reel might not be an image
        { ...initialCategories[5], img: boxImgs[1] || fallback },
        { ...initialCategories[6], img: boxImgs[2] || fallback },
        { ...initialCategories[7], img: envImgs[0] || fallback }
      ]);
    };
    fetchCovers();
  }, []);

  return (
    <section className="py-12 bg-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white slider-card rounded-2xl overflow-hidden">
          <div className="p-10 lg:p-14">
            <div className="text-center mb-12">
              <h2 className="display-serif text-4xl lg:text-5xl leading-tight tracking-tight text-slate-900 mb-4">
                Our Services
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover our comprehensive range of printing and packaging solutions for every occasion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[240px]">
              {categories.map((category, index) => {
                const isLarge = category.size === 'large';
                const spanClass = isLarge ? 'lg:col-span-2' : 'col-span-1';
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${spanClass}`}
                  >
                    {category.type === 'reel' && category.img ? (
                      <video
                        src={category.img}
                        className="w-full h-full object-cover block rounded-2xl transition-transform duration-700 group-hover:scale-105"
                        muted
                        playsInline
                        preload="metadata"
                        autoPlay
                        loop
                      />
                    ) : (
                      <img
                        src={category.img || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='}
                        alt={category.title}
                        loading="lazy"
                        className="w-full h-full object-cover block rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/30 transition-colors duration-300"></div>

                    <div className="absolute left-4 right-4 bottom-4">
                      <div className="backdrop-blur-sm bg-gray-800/70 text-white rounded-full px-3 py-1 text-sm font-semibold max-w-max mx-auto">
                        {category.tag}
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 text-white text-sm font-semibold opacity-90">
                      {/* small corner label if needed */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;

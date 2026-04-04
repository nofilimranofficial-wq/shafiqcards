import { formatDescription } from '../utils/api';
import React, { useRef, useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { fetchProductsByCategory } from '../config';


const DigitalInvitation = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [visibleReels, setVisibleReels] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [reels, setReels] = useState([]);
  
  useEffect(() => {
    const loadReels = async () => {
      setIsLoading(true);
      try {
        const { products } = await fetchProductsByCategory('reel');
        setReels(
          products.map((p, idx) => ({
            reel: p.mediaUrls[0] || '',
            id: p._id,
            name: p.title || `Reel ${idx + 1}`
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadReels();
  }, []);

  const filteredReels = reels.map((r, index) => ({ 
    ...r,
    originalIdx: index,
    code: `SFC-Reel-${1101 + index}`,
  })).filter((item) => {
    return item.code.toLowerCase().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase());
  });
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Digital Invitations</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience our stunning digital invitation reels. Fast, clean, and captivating designs for your special moments.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-slate-500">Loading reels...</div>
          ) : filteredReels.slice(0, visibleReels).map(({ reel, originalIdx, code, name }) => (
            <div
              key={originalIdx}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {reel ? (
                <video
                  src={reel}
                  className="w-full h-96 object-cover"
                  muted
                  playsInline
                  preload="metadata"
                  controls
                />
              ) : (
                <div className="w-full h-96 bg-slate-200 flex items-center justify-center text-slate-400">No Video</div>
              )}
              <div className="p-4">
                <div className="text-xs text-slate-400 mb-1">{code}</div>

                <p className="text-sm text-slate-600 mb-3">Beautiful digital invitation design</p>
                <a
                  href={`https://wa.me/923492578726?text=Kindly give me the details of this ${code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-sm transition-colors duration-200"
                >
                  Order via WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {visibleReels < filteredReels.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleReels(prev => Math.min(prev + 8, filteredReels.length))}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalInvitation;

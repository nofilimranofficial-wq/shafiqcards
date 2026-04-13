import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { formatDescription } from '../utils/api';

const ReelDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReel = async () => {
      setLoading(true);
      setError('');

      if (!id) {
        setError('Reel ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) {
          throw new Error('Unable to load reel details.');
        }

        const data = await res.json();
        setProduct(data.data.product || null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load reel details.');
      } finally {
        setLoading(false);
      }
    };

    loadReel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <p className="text-slate-600 text-lg">Loading reel details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Reel not found.'}</p>
          <Link
            to="/digital-invites"
            className="inline-block px-5 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 transition"
          >
            Back to Digital Invitations
          </Link>
        </div>
      </div>
    );
  }

  const title = product.title || 'Digital Invitation Reel';
  const description = formatDescription(product.description || 'A beautiful digital reel invitation.');
  const primaryMedia = Array.isArray(product.mediaUrls) && product.mediaUrls.length > 0 ? product.mediaUrls[0] : null;
  const isVideo = primaryMedia && typeof primaryMedia === 'string' && primaryMedia.match(/\.(mp4|mov|webm|ogg)$/i);
  const productCode = product.code || `SFC-Reel-${product.position || '000'}`;
  const price = product.price ? product.price : 'Contact us for pricing';
  const category = product.category || 'Reel Invitations';

  return (
    <section className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/digital-invites" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 text-sm font-medium">
          &larr; Back to Digital Invitations
        </Link>

        <div className="bg-white p-10 rounded-3xl shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="rounded-[2rem] overflow-hidden bg-slate-900 shadow-lg h-[660px] w-[300px] lg:w-full">
                {primaryMedia ? (
                  isVideo ? (
                    <video
                      src={primaryMedia}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      playsInline
                      autoPlay={false}
                    />
                  ) : (
                    <img
                      src={primaryMedia}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                    No reel preview available
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="display-serif text-3xl font-bold mb-2">{title}</h1>
              <p className="text-sm text-gray-500 mb-2">Product Code: {productCode}</p>
              <p className="inline-block bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold mb-6 w-fit">
                {category}
              </p>

              <div className="space-y-4 mb-8">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {formatDescription(description)}
                </div>

                <div className="grid gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-900">Price:</span>{' '}
                    {typeof price === 'number' ? `PKR ${price}` : price}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Media count:</span>{' '}
                    {Array.isArray(product.mediaUrls) ? product.mediaUrls.length : 0}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Visibility:</span>{' '}
                    {product.status || 'Published'}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/923492578726?text=Kindly give me the details of this ${productCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-lg transition-colors duration-200"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReelDetails;

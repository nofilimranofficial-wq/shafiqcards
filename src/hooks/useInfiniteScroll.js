import { useEffect, useRef } from 'react';

const useInfiniteScroll = ({ enabled, onLoadMore, hasMore, isLoading, rootMargin = '300px', threshold = 0.1 }) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!enabled || !hasMore || isLoading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, hasMore, isLoading, onLoadMore, rootMargin, threshold]);

  return sentinelRef;
};

export default useInfiniteScroll;

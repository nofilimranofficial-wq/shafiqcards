import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function useGsap() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => {
      try {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      } catch (e) {
        // ignore
      }
    };
  }, []);
}

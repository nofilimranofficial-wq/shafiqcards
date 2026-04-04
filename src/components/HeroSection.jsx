import React, { useRef, useEffect } from 'react';
import Button from './Button';
import { gsap } from 'gsap';
import useGsap from '../hooks/useGsap';

const HeroSection = () => {
  useGsap();
  const heroRef = useRef(null);
  const stackRef = useRef(null);

  useEffect(() => {
    const cards = stackRef.current?.querySelectorAll('.inv-card');
    if (!cards || cards.length === 0) return;
    gsap.set(cards, { opacity: 0, y: 30, rotateX: 6 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top 80%'
      }
    });
  }, []);

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-br from-white via-rose-50 to-amber-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-6/12 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-rose-800 leading-tight mb-6">
              Elegant Wedding Invitations
              <br /> Crafted With Love
            </h1>
            <p className="text-lg text-rose-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Premium stationery and bespoke printing for unforgettable celebrations. Hand-finished details, luxurious papers, and modern calligraphy styles.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <Button variant="primary">Explore Services</Button>
              <Button variant="outline">View Gallery</Button>
            </div>
          </div>

          <div className="lg:w-6/12 flex justify-center lg:justify-end">
            <div className="hero-wrap" ref={(el) => (heroRef.current = el)}>
              <div className="card-stack" ref={(el) => (stackRef.current = el)}>
                <div className="inv-card inv-card-1">
                  <div className="inv-decor">Shafiq Cards</div>
                </div>
                <div className="inv-card inv-card-2">
                  <div className="inv-decor">Wedding Invite</div>
                </div>
                <div className="inv-card inv-card-3">
                  <div className="inv-decor">RSVP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchProductsByCategory } from '../config';

const pages = {
  '/weddingcards-in-pakistan': {
    title: 'Wedding Cards in Pakistan',
    description: 'Discover luxury wedding cards in Pakistan, tailored for modern couples seeking exquisite craftsmanship, premium materials, and unforgettable wedding stationery that makes every celebration shine.',
    heroCategory: 'invitation',
    layout: 'split',
    accent: 'amber',
    sections: [
      {
        heading: 'Premium Wedding Cards for Pakistani Celebrations',
        content: 'Shafiq Cards offers premium wedding cards in Pakistan with elegant embossing, foil finishes, and bespoke designs that reflect your personal love story. Our invitation cards are crafted to impress guests while remaining affordable for every budget.'
      },
      {
        heading: 'Custom Designs and Fast Delivery',
        content: 'Choose from bridal invitations, groom invitation cards, save-the-date cards, and complete wedding stationery sets. We deliver across Pakistan with fast turnaround and dedicated support for every stage of the ordering process.'
      }
    ]
  },
  '/weddingcards-in-uae': {
    title: 'Wedding Cards in UAE',
    description: 'Find stunning wedding cards in the UAE from Shafiq Cards. Our UAE wedding invitations combine luxury printing, handmade details, and on-trend stationery aesthetics for the region’s most elegant celebrations.',
    heroCategory: 'box',
    layout: 'overlay',
    accent: 'sky',
    sections: [
      {
        heading: 'Luxury Wedding Cards for the UAE',
        content: 'Our wedding cards for UAE couples feature premium textures, Arabic calligraphy-ready layouts, and beautiful packaging that suits royal weddings, destination celebrations, and intimate gatherings alike.'
      },
      {
        heading: 'Global Shipping and Local Service',
        content: 'Shafiq Cards serves customers across the UAE and internationally, offering seamless ordering, global shipping, and Arabic-English design support for every wedding stationery need.'
      }
    ]
  },
  '/beautiful-weddingcards': {
    title: 'Beautiful Wedding Cards',
    description: 'Explore beautiful wedding cards designed to capture romance, elegance, and modern luxury. Each invitation from Shafiq Cards is crafted to elevate your celebration and leave a lasting impression.',
    heroCategory: 'invitation',
    layout: 'stacked',
    accent: 'rose',
    sections: [
      {
        heading: 'Timeless Wedding Card Designs',
        content: 'From floral and minimalist to gold foil and lacquered edge invitations, our beautiful wedding cards are handmade with care and designed to match your wedding theme perfectly.'
      },
      {
        heading: 'Personalized Stationery for Every Couple',
        content: 'Create an unforgettable first impression with custom wedding invitations, RSVP cards, thank you notes, and invitation suites that reflect your unique love story.'
      }
    ]
  },
  '/wedding-invitations': {
    title: 'Wedding Invitations',
    description: 'Your wedding invitations set the tone for the biggest day. Shafiq Cards creates premium wedding invitations with luxurious finishes, tasteful styling, and seamless customization.',
    heroCategory: 'invitation',
    layout: 'grid',
    accent: 'emerald',
    sections: [
      {
        heading: 'Stylish and Sophisticated Wedding Invitations',
        content: 'Choose from elegant invitation templates and custom design services that include foil stamping, laser-cut patterns, vellum wraps, and hand-painted details.'
      },
      {
        heading: 'Complete Invitation Sets and Add-Ons',
        content: 'Our wedding invitation sets include envelopes, RSVP cards, detail cards, and gift tags, making it easy to present a polished stationery suite for your wedding celebration.'
      }
    ]
  },
  '/weddingstationery': {
    title: 'Wedding Stationery',
    description: 'Shafiq Cards offers full wedding stationery solutions including invitations, menus, place cards, save-the-date cards, and thank you notes to make your wedding cohesive and memorable.',
    heroCategory: 'envelope',
    layout: 'feature',
    accent: 'indigo',
    sections: [
      {
        heading: 'Complete Wedding Stationery Collections',
        content: 'From engagement announcements to wedding day signage and thank you cards, our stationery is designed to coordinate beautifully and enhance every moment of your celebration.'
      },
      {
        heading: 'Custom Wedding Stationery Services',
        content: 'Work with our design team to create bespoke stationery that fits your wedding colors, fonts, and brand style, with expert advice on material selection and finishing touches.'
      }
    ]
  }
};

const SeoBlogPage = () => {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages['/wedding-invitations'];
  const [blogImages, setBlogImages] = useState({ box: '', invitation: '', envelope: '' });

  const heroImage = blogImages[page.heroCategory] || '';
  const accentClasses = {
    amber: 'text-amber-600 bg-amber-50',
    sky: 'text-sky-600 bg-sky-50',
    rose: 'text-rose-600 bg-rose-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };
  const pageAccent = accentClasses[page.accent] || accentClasses.amber;

  useEffect(() => {
    const loadImages = async () => {
      const [boxData, invitationData, envelopeData] = await Promise.all([
        fetchProductsByCategory('box', 1, 1),
        fetchProductsByCategory('invitation', 1, 1),
        fetchProductsByCategory('envelope', 1, 1)
      ]);

      setBlogImages({
        box: boxData.products?.[0]?.mediaUrls?.[0] || '',
        invitation: invitationData.products?.[0]?.mediaUrls?.[0] || '',
        envelope: envelopeData.products?.[0]?.mediaUrls?.[0] || ''
      });
    };

    loadImages();
  }, []);

  const categoryCards = [
    {
      label: 'Box Packaging',
      image: blogImages.box,
      description: 'Latest premium packaging designs from our collection.'
    },
    {
      label: 'Wedding Invitations',
      image: blogImages.invitation,
      description: 'Newest wedding invitation styles from Shafiq Cards.'
    },
    {
      label: 'Envelopes',
      image: blogImages.envelope,
      description: 'Fresh envelope designs to complete your stationery suite.'
    }
  ];

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-10 items-start mb-14">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">{page.description}</p>
          </div>

          {page.layout === 'overlay' ? (
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
              <img src={heroImage || '/sliderimages/weddingcardsinvitation.jpg'} alt={page.title} className="w-full h-96 object-cover" />
              <div className="absolute inset-0 bg-slate-950/40" />
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <div className="max-w-2xl text-center">
                  <p className={`inline-block ${pageAccent} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]`}>Luxury Edition</p>
                  <h2 className="mt-6 text-4xl sm:text-5xl font-bold text-white">Styled for Elegant UAE Celebrations</h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-200">This page highlights refined wedding cards with premium finishes and global styling tailored for the UAE market.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] items-center">
              <div className="rounded-[2rem] overflow-hidden shadow-xl">
                <img src={heroImage || '/sliderimages/weddingcardsinvitation.jpg'} alt={page.title} className="w-full h-96 object-cover" />
              </div>
              <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                <p className={`inline-block ${pageAccent} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]`}>Featured Category</p>
                <h2 className="mt-6 text-3xl font-bold text-slate-900">Latest Designs from Shafiq Cards</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">Discover fresh product imagery and curated examples of our most recent work, sourced directly from the live Shafiq Cards database.</p>
              </div>
            </div>
          )}
        </div>

        <div className={`grid gap-6 ${page.layout === 'feature' ? 'lg:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
          {categoryCards.map((card) => (
            <div key={card.label} className={`group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${page.layout === 'stacked' ? 'lg:col-span-1' : ''}`}>
              <div className="h-64 overflow-hidden bg-slate-100">
                <img
                  src={card.image || '/sliderimages/weddingcardsinvitation.jpg'}
                  alt={card.label}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className={`text-xs uppercase tracking-[0.35em] font-semibold mb-3 ${pageAccent}`}>{card.label}</p>
                <p className="text-slate-700 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {page.sections.map((section) => (
            <div key={section.heading} className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 sm:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-600 font-semibold mb-4">Blog Feature</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">{section.heading}</h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoBlogPage;

import React from 'react';
import { useLocation } from 'react-router-dom';

const pages = {
  '/weddingcards-in-pakistan': {
    title: 'Wedding Cards in Pakistan',
    description: 'Discover luxury wedding cards in Pakistan, tailored for modern couples seeking exquisite craftsmanship, premium materials, and unforgettable wedding stationery that makes every celebration shine.',
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

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-600 font-semibold mb-4">Shafiq Cards SEO Blog</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{page.title}</h1>
          <p className="mt-5 text-lg text-slate-600">{page.description}</p>
        </div>

        <div className="space-y-10">
          {page.sections.map((section) => (
            <div key={section.heading} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">{section.heading}</h2>
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeoBlogPage;

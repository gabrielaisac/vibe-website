'use client';

/**
 * ☕ MENU SECTION - Meniu cu tab-uri pe categorii
 *
 * Tab-uri: Espresso, Specialty, Cold Brew, Patiserie
 * Grid: 3 coloane desktop, 1 coloană mobile
 * Imagini Unsplash 4:3, hover scale + shadow, fade-in la tab switch.
 */

import { useState } from 'react';

const menu = {
  Espresso: [
    { name: 'Espresso', price: 12, description: 'Shot dublu de espresso intens', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop' },
    { name: 'Americano', price: 14, description: 'Espresso diluat cu apă caldă', image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400&auto=format&fit=crop' },
    { name: 'Cappuccino', price: 16, description: 'Espresso cu lapte spumat', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop' },
    { name: 'Flat White', price: 17, description: 'Microfoam mătăsos peste espresso', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop' },
    { name: 'Latte', price: 17, description: 'Espresso cu lapte abundent', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
  ],
  Specialty: [
    { name: 'Pour Over', price: 22, description: 'Extracție lentă, aromă complexă', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop' },
    { name: 'Chemex', price: 24, description: 'Filtrare elegantă, gust curat și luminos', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&auto=format&fit=crop' },
    { name: 'AeroPress', price: 20, description: 'Presiune controlată, corp plin', image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&auto=format&fit=crop' },
    { name: 'Cold Drip', price: 26, description: 'Picurare lentă la rece, 12 ore', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop' },
    { name: 'Syphon', price: 28, description: 'Preparare teatrală prin sifonare', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop' },
    { name: 'Batch Brew', price: 18, description: 'Filtru de specialitate la cană', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&auto=format&fit=crop' },
  ],
  'Cold Brew': [
    { name: 'Cold Brew Classic', price: 18, description: 'Infuzat 24 de ore la rece', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop' },
    { name: 'Cold Brew Tonic', price: 22, description: 'Cold brew cu apă tonică și citrice', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&auto=format&fit=crop' },
    { name: 'Iced Latte', price: 19, description: 'Espresso cu lapte rece și gheață', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&auto=format&fit=crop' },
    { name: 'Iced Matcha Latte', price: 21, description: 'Matcha premium cu lapte rece', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop' },
    { name: 'Cold Brew Float', price: 24, description: 'Cold brew cu o bilă de înghețată vanilla', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop' },
  ],
  Patiserie: [
    { name: 'Croissant cu unt', price: 12, description: 'Foietaj franțuzesc, crocant și fraged', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop' },
{ name: 'Cheesecake', price: 18, description: 'Cremă fină de brânză pe bază de biscuiți', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&auto=format&fit=crop' },
    { name: 'Tiramisu', price: 20, description: 'Rețetă italiană originală cu espresso', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop' },
    { name: 'Brownie', price: 15, description: 'Ciocolată intensă, textură fudgy', image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=400&auto=format&fit=crop' },
    { name: 'Muffin Afine', price: 12, description: 'Pufos, cu afine proaspete din sezon', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop' },
  ],
};

type Category = keyof typeof menu;
const categories = Object.keys(menu) as Category[];

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState<Category>('Espresso');

  return (
    <section id="meniu" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* TITLU */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meniul Nostru
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Preparate cu pasiune, servite cu grijă
          </p>
        </div>

        {/* TAB-URI CATEGORII */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-amber-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID PRODUSE — key={activeTab} declanșează re-mount + animație la fiecare schimbare */}
        <div
          key={activeTab}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 menu-grid-enter"
        >
          {menu[activeTab].map((item, index) => (
            <div
              key={item.name}
              className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100
                         transition-all duration-300
                         hover:scale-[1.02] hover:shadow-xl hover:border-amber-200
                         menu-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* IMAGINE 4:3 */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* TEXT */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{item.name}</h3>
                  <span className="font-bold text-amber-600 text-base whitespace-nowrap ml-3">
                    {item.price} RON
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GiftGenerator from './components/GiftGenerator';
import Santafy from './components/Santafy';
import CommunityWall from './components/CommunityWall';
import Footer from './components/Footer';
import { GalleryItem } from './types';

const App: React.FC = () => {
  // Shared state for the gallery
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const addToGallery = (item: GalleryItem) => {
    setGalleryItems(prev => [item, ...prev]);
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Generate subtle falling snow
  const snowflakes = useMemo(() => {
    return Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 10}s`, // Slower, more elegant fall
      animationDelay: `-${Math.random() * 20}s`,
      opacity: Math.random() * 0.6 + 0.2,
      size: `${Math.random() * 4 + 3}px`
    }));
  }, []);

  return (
    <div className="min-h-screen font-sans text-white relative">
      
      {/* Background Pattern */}
      <div className="bg-pattern"></div>

      {/* Elegant Snow */}
      <div className="snow-container">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              left: flake.left,
              top: '-10px',
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animation: `fall ${flake.animationDuration} linear infinite`,
              animationDelay: flake.animationDelay,
            }}
          />
        ))}
      </div>

      <Navbar />
      
      <main className="relative z-10 flex flex-col gap-24 pb-32">
        <Hero />
        <About />
        <GiftGenerator />
        <Santafy onAddToGallery={addToGallery} />
        <CommunityWall items={galleryItems} onUpload={addToGallery} />
      </main>

      {/* Atmospheric Fog Effect at Bottom */}
      <div className="fog-container">
        <div className="fog-img"></div>
        <div className="fog-img-2"></div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
import React, { useMemo, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import GiftGenerator from './components/GiftGenerator';
import Santafy from './components/Santafy';
import CommunityWall from './components/CommunityWall';
import Footer from './components/Footer';
import ReindeerGame from './components/ReindeerGame';
import TreeDecorator from './components/TreeDecorator';
import MemoryGame from './components/MemoryGame';
import SantaChat from './components/SantaChat';
import CozyFireplace from './components/CozyFireplace';
import { GalleryItem } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  // Shared state for the gallery
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Fetch items from Supabase on load
  useEffect(() => {
    const fetchGallery = async () => {
      // If we are in local demo mode, don't try to fetch from invalid URL
      if (!isSupabaseConfigured) {
        console.log("App running in Demo Mode (Supabase not configured)");
        return;
      }

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching gallery:', error);
      } else if (data) {
        setGalleryItems(data as GalleryItem[]);
      }
    };

    fetchGallery();
  }, []);

  const addToGallery = (item: GalleryItem) => {
    setGalleryItems(prev => [item, ...prev]);
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const deleteFromGallery = async (id: number | string) => {
    // 1. Optimistic UI update (remove immediately from view)
    setGalleryItems(prev => prev.filter(item => item.id !== id));

    // 2. If it's a real backend item (number ID) and Supabase is working, delete from DB
    if (isSupabaseConfigured && typeof id === 'number') {
        const { error } = await supabase
            .from('gallery')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error("Error deleting from backend:", error);
            // Optionally revert UI change here if needed, but for a memecoin site, nice-to-have
        }
    }
  };

  // Generate HEAVY falling snow
  const snowflakes = useMemo(() => {
    // Increased from 75 to 150 for more cheer
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 5}s`, // Varied speed
      animationDelay: `-${Math.random() * 10}s`,
      opacity: Math.random() * 0.7 + 0.3,
      size: `${Math.random() * 6 + 2}px` // varied sizes
    }));
  }, []);

  return (
    <div className="min-h-screen font-sans text-white relative overflow-x-hidden">
      
      {/* Background Pattern */}
      <div className="bg-pattern"></div>

      {/* Global Christmas Lights Decoration (Fixed Top) */}
      <div className="fixed top-0 left-0 w-full z-[60] pointer-events-none h-12 hidden md:block">
         <div className="w-full h-full flex justify-between px-2">
            {Array.from({ length: 30 }).map((_, i) => {
                 const colors = ['#ff0000', '#00ff00', '#ffd700', '#0000ff'];
                 const color = colors[i % colors.length];
                 return (
                   <div key={i} className="relative flex flex-col items-center" style={{ width: '3.33%' }}>
                      {/* Wire */}
                      <div className="w-full h-6 border-b-2 border-gray-800 rounded-[50%] absolute -top-4"></div>
                      {/* Bulb */}
                      <div 
                        className="w-3 h-4 rounded-full mt-2 animate-pulse"
                        style={{ 
                            backgroundColor: color, 
                            boxShadow: `0 0 10px ${color}`,
                            animationDuration: `${Math.random() * 1 + 1}s`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                      ></div>
                   </div>
                 )
            })}
         </div>
      </div>

      {/* Heavy Snow */}
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
        
        {/* Insert Cozy Fireplace Here */}
        <CozyFireplace />

        <About />
        <TreeDecorator />
        <ReindeerGame />
        <MemoryGame />
        <GiftGenerator />
        <Santafy onAddToGallery={addToGallery} />
        <CommunityWall items={galleryItems} onUpload={addToGallery} onDelete={deleteFromGallery} />
      </main>

      {/* Atmospheric Fog Effect at Bottom */}
      <div className="fog-container">
        <div className="fog-img"></div>
        <div className="fog-img-2"></div>
      </div>

      <Footer />
      
      {/* Floating Elements */}
      <SantaChat />
    </div>
  );
};

export default App;
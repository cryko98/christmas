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
import BackgroundMusic from './components/BackgroundMusic';
import { GalleryItem } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  // Shared state for the gallery
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [gameStarted, setGameStarted] = useState(false); // Welcome Screen State

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
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    if (isSupabaseConfigured && typeof id === 'number') {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) console.error("Error deleting from backend:", error);
    }
  };

  const snowflakes = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 5}s`,
      animationDelay: `-${Math.random() * 10}s`,
      opacity: Math.random() * 0.7 + 0.3,
      size: `${Math.random() * 6 + 2}px`
    }));
  }, []);

  return (
    <div className="min-h-screen font-sans text-white relative overflow-x-hidden">
      
      {/* WELCOME OVERLAY - Ensures Audio Context Unlocks */}
      {!gameStarted && (
        <div className="fixed inset-0 z-[10000] bg-santa-dark flex flex-col items-center justify-center p-4 transition-opacity duration-700">
            <div className="absolute inset-0 bg-pattern opacity-20"></div>
            <div className="relative z-10 text-center animate-in zoom-in duration-500">
                <img 
                  src="https://pbs.twimg.com/media/G7wdiRaX0AAQyGa?format=jpg&name=small" 
                  alt="Logo" 
                  className="w-24 h-24 mx-auto rounded-full border-4 border-santa-gold shadow-[0_0_30px_rgba(253,185,49,0.5)] mb-6 animate-bounce"
                />
                <h1 className="text-4xl md:text-6xl font-serif text-white mb-2">$SANTACOIN</h1>
                <p className="text-santa-gold uppercase tracking-[0.3em] text-xs mb-8">Solana Edition</p>
                
                <button 
                    onClick={() => setGameStarted(true)}
                    className="group relative px-10 py-4 bg-white text-santa-red font-bold text-xl rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        ENTER NORTH POLE <i className="fa-solid fa-sleigh"></i>
                    </span>
                    <div className="absolute inset-0 rounded-full bg-santa-gold blur opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </button>
                <p className="mt-6 text-white/40 text-xs">Turn on sound for best experience 🎵</p>
            </div>
        </div>
      )}

      {/* Background Pattern */}
      <div className="bg-pattern fixed inset-0 z-0"></div>

      {/* Global Christmas Lights Decoration */}
      <div className="fixed top-0 left-0 w-full z-30 pointer-events-none fixed-lights-container h-12 hidden md:block">
         <div className="w-full h-full flex justify-between px-2">
            {Array.from({ length: 30 }).map((_, i) => {
                 const colors = ['#ff0000', '#00ff00', '#ffd700', '#0000ff'];
                 const color = colors[i % colors.length];
                 return (
                   <div key={i} className="relative flex flex-col items-center" style={{ width: '3.33%' }}>
                      <div className="w-full h-6 border-b-2 border-gray-800 rounded-[50%] absolute -top-4"></div>
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

      {/* Snow */}
      <div className="snow-container pointer-events-none" style={{ zIndex: 1 }}>
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute rounded-full bg-white blur-[1px] pointer-events-none"
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
      
      <main className="relative z-20 flex flex-col gap-24 pb-32">
        <Hero />
        <About />
        <CozyFireplace />
        <TreeDecorator />
        <ReindeerGame />
        <MemoryGame />
        <GiftGenerator />
        <Santafy onAddToGallery={addToGallery} />
        <CommunityWall items={galleryItems} onUpload={addToGallery} onDelete={deleteFromGallery} />
      </main>

      <div className="fog-container" style={{ zIndex: 5 }}>
        <div className="fog-img"></div>
        <div className="fog-img-2"></div>
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
      
      <div className="relative z-50">
        <SantaChat />
      </div>
      
      {/* Pass gameStarted state to auto-trigger music */}
      <BackgroundMusic autoStart={gameStarted} />
    </div>
  );
};

export default App;
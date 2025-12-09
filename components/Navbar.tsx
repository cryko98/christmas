import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/10 ${
        scrolled ? 'bg-santa-dark/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.scrollTo(0,0)}
          >
            <div className="text-4xl filter drop-shadow-md group-hover:animate-shake">🎄</div>
            <div className="flex flex-col">
              <span className="font-serif text-white font-bold text-2xl tracking-wide leading-none">
                $CHRISTMAS
              </span>
              <span className="text-[10px] text-santa-gold uppercase tracking-[0.2em] opacity-80">
                Solana Edition
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink onClick={() => scrollToSection('countdown')} label="Countdown" />
              <NavLink onClick={() => scrollToSection('about')} label="Story" />
              <NavLink onClick={() => scrollToSection('decorator')} label="Decorate" />
              <NavLink onClick={() => scrollToSection('game')} label="Dash" />
              <NavLink onClick={() => scrollToSection('memory-game')} label="Memory" />
              <NavLink onClick={() => scrollToSection('gift-gen')} label="Gifts" />
              <NavLink onClick={() => scrollToSection('santafy')} label="Santafy" />
              <NavLink onClick={() => scrollToSection('gallery')} label="Gallery" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white text-2xl focus:outline-none">
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-santa-dark/95 backdrop-blur-xl border-t border-white/10 p-6 absolute w-full shadow-2xl">
           <div className="flex flex-col space-y-4">
              <MobileLink onClick={() => scrollToSection('countdown')} label="Countdown" />
              <MobileLink onClick={() => scrollToSection('about')} label="Our Story" />
              <MobileLink onClick={() => scrollToSection('decorator')} label="Trim the Tree" />
              <MobileLink onClick={() => scrollToSection('game')} label="Reindeer Dash" />
              <MobileLink onClick={() => scrollToSection('memory-game')} label="Memory Match" />
              <MobileLink onClick={() => scrollToSection('gift-gen')} label="Gift Generator" />
              <MobileLink onClick={() => scrollToSection('santafy')} label="Santafy Tool" />
              <MobileLink onClick={() => scrollToSection('gallery')} label="Community Gallery" />
           </div>
        </div>
      )}
    </nav>
  );
};

const NavLink: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button 
    onClick={onClick} 
    className="text-white/80 hover:text-santa-gold font-medium text-sm tracking-widest uppercase transition-colors relative group"
  >
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-santa-gold transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const MobileLink: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button onClick={onClick} className="text-white text-lg font-serif font-bold text-left border-b border-white/10 pb-2">
    {label}
  </button>
);

export default Navbar;
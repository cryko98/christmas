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
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b border-white/10 ${
        scrolled ? 'bg-santa-dark/95 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group relative z-[101]" 
            onClick={() => window.scrollTo(0,0)}
          >
            <img 
              src="https://pbs.twimg.com/media/G7wdiRaX0AAQyGa?format=jpg&name=small" 
              alt="SantaCoin Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20 shadow-lg group-hover:animate-shake object-cover"
            />
            <div className="flex flex-col">
              <span className="font-serif text-white font-bold text-xl md:text-2xl tracking-wide leading-none">
                $SANTACOIN
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

          {/* Actions - Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden relative z-[101]">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-white text-2xl p-2 focus:outline-none active:scale-95 transition-transform"
                aria-label="Toggle Menu"
            >
                <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-santa-dark/98 backdrop-blur-xl z-[90] flex flex-col justify-center items-center">
           <div className="flex flex-col space-y-6 text-center w-full px-8">
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
  <button onClick={onClick} className="text-white text-2xl font-serif font-bold py-4 border-b border-white/10 w-full active:text-santa-gold transition-colors">
    {label}
  </button>
);

export default Navbar;
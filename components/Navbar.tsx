import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const caAddress = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <NavLink onClick={() => scrollToSection('about')} label="Our Story" />
              <NavLink onClick={() => scrollToSection('game')} label="Game" />
              <NavLink onClick={() => scrollToSection('gift-gen')} label="Gifts" />
              <NavLink onClick={() => scrollToSection('santafy')} label="Santafy" />
              <NavLink onClick={() => scrollToSection('gallery')} label="Gallery" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={copyToClipboard}
              className="hidden lg:flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full border border-white/20 transition-all backdrop-blur-sm group"
            >
              <span className="text-xs text-santa-gold font-bold tracking-widest uppercase">CA:</span>
              <span className="text-xs text-white/90 font-mono tracking-wide">
                {caAddress.substring(0, 6)}...{caAddress.substring(caAddress.length - 4)}
              </span>
              <i className={`fa-regular ${copied ? 'fa-circle-check text-green-400' : 'fa-copy text-white'} group-hover:scale-110 transition-transform`}></i>
            </button>

            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-900 transition-all border border-white/20 shadow-lg hover:-translate-y-1"
            >
               <i className="fa-brands fa-x-twitter text-white text-lg"></i>
            </a>

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
              <MobileLink onClick={() => scrollToSection('game')} label="Mini Game" />
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
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/80 py-8 border-t border-white/10 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-gray-500 text-sm mb-2">
          $SANTACOIN is a memecoin for entertainment purposes only. No financial advice.
        </p>
        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} The Official SantaCoin. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
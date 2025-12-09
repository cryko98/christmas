import React, { useState, useEffect, useCallback } from 'react';

// --- TYPES ---
interface Card {
  id: number;
  designId: number; // 0-7, determines the look of the gift
  isFlipped: boolean;
  isMatched: boolean;
}

// --- VISUAL DESIGNS FOR GIFTS ---
// We use CSS classes to represent different wrapping papers
const GIFT_DESIGNS = [
  { name: 'Classic Santa', bg: 'bg-santa-red', pattern: 'border-l-8 border-santa-gold' },
  { name: 'Winter Forest', bg: 'bg-green-700', pattern: 'radial-gradient(circle, #fff 2px, transparent 2.5px) background-size-[10px_10px]' }, // Polka dots
  { name: 'Silent Night', bg: 'bg-blue-900', pattern: 'border-4 border-double border-gray-300' },
  { name: 'Golden Bell', bg: 'bg-santa-gold', pattern: 'border-r-8 border-t-8 border-red-600' },
  { name: 'Sugar Plum', bg: 'bg-purple-700', pattern: 'border-dashed border-2 border-white' },
  { name: 'Silver Bells', bg: 'bg-gray-200', pattern: 'border-t-8 border-b-8 border-blue-500' },
  { name: 'Candy Cane', bg: 'bg-white', pattern: 'bg-[linear-gradient(45deg,transparent_25%,#D42426_25%,#D42426_50%,transparent_50%,transparent_75%,#D42426_75%,#D42426_100%)] bg-[length:20px_20px]' },
  { name: 'Elf Suit', bg: 'bg-green-500', pattern: 'border-b-8 border-yellow-400' }
];

const MemoryGame: React.FC = () => {
  // --- STATE ---
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Prevents clicking during animation
  const [isVictory, setIsVictory] = useState(false);

  // --- INIT GAME ---
  const initializeGame = useCallback(() => {
    // 1. Create 8 pairs (16 cards)
    const newCards: Card[] = [];
    for (let i = 0; i < 8; i++) {
      // Add two of each design
      newCards.push({ id: i * 2, designId: i, isFlipped: false, isMatched: false });
      newCards.push({ id: i * 2 + 1, designId: i, isFlipped: false, isMatched: false });
    }

    // 2. Shuffle (Fisher-Yates)
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    // 3. Reset State
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setTimer(0);
    setIsGameActive(true);
    setIsVictory(false);
    setIsLocked(false);
  }, []);

  // Start game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // --- TIMER ---
  useEffect(() => {
    let interval: number;
    if (isGameActive && !isVictory) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, isVictory]);

  // --- GAME LOGIC ---
  const handleCardClick = (index: number) => {
    // Block if locked, already flipped, or already matched
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    // 1. Flip the card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // 2. If 2 cards are flipped, check match
    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);

      const [firstIndex, secondIndex] = newFlipped;
      
      if (cards[firstIndex].designId === cards[secondIndex].designId) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...updatedCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsLocked(false);
          
          // Check Victory
          if (matchedCards.every(c => c.isMatched)) {
            setIsVictory(true);
            setIsGameActive(false);
          }
        }, 500);
      } else {
        // NO MATCH - Flip back after delay
        setTimeout(() => {
          const resetCards = [...updatedCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  // --- FORMAT TIMER ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section id="memory-game" className="py-24 px-4 relative">
       {/* 3D Flip Styles */}
       <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-3 border border-santa-gold/50 rounded-full bg-black/20 text-santa-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
             Mini Game
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg">
            Gift <span className="text-santa-gold italic">Match</span>
          </h2>
          <p className="text-white/60 mt-2">Find the matching presents before the snow melts!</p>
        </div>

        {/* Game Container */}
        <div className="glass-card p-6 md:p-8 relative">
          
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-8 bg-gray-100/80 p-4 rounded-xl shadow-inner border border-white">
             <div className="flex items-center gap-4">
                <div className="text-center">
                   <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Time</p>
                   <p className="text-2xl font-mono font-bold text-santa-dark">{formatTime(timer)}</p>
                </div>
                <div className="w-[1px] h-8 bg-gray-300"></div>
                <div className="text-center">
                   <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Moves</p>
                   <p className="text-2xl font-mono font-bold text-santa-dark">{moves}</p>
                </div>
             </div>

             <button 
               onClick={initializeGame}
               className="bg-santa-dark text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-santa-red transition-colors shadow-lg flex items-center gap-2"
             >
               <i className="fa-solid fa-rotate-right"></i>
               <span className="hidden sm:inline">Restart</span>
             </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-3 md:gap-4 aspect-square max-w-[500px] mx-auto">
             {cards.map((card, index) => {
               const design = GIFT_DESIGNS[card.designId];
               
               return (
                 <div 
                   key={index}
                   onClick={() => handleCardClick(index)}
                   className={`relative w-full h-full cursor-pointer perspective-1000 group ${card.isMatched ? 'opacity-50 cursor-default' : ''}`}
                 >
                   <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                      
                      {/* CARD BACK (Face Down) */}
                      <div className="absolute w-full h-full bg-santa-red rounded-xl shadow-md backface-hidden flex items-center justify-center border-2 border-white/20 group-hover:border-santa-gold/50 transition-colors">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
                          <span className="text-3xl text-white/40"><i className="fa-solid fa-snowflake"></i></span>
                      </div>

                      {/* CARD FRONT (Face Up - The Gift) */}
                      <div className={`absolute w-full h-full rounded-xl shadow-lg backface-hidden rotate-y-180 overflow-hidden border-2 border-white/50 flex items-center justify-center ${design.bg}`}>
                          
                          {/* The Wrapping Pattern */}
                          <div className={`absolute inset-0 ${design.pattern} opacity-80`}></div>
                          
                          {/* The Ribbon/Bow Icon overlay */}
                          <div className="relative z-10 drop-shadow-md">
                             <i className="fa-solid fa-gift text-4xl text-white"></i>
                          </div>

                      </div>

                   </div>
                 </div>
               );
             })}
          </div>

          {/* VICTORY OVERLAY */}
          {isVictory && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-2xl text-center max-w-sm mx-4 border-4 border-santa-gold shadow-2xl transform scale-100 animate-in zoom-in">
                  <div className="text-6xl mb-4">🎄</div>
                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Unwrapped!</h3>
                  <p className="text-gray-500 mb-6">You found all the gifts.</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold">Time</p>
                        <p className="text-xl font-bold text-santa-red">{formatTime(timer)}</p>
                     </div>
                     <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold">Moves</p>
                        <p className="text-xl font-bold text-santa-red">{moves}</p>
                     </div>
                  </div>

                  <button 
                    onClick={initializeGame}
                    className="w-full bg-gradient-to-r from-santa-red to-santa-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:shadow-glow transition-all"
                  >
                    Play Again
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default MemoryGame;
import React, { useRef, useEffect, useState, useCallback } from 'react';

const ReindeerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'>('START');
  const [score, setScore] = useState(0);
  
  // Game Refs to hold mutable data without triggering re-renders inside the loop
  const frameRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const reindeerRef = useRef({ x: 100, y: 200, width: 40, height: 40, velocity: 0 });
  const giftsRef = useRef<any[]>([]);
  const keysPressed = useRef<{[key: string]: boolean}>({});

  // Constants
  const GRAVITY = 0.25;
  const JUMP_STRENGTH = -6;
  const GAME_SPEED = 3;
  const LEVEL_LENGTH = 3000;
  const GIFT_SPAWN_RATE = 100; // Frames

  // Reset Game State
  const resetGame = () => {
    reindeerRef.current = { x: 100, y: 200, width: 40, height: 40, velocity: 0 };
    giftsRef.current = [];
    scoreRef.current = 0;
    distanceRef.current = 0;
    setScore(0);
    setGameState('PLAYING');
  };

  const drawReindeer = (ctx: CanvasRenderingContext2D) => {
    const r = reindeerRef.current;
    
    // Draw Body (Brown Rect)
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.width, r.height, 8);
    ctx.fill();

    // Draw Nose (Red Circle)
    ctx.fillStyle = '#D42426'; // Santa Red
    ctx.beginPath();
    ctx.arc(r.x + r.width, r.y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    // Shine on nose
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(r.x + r.width + 2, r.y + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Antlers (Gold Lines)
    ctx.strokeStyle = '#FDB931';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(r.x + 10, r.y);
    ctx.lineTo(r.x + 15, r.y - 15);
    ctx.lineTo(r.x + 25, r.y - 20);
    ctx.stroke();
  };

  const drawGift = (ctx: CanvasRenderingContext2D, gift: any) => {
    // Box
    ctx.fillStyle = gift.color;
    ctx.fillRect(gift.x, gift.y, gift.width, gift.height);
    
    // Ribbon
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillRect(gift.x + 12, gift.y, 6, gift.height); // Vertical
    ctx.fillRect(gift.x, gift.y + 12, gift.width, 6); // Horizontal
  };

  const drawFinishLine = (ctx: CanvasRenderingContext2D, xPosition: number, canvasHeight: number) => {
      // Pole
      ctx.fillStyle = '#ecf0f1';
      ctx.fillRect(xPosition, 0, 20, canvasHeight);
      
      // Stripes
      ctx.strokeStyle = '#D42426';
      ctx.lineWidth = 5;
      ctx.beginPath();
      for(let i = 0; i < canvasHeight; i+=40) {
          ctx.moveTo(xPosition, i);
          ctx.lineTo(xPosition + 20, i + 20);
      }
      ctx.stroke();

      // Top Ball
      ctx.fillStyle = '#FDB931';
      ctx.beginPath();
      ctx.arc(xPosition + 10, 0, 15, 0, Math.PI * 2);
      ctx.fill();
  };

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- UPDATES ---
    
    // 1. Reindeer Physics
    const r = reindeerRef.current;
    r.velocity += GRAVITY;
    r.y += r.velocity;

    // Floor/Ceiling Collision (Safe - no death)
    if (r.y + r.height > canvas.height) {
        r.y = canvas.height - r.height;
        r.velocity = 0;
    }
    if (r.y < 0) {
        r.y = 0;
        r.velocity = 0;
    }

    // 2. Gifts
    // Spawn logic
    if (distanceRef.current < LEVEL_LENGTH && Math.floor(distanceRef.current) % GIFT_SPAWN_RATE === 0) {
        // Randomly skip some spawns to make it less uniform
        if (Math.random() > 0.2) {
            giftsRef.current.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 50),
                width: 30,
                height: 30,
                color: ['#D42426', '#228B22', '#FDB931'][Math.floor(Math.random() * 3)],
                markedForDeletion: false
            });
        }
    }

    // Update Gifts
    for (let i = 0; i < giftsRef.current.length; i++) {
        const g = giftsRef.current[i];
        g.x -= GAME_SPEED;

        // Collision Detection (AABB)
        if (
            r.x < g.x + g.width &&
            r.x + r.width > g.x &&
            r.y < g.y + g.height &&
            r.y + r.height > g.y
        ) {
            scoreRef.current += 1;
            setScore(scoreRef.current); // Sync with React State
            g.markedForDeletion = true;
        }

        // Off-screen
        if (g.x + g.width < 0) {
            g.markedForDeletion = true;
        }
    }
    // Cleanup gifts
    giftsRef.current = giftsRef.current.filter(g => !g.markedForDeletion);

    // 3. Progress
    distanceRef.current += GAME_SPEED;

    // --- DRAWING ---

    // Draw Gifts
    giftsRef.current.forEach(g => drawGift(ctx, g));

    // Draw Reindeer
    drawReindeer(ctx);

    // Draw Finish Line Logic
    if (distanceRef.current >= LEVEL_LENGTH) {
        const finishLineX = canvas.width - (distanceRef.current - LEVEL_LENGTH);
        drawFinishLine(ctx, finishLineX, canvas.height);

        // Check Win Condition
        if (r.x > finishLineX + 20) {
            setGameState('VICTORY');
        }
    }

    // Loop
    frameRef.current = requestAnimationFrame(update);
  }, [gameState]);

  // Handle Input
  const handleInput = useCallback(() => {
    if (gameState === 'PLAYING') {
       reindeerRef.current.velocity = JUMP_STRENGTH;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState === 'PLAYING') handleInput();
            if (gameState === 'START' || gameState === 'GAME_OVER' || gameState === 'VICTORY') resetGame();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleInput]);

  // Start Loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
        frameRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, update]);

  // Initial Draw for Start Screen Background
  useEffect(() => {
      if (gameState === 'START' && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
              ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
              drawReindeer(ctx); // Show reindeer waiting
          }
      }
  }, [gameState]);

  return (
    <section id="game" className="py-24 px-4 relative">
       <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8">
             <span className="inline-block py-1 px-3 border border-santa-gold/50 rounded-full bg-black/20 text-santa-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                Play & Earn (Points)
             </span>
             <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg">
                Reindeer <span className="text-santa-red italic">Gift Dash</span>
             </h2>
             <p className="text-white/60 mt-2">Tap to fly, collect gifts, reach the North Pole!</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(253,185,49,0.2)] border-4 border-santa-dark/50 bg-gray-900">
             
             {/* Score Board */}
             <div className="absolute top-4 left-6 z-10 pointer-events-none">
                 <span className="text-3xl font-bold text-white drop-shadow-md font-serif">
                    <i className="fa-solid fa-gift text-santa-red mr-2"></i>
                    {score}
                 </span>
             </div>

             <canvas 
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-auto block bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364] cursor-pointer"
                onClick={() => {
                    if (gameState === 'PLAYING') handleInput();
                }}
             />

             {/* UI OVERLAYS */}
             {gameState === 'START' && (
                 <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center z-20">
                     <h3 className="text-4xl font-serif text-santa-gold mb-2">Ready to Fly?</h3>
                     <p className="text-white/80 mb-8">Use Spacebar or Tap to fly.</p>
                     <button 
                        onClick={resetGame}
                        className="bg-santa-red hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
                     >
                        Start Game
                     </button>
                 </div>
             )}

             {gameState === 'VICTORY' && (
                 <div className="absolute inset-0 bg-santa-gold/90 flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
                     <div className="text-6xl mb-4 animate-bounce">🏆</div>
                     <h3 className="text-4xl font-serif text-black mb-2">Level Complete!</h3>
                     <p className="text-black/80 mb-6 font-bold text-lg">You collected {score} gifts for Santa.</p>
                     <button 
                        onClick={resetGame}
                        className="bg-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
                     >
                        Play Again
                     </button>
                 </div>
             )}
          </div>
       </div>
    </section>
  );
};

export default ReindeerGame;
import React, { useRef, useEffect, useState, useCallback } from 'react';

const ReindeerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'>('START');
  const [score, setScore] = useState(0);
  
  // Game Refs to hold mutable data without triggering re-renders inside the loop
  const frameRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const gameSpeedRef = useRef<number>(4);
  const reindeerRef = useRef({ x: 100, y: 200, width: 48, height: 48, velocity: 0, frame: 0 });
  const giftsRef = useRef<any[]>([]);
  const starsRef = useRef<any[]>([]);
  const snowHillsRef = useRef<any[]>([]);
  
  // Difficulty Refs
  const spawnTimerRef = useRef<number>(0);

  // Constants
  const GRAVITY = 0.45; // Heavier feel
  const JUMP_STRENGTH = -8;
  const INITIAL_SPEED = 5;
  const MAX_SPEED = 15; // Cap for sanity
  const LEVEL_LENGTH = 10000; // Longer level
  const INITIAL_SPAWN_RATE = 90; // Frames between spawns initially

  // Initialize background elements
  useEffect(() => {
     // Generate Stars
     starsRef.current = Array.from({ length: 50 }).map(() => ({
         x: Math.random() * 800,
         y: Math.random() * 300,
         size: Math.random() * 2 + 1,
         twinkleSpeed: Math.random() * 0.1 + 0.05,
         alpha: Math.random()
     }));

     // Generate Snow Hills
     snowHillsRef.current = Array.from({ length: 12 }).map((_, i) => ({
        x: i * 100,
        height: Math.random() * 30 + 20
     }));
  }, []);

  // Reset Game State
  const resetGame = () => {
    reindeerRef.current = { x: 100, y: 200, width: 48, height: 48, velocity: 0, frame: 0 };
    giftsRef.current = [];
    scoreRef.current = 0;
    distanceRef.current = 0;
    gameSpeedRef.current = INITIAL_SPEED;
    spawnTimerRef.current = 0;
    setScore(0);
    setGameState('PLAYING');
  };

  // --- DRAWING FUNCTIONS ---

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Deep Night Sky Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020024');
      gradient.addColorStop(0.5, '#090979');
      gradient.addColorStop(1, '#00d4ff');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      ctx.fillStyle = '#FFFFFF';
      starsRef.current.forEach(star => {
          ctx.globalAlpha = Math.abs(Math.sin(Date.now() * 0.001 * star.twinkleSpeed + star.x));
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Moon
      ctx.fillStyle = '#FDB931';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FDB931';
      ctx.beginPath();
      ctx.arc(width - 100, 80, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Moon Crater
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.arc(width - 90, 70, 10, 0, Math.PI * 2);
      ctx.arc(width - 110, 90, 8, 0, Math.PI * 2);
      ctx.fill();
  };

  const drawGround = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Move Hills
      snowHillsRef.current.forEach(hill => {
          hill.x -= gameSpeedRef.current;
      });

      // Recycle Hills
      if (snowHillsRef.current[0].x < -100) {
          const first = snowHillsRef.current.shift();
          // Attach to the end of the last hill
          const lastHill = snowHillsRef.current[snowHillsRef.current.length - 1];
          first.x = lastHill.x + 100;
          first.height = Math.random() * 30 + 20;
          snowHillsRef.current.push(first);
      }

      ctx.fillStyle = '#E8F4F8'; // Snow White
      ctx.beginPath();
      ctx.moveTo(0, height);
      snowHillsRef.current.forEach((hill, i) => {
          // Smooth curve connection
          if (i === 0) ctx.lineTo(hill.x, height - hill.height);
          else {
             const prev = snowHillsRef.current[i-1];
             const cpX = (prev.x + hill.x) / 2;
             const cpY = (height - prev.height + height - hill.height) / 2 - 20; // curve up
             ctx.quadraticCurveTo(cpX, cpY, hill.x, height - hill.height);
          }
      });
      ctx.lineTo(width + 100, height); // Extend slightly beyond to prevent gaps
      ctx.lineTo(0, height);
      ctx.fill();

      // Ground Top Shadow
      ctx.strokeStyle = '#CFE7EE';
      ctx.lineWidth = 4;
      ctx.stroke();
  };

  const drawReindeerSprite = (ctx: CanvasRenderingContext2D) => {
    const r = reindeerRef.current;
    
    // Animation Frame Toggle (running legs) - speed up animation with game speed
    const animSpeed = Math.max(50, 150 - (gameSpeedRef.current * 5));
    const legOffset = Math.floor(Date.now() / animSpeed) % 2 === 0 ? 0 : 5;
    const flyTilt = Math.max(-20, Math.min(20, r.velocity * 2)); // Tilt based on velocity

    ctx.save();
    ctx.translate(r.x + r.width / 2, r.y + r.height / 2);
    ctx.rotate(flyTilt * Math.PI / 180);
    ctx.translate(-(r.x + r.width / 2), -(r.y + r.height / 2));

    // --- PIXEL ART STYLE REINDEER ---
    
    // Colors
    const furDark = '#5D4037';
    const furLight = '#8D6E63';
    const noseRed = '#FF0000';
    const antler = '#FFC107';

    // Body
    ctx.fillStyle = furDark;
    ctx.fillRect(r.x + 10, r.y + 15, 30, 15); 
    
    // Neck
    ctx.fillRect(r.x + 30, r.y + 5, 10, 15);

    // Head
    ctx.fillStyle = furLight;
    ctx.fillRect(r.x + 32, r.y, 14, 12);
    
    // Nose (Glowing)
    ctx.shadowBlur = 10;
    ctx.shadowColor = noseRed;
    ctx.fillStyle = noseRed;
    ctx.beginPath();
    ctx.arc(r.x + 48, r.y + 6, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(r.x + 38, r.y + 2, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(r.x + 40, r.y + 3, 2, 2);

    // Antlers
    ctx.strokeStyle = antler;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(r.x + 36, r.y);
    ctx.lineTo(r.x + 32, r.y - 10);
    ctx.lineTo(r.x + 38, r.y - 15);
    ctx.moveTo(r.x + 32, r.y - 10);
    ctx.lineTo(r.x + 28, r.y - 14);
    ctx.stroke();

    // Legs (Animated)
    ctx.fillStyle = furDark;
    // Front Legs
    ctx.fillRect(r.x + 32 + legOffset, r.y + 30, 4, 10 - legOffset); 
    ctx.fillRect(r.x + 38 - legOffset, r.y + 30, 4, 10 + legOffset);
    // Back Legs
    ctx.fillRect(r.x + 12 - legOffset, r.y + 30, 4, 10 + legOffset);
    ctx.fillRect(r.x + 18 + legOffset, r.y + 30, 4, 10 - legOffset);

    // Tail
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(r.x + 10, r.y + 16, 4, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  };

  const drawGift = (ctx: CanvasRenderingContext2D, gift: any) => {
    // Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = gift.color;
    
    // Box
    ctx.fillStyle = gift.color;
    ctx.fillRect(gift.x, gift.y, gift.width, gift.height);
    
    ctx.shadowBlur = 0;

    // 3D Depth
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(gift.x + gift.width, gift.y + 4, 4, gift.height - 4);
    ctx.fillRect(gift.x + 4, gift.y + gift.height, gift.width - 4, 4);

    // Ribbon
    ctx.fillStyle = '#FDB931'; // Gold Ribbon
    ctx.fillRect(gift.x + 12, gift.y, 6, gift.height); // Vertical
    ctx.fillRect(gift.x, gift.y + 12, gift.width, 6); // Horizontal
    
    // Bow
    ctx.beginPath();
    ctx.arc(gift.x + 15, gift.y - 4, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawFinishLine = (ctx: CanvasRenderingContext2D, xPosition: number, canvasHeight: number) => {
      const poleX = xPosition + 20; // Offset slightly
      
      // Giant North Pole Sign
      ctx.fillStyle = '#ecf0f1';
      ctx.fillRect(poleX, 100, 20, canvasHeight);
      
      // Stripes
      ctx.strokeStyle = '#D42426';
      ctx.lineWidth = 6;
      ctx.beginPath();
      for(let i = 100; i < canvasHeight; i+=30) {
          ctx.moveTo(poleX, i);
          ctx.lineTo(poleX + 20, i + 20);
      }
      ctx.stroke();

      // Top Globe
      ctx.fillStyle = '#FDB931';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FDB931';
      ctx.beginPath();
      ctx.arc(poleX + 10, 90, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Banner Text
      if (xPosition < 600) {
        ctx.font = "bold 40px serif";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.strokeText("NORTH POLE", poleX - 100, 200);
        ctx.fillText("NORTH POLE", poleX - 100, 200);
      }
  };

  // --- GAME LOOP ---

  const update = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and Draw Background
    drawBackground(ctx, canvas.width, canvas.height);

    // --- LOGIC ---
    
    // 1. DYNAMIC DIFFICULTY SCALING
    // Speed increases based on SCORE (primary) and DISTANCE (secondary)
    // Formula: Initial + (Score * 0.4) + (Distance * 0.0002)
    const targetSpeed = INITIAL_SPEED + (scoreRef.current * 0.4) + (distanceRef.current * 0.0002);
    // Smoothly ramp speed towards target, cap at MAX_SPEED
    gameSpeedRef.current += (Math.min(targetSpeed, MAX_SPEED) - gameSpeedRef.current) * 0.05;
    
    // 2. Reindeer Physics
    const r = reindeerRef.current;
    r.velocity += GRAVITY;
    r.y += r.velocity;

    // Floor/Ceiling
    const floorLimit = canvas.height - 80; // Ground height
    if (r.y + r.height > floorLimit) {
        r.y = floorLimit - r.height;
        r.velocity = 0;
    }
    if (r.y < 0) {
        r.y = 0;
        r.velocity = 0;
    }

    // 3. Gifts Spawning
    spawnTimerRef.current++;
    
    // Calculate spawn rate: Faster spawning as score increases
    // Initial 90 frames -> subtract 2.5 frames per point -> minimum 25 frames (very fast)
    const currentSpawnRate = Math.max(25, INITIAL_SPAWN_RATE - (scoreRef.current * 2.5));

    if (distanceRef.current < LEVEL_LENGTH && spawnTimerRef.current > currentSpawnRate) {
        spawnTimerRef.current = 0; // Reset timer

        // Randomly skip less often now
        if (Math.random() > 0.05) {
            giftsRef.current.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 150) + 50, // Avoid ground
                width: 30,
                height: 30,
                color: ['#D42426', '#228B22', '#1E88E5'][Math.floor(Math.random() * 3)],
                markedForDeletion: false,
                collected: false
            });
        }
    }

    // Update Gifts
    for (let i = 0; i < giftsRef.current.length; i++) {
        const g = giftsRef.current[i];
        g.x -= gameSpeedRef.current;

        // Collision Detection (Hitbox slightly smaller than sprite for fairness)
        const hitboxPadding = 5;
        if (
            !g.collected &&
            r.x + hitboxPadding < g.x + g.width &&
            r.x + r.width - hitboxPadding > g.x &&
            r.y + hitboxPadding < g.y + g.height &&
            r.y + r.height - hitboxPadding > g.y
        ) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            g.collected = true; // Don't delete immediately, maybe play effect (simulated by not drawing)
            g.markedForDeletion = true; 
        }

        // Off-screen
        if (g.x + g.width < 0) {
            g.markedForDeletion = true;
        }
    }
    giftsRef.current = giftsRef.current.filter(g => !g.markedForDeletion);

    // 4. Progress
    distanceRef.current += gameSpeedRef.current;

    // --- FOREGROUND DRAWING ---
    
    // Finish Line
    if (distanceRef.current >= LEVEL_LENGTH) {
        const finishLineX = canvas.width - (distanceRef.current - LEVEL_LENGTH);
        drawFinishLine(ctx, finishLineX, canvas.height);
        if (r.x > finishLineX + 50) {
            setGameState('VICTORY');
        }
    }

    // Gifts
    giftsRef.current.forEach(g => drawGift(ctx, g));

    // Reindeer
    drawReindeerSprite(ctx);

    // Ground (Foreground)
    drawGround(ctx, canvas.width, canvas.height);

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

  useEffect(() => {
    if (gameState === 'PLAYING') {
        frameRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, update]);

  // Initial Static Draw
  useEffect(() => {
      if (gameState === 'START' && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
              drawBackground(ctx, 800, 450);
              drawGround(ctx, 800, 450);
              drawReindeerSprite(ctx);
              
              // Instructions overlay text drawn on canvas for better vibe
              ctx.fillStyle = 'rgba(0,0,0,0.5)';
              ctx.fillRect(0,0, 800, 450);
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
             <p className="text-white/60 mt-2">Tap to fly. <span className="text-santa-gold">Collecting gifts speeds you up!</span></p>
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
                className="w-full h-auto block cursor-pointer select-none"
                onClick={() => {
                    if (gameState === 'PLAYING') handleInput();
                }}
             />

             {/* UI OVERLAYS */}
             {gameState === 'START' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                     <div className="bg-black/80 p-8 rounded-2xl border border-santa-gold/30 shadow-2xl backdrop-blur-sm transform transition-all hover:scale-105">
                        <h3 className="text-4xl font-serif text-santa-gold mb-2">Ready to Fly?</h3>
                        <p className="text-white/80 mb-6">Tap to Fly.<br/>Collect gifts to go faster!</p>
                        <button 
                            onClick={resetGame}
                            className="bg-santa-red hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg transition-transform hover:scale-105 animate-pulse"
                        >
                            Start Flying
                        </button>
                     </div>
                 </div>
             )}

             {gameState === 'VICTORY' && (
                 <div className="absolute inset-0 bg-santa-gold/95 flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in">
                     <div className="text-6xl mb-4 animate-bounce">🎅</div>
                     <h3 className="text-5xl font-serif text-black mb-4">North Pole Reached!</h3>
                     <div className="bg-white/20 p-6 rounded-xl mb-6 backdrop-blur-md">
                        <p className="text-black/80 font-bold text-xl uppercase tracking-widest">Total Gifts Collected</p>
                        <p className="text-6xl font-black text-santa-red mt-2 drop-shadow-sm">{score}</p>
                     </div>
                     <button 
                        onClick={resetGame}
                        className="bg-black text-white hover:bg-gray-800 px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
                     >
                        Fly Again
                     </button>
                 </div>
             )}
          </div>
       </div>
    </section>
  );
};

export default ReindeerGame;
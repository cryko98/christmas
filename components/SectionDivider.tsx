import React from 'react';

const SectionDivider: React.FC = () => {
  // Rich Festive SVG: Pine, Holly, Berries, Candy Cane
  // Using Base64 to ensure it loads immediately without external requests
  const festiveDecorationSVG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMzAwIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9InNoYWRvdyIgeD0iLTIwJSIgeT0iLTIwJSIgd2lkdGg9IjE0MCUiIGhlaWdodD0iMTQwJSI+CiAgICAgIDxmZURyb3BTaGFkb3cgZHg9IjIiIGR5PSI0IiBzdGREZXZpYXRpb249IjMiIGZsb29kLW9wYWNpdHk9IjAuMyIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbHRlcj0idXJsKCNzaGFkb3cpIj4KICAgIDwhLS0gUGluZSBCcmFuY2ggLS0+CiAgICA8cGF0aCBkPSJNLTUwLDMwMCBRMTUwLDI1MCAzNTAsMTAwIiBzdHJva2U9IiMzRTI3MjMiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgogICAgPGcgc3Ryb2tlPSIjMUI1RTIwIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CiAgICAgICA8cGF0aCBkPSJMMCwyODAgbDMwLC00MCBNMjAsMjc1IGwzMCwtNDAgTTQwLDI3MCBsMzAsLTQwIE02MCwyNjUgbDMwLC00MCBNODAsMjYwIGwzMCwtNDAgTTEwMCwyNTUgbDMwLC00MCBNMTIwLDI1MCBsMzAsLTQwIE0xNDAsMjQ1IGwzMCwtNDAgTTE2MCwyNDAgbDMwLC00MCBNMTgwLDIzNSBsMzAsLTQwIiAvPgogICAgICAgPHBhdGggZD0iTTEwLDI5MCBsNDAsMTAgTTMwLDI4NSBsNDAsMTAgTTUwLDI4MCBsNDAsMTAgTTcwLDI3NSBsNDAsMTAgTTkwLDI3MCBsNDAsMTAgTTExMCwyNjUgbDQwLDEwIE0xMzAsMjYwIGw0MCwxMCBNMTUwLDI1NSBsNDAsMTAiIC8+CiAgICA8L2c+CiAgICAKICAgIDwhLS0gQ2FuZHkgQ2FuZSAtLT4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4MCwgMTMwKSByb3RhdGUoMTUpIj4KICAgICAgPHBhdGggZD0iTTAsMCBMMCwxMDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KICAgICAgPHBhdGggZD0iTTAsMCBBMjUsMjUgMCAxIDEgNTAsMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJub25lIiAvPgogICAgICA8cGF0aCBkPSJNMCwwIEwwLDEwMCIgc3Ryb2tlPSIjRDMyRjJGIiBzdHJva2Utd2lkdGg9IjEyIiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjkiIGZpbGw9Im5vbmUiLz4KICAgICAgPHBhdGggZD0iTTAsMCBBMjUsMjUgMCAxIDEgNTAsMCIgc3Ryb2tlPSIjRDMyRjJGIiBzdHJva2Utd2lkdGg9IjEyIiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjkiIC8+CiAgICA8L2c+CgogICAgPCEtLSBIb2xseSBMZWF2ZXMgLS0+CiAgICA8cGF0aCBkPSJNODAsMjIwIEM2MCwyMDAgMTIwLDE1MCAxNDAsMjAwIEMxNjAsMjUwIDEwMCwyODAgODAsMjIwIFoiIGZpbGw9IiMyRTdEMzIiIHN0cm9rZT0iIzFCNUUyMCIvPgogICAgPHBhdGggZD0iTTEyMCwyMjAgQzEwMCwyMDAgMTYwLDE1MCAxODAsMjAwIEMyMDAsMjUwIDE0MCwyODAgMTIwLDIyMCBaIiBmaWxsPSIjMzg4RTNDIiBzdHJva2U9IiMxQjVFMjAiLz4KICAgIAogICAgPCEtLSBCZXJyaWVzIC0tPgogICAgPGNpcmNsZSBjeD0iMTMwIiBjeT0iMjMwIiByPSIxMCIgZmlsbD0iI0QzMkYyRiIgLz4KICAgIDxjaXJjbGUgY3g9IjE0NSIgY3k9IjIyMCIgcj0iMTAiIGZpbGw9IiNDNjI4MjgiIC8+CiAgICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyNDAiIHI9IjEwIiBmaWxsPSIjQjcxQzFDIiAvPgogICAgPGNpcmNsZSBjeD0iMTM1IiBjeT0iMjI1IiByPSIzIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC40Ii8+CiAgPC9nPgo8L3N2Zz4=`;

  return (
    <div className="relative w-full h-40 pointer-events-none z-40 overflow-visible -my-20">
       
       {/* Snow Mound Layer 1 (Softer Glow) */}
       <div className="absolute bottom-0 left-0 w-full h-32" 
            style={{
                background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 40%, transparent 70%)',
                filter: 'blur(10px)',
                transform: 'translateY(10px)'
            }}>
       </div>

       {/* Snow Mound Layer 2 (Stronger Ground) */}
       <div className="absolute bottom-0 left-0 w-full h-20" 
            style={{
                background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                filter: 'blur(2px)'
            }}>
       </div>
       
       {/* Left Festive Corner: Pine + Holly + Candy Cane */}
       <div className="absolute bottom-[-10px] left-[-30px] md:left-[-10px] w-[280px] h-[200px] transform origin-bottom-left animate-sway-slow opacity-100 z-50">
           <img 
             src={festiveDecorationSVG} 
             alt="Holly and Pine Decoration" 
             className="w-full h-full object-contain filter drop-shadow-xl"
           />
       </div>

       {/* Right Festive Corner: Mirrored */}
       <div className="absolute bottom-[-10px] right-[-30px] md:right-[-10px] w-[280px] h-[200px] transform scale-x-[-1] origin-bottom-right animate-sway-slow-reverse opacity-100 z-50">
           <img 
             src={festiveDecorationSVG} 
             alt="Holly and Pine Decoration" 
             className="w-full h-full object-contain filter drop-shadow-xl"
           />
       </div>
       
       {/* Extra Sparkles */}
       <div className="absolute bottom-8 left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
       <div className="absolute bottom-12 right-[20%] w-2 h-2 bg-white rounded-full animate-pulse delay-500 shadow-[0_0_10px_white]"></div>
       <div className="absolute bottom-6 left-[50%] w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
    </div>
  );
};

export default SectionDivider;
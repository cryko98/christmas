import React from 'react';

const SectionDivider: React.FC = () => {
  // Embedded SVG for a realistic-looking stylized pine branch to ensure it ALWAYS loads
  const pineBranchSVG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMjUwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYnJhbmNoR3JhZCIgeDE9IjAlIiB5MT0iNTAlIiB4Mj0iMTAwJSIgeTI9IjUwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1RDQwMzc7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNFMjcyMztzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDwhLS0gTWFpbiBCcmFuY2ggLS0+CiAgPHBhdGggZD0iTSAwLDEyNSBDIDE1MCwxMjUgMzAwLDEwMCA1MDAsNTAiIHN0cm9rZT0idXJsKCNicmFuY2hHcmFkKSIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CiAgCiAgPCEtLSBOZWVkbGVzIChHcm91cHMpIC0tPgogIDxnIHN0cm9rZT0iIzFCNTMyNCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgPCEtLSBUb3AgU2lkZSAtLT4KICAgIDxsaW5lIHgxPSI1MCIgeTE9IjEyNSIgeDI9IjgwIiB5Mj0iODAiIC8+CiAgICA8bGluZSB4MT0iOTAiIHkxPSIxMjAiIHgyPSIxMjAiIHkyPSI3MCIgLz4KICAgIDxsaW5lIHgxPSIxMzAiIHkxPSIxMTUiIHgyPSIxNjAiIHkyPSI2NSIgLz4KICAgIDxsaW5lIHgxPSIxNzAiIHkxPSIxMTAiIHgyPSIyMDAiIHkyPSI1NSIgLz4KICAgIDxsaW5lIHgxPSIyMTAiIHkxPSIxMDUiIHgyPSIyNDAiIHkyPSI1MCIgLz4KICAgIDxsaW5lIHgxPSIyNTAiIHkxPSIxMDAiIHgyPSIyODAiIHkyPSI0NSIgLz4KICAgIDxsaW5lIHgxPSIyOTAiIHkxPSI5NSIgeDI9IjMyMCIgeTI9IjQwIiAvPgogICAgPGxpbmUgeDE9IjMzMCIgeTE9IjkwIiB4Mj0iMzYwIiB5Mj0iMzUiIC8+CiAgICA8bGluZSB4MT0iMzcwIiB5MT0iODUiIHgyPSI0MDAiIHkyPSIzMCIgLz4KICAgIDxsaW5lIHgxPSI0MTAiIHkxPSI4MCIgeDI9IjQ0MCIgeTI9IjI1IiAvPgogICAgCiAgICA8IS0tIEJvdHRvbSBTaWRlIC0tPgogICAgPGxpbmUgeDE9IjYwIiB5MT0iMTI1IiB4DI9IjkwIiB5Mj0iMTcwIiAvPgogICAgPGxpbmUgeDE9IjEwMCIgeTE9IjEyMCIgeDI9IjEzMCIgeTI9IjE2NSIgLz4KICAgIDxsaW5lIHgxPSIxNDAiIHkxPSIxMTUiIHgyPSIxNzAiIHkyPSIxNjAiIC8+CiAgICA8bGluZSB4MT0iMTgwIiB5MT0iMTEwIiB4Mj0iMjEwIiB5Mj0iMTU1IiAvPgogICAgPGxpbmUgeDE9IjIyMCIgeTE9IjEwNSIgeDI9IjI1MCIgeTI9IjE1MCIgLz4KICAgIDxsaW5lIHgxPSIyNjAiIHkxPSIxMDAiIHgyPSIyOTAiIHkyPSIxNDUiIC8+CiAgICA8bGluZSB4MT0iMzAwIiB5MT0iOTUiIHgyPSIzMzAiIHkyPSIxNDAiIC8+CiAgICA8bGluZSB4MT0iMzQwIiB5MT0iOTAiIHgyPSIzNzAiIHkyPSIxMzUiIC8+CiAgICA8bGluZSB4MT0iMzgwIiB5MT0iODUiIHgyPSI0MTAiIHkyPSIxMzAiIC8+CiAgICA8bGluZSB4MT0iNDIwIiB5MT0iODAiIHgyPSI0NTAiIHkyPSIxMjUiIC8+CiAgPC9nPgo8L3N2Zz4=`;

  return (
    <div className="relative w-full h-40 pointer-events-none z-30 overflow-visible -my-20">
       
       {/* Snow Mound - Made brighter and simpler to ensure visibility */}
       <div className="absolute bottom-0 left-0 w-full h-32 scale-y-110" 
            style={{
                background: 'radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 40%, transparent 80%)',
                filter: 'blur(2px)'
            }}>
       </div>
       
       {/* Left Pine Branch - Using Base64 Data URI */}
       <div className="absolute bottom-[-20px] left-[-50px] md:left-[-20px] w-64 h-64 transform -rotate-12 origin-bottom-left drop-shadow-2xl opacity-100 animate-sway-slow">
           <img 
             src={pineBranchSVG} 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter drop-shadow-lg"
           />
       </div>

       {/* Right Pine Branch - Using Base64 Data URI (Mirrored) */}
       <div className="absolute bottom-[-20px] right-[-50px] md:right-[-20px] w-64 h-64 transform scale-x-[-1] rotate-12 origin-bottom-right drop-shadow-2xl opacity-100 animate-sway-slow-reverse">
           <img 
             src={pineBranchSVG} 
             alt="Pine Decoration" 
             className="w-full h-full object-contain filter drop-shadow-lg"
           />
       </div>
       
       {/* Sparkles on the snow */}
       <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse blur-[1px]"></div>
       <div className="absolute bottom-16 right-1/4 w-3 h-3 bg-white rounded-full animate-pulse delay-700 blur-[1px]"></div>
    </div>
  );
};

export default SectionDivider;
import React, { useState, useRef, useEffect } from 'react';
import { getSantaChatResponse } from '../services/geminiService';

interface Message {
  id: number;
  sender: 'santa' | 'user';
  text: string;
}

// Pre-written jokes for fallback or instant replies
const SANTA_JOKES = [
  "What do you call a snowman with a six-pack? An abdominal snowman!",
  "Why does Santa go down the chimney? Because it soots him!",
  "What do elves learn in school? The Elf-abet!",
  "What do you call a broke Santa? Saint Nickel-less!",
  "Who is Santa's favorite singer? Elf-is Presley!",
];

const SantaChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'santa', text: "Ho ho ho! Merry Christmas! I'm taking a break from the workshop. Ask Santa anything!" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    // 1. Add User Message
    const newUserMsg: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    // 2. Determine Response Strategy
    // Check if user specifically asked for a joke and we want to use a local one for speed
    // otherwise, we let the AI handle everything for better personality.
    // For this implementation, we will pass everything to AI to maintain persona, 
    // unless the AI fails.

    try {
        const aiResponse = await getSantaChatResponse(userText);
        
        const newSantaMsg: Message = { 
            id: Date.now() + 1, 
            sender: 'santa', 
            text: aiResponse 
        };
        setMessages(prev => [...prev, newSantaMsg]);
    } catch (err) {
        // Fallback if AI fails
        setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            sender: 'santa', 
            text: "Oh deer! My connection to the North Pole is frozen. " + SANTA_JOKES[0] 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* CHAT WINDOW */}
      <div 
        className={`pointer-events-auto mb-4 w-[320px] sm:w-[350px] bg-white/90 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right transform ${
            isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-santa-red to-santa-dark p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-santa-gold relative overflow-hidden">
                    <img 
                        src="https://img.icons8.com/color/96/santa.png" 
                        alt="Santa" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-white font-serif font-bold leading-none">Santa Claus</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-white/80 uppercase tracking-wider">Online at North Pole</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={toggleChat} 
                className="text-white/60 hover:text-white transition-colors"
            >
                <i className="fa-solid fa-xmark text-xl"></i>
            </button>
        </div>

        {/* Messages Area */}
        <div className="h-[350px] overflow-y-auto p-4 bg-gray-50/50 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.sender === 'user' 
                                ? 'bg-santa-red text-white rounded-br-none' 
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Santa something..."
                className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-santa-gold focus:ring-0 rounded-full px-4 py-2 text-sm transition-all outline-none text-gray-700"
            />
            <button 
                type="submit"
                className="w-10 h-10 bg-santa-gold hover:bg-yellow-400 text-santa-dark rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                disabled={!input.trim() || isTyping}
            >
                <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
        </form>
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`pointer-events-auto relative w-16 h-16 rounded-full shadow-[0_4px_20px_rgba(212,36,38,0.5)] flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50 bg-gradient-to-br from-santa-red to-santa-dark border-2 border-white/20 ${isOpen ? 'rotate-90 opacity-0 pointer-events-none hidden' : 'rotate-0 opacity-100'}`}
      >
        {/* Glow Ring */}
        <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"></span>
        
        {/* Santa Icon Image */}
        <div className="w-10 h-10 overflow-hidden relative drop-shadow-md">
            <img 
                src="https://img.icons8.com/color/96/santa.png" 
                alt="Chat with Santa"
                className="w-full h-full object-cover" 
            />
        </div>

        {/* "Chat" Badge for explicit clarity */}
        <div className="absolute -top-1 -right-1 bg-santa-gold text-santa-dark text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white/30 animate-bounce">
            CHAT
        </div>

        {/* Tooltip / Callout */}
        <div 
            className={`absolute right-full mr-4 bg-white text-santa-dark text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap transition-all duration-300 transform origin-right ${
                isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4 pointer-events-none'
            }`}
        >
            Ask me anything!
            {/* Tiny Triangle */}
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white transform -translate-y-1/2 rotate-45"></div>
        </div>
      </button>

    </div>
  );
};

export default SantaChat;
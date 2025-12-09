import React, { useState, useRef } from 'react';
import { GeneratorStatus, GalleryItem } from '../types';
import { santafyImage } from '../services/geminiService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface SantafyProps {
  onAddToGallery: (item: GalleryItem) => void;
}

const Santafy: React.FC<SantafyProps> = ({ onAddToGallery }) => {
  const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [isPosted, setIsPosted] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // No longer needed for reliable mobile input, but keeping ref for reset
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setStatus(GeneratorStatus.IDLE);
        setResultImage(null);
        setIsPosted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSantafy = async () => {
    if (!preview || status === GeneratorStatus.LOADING) return;

    setStatus(GeneratorStatus.LOADING);
    try {
      const base64Data = preview.split(',')[1];
      const generatedUrl = await santafyImage(base64Data);
      setResultImage(generatedUrl);
      setStatus(GeneratorStatus.SUCCESS);
    } catch (e) {
      console.error(e);
      setStatus(GeneratorStatus.ERROR);
    }
  };

  const handlePostToWall = async () => {
    if (!resultImage) return;
    
    setIsPosting(true);
    const handle = twitterHandle || '@SantafiedElf';

    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured (Demo Mode)");
      }

      // 1. Convert Base64 result to Blob for upload
      const response = await fetch(resultImage);
      const blob = await response.blob();
      
      const fileName = `santafy_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
      
      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('christmas-images')
        .upload(fileName, blob);
        
      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('christmas-images')
        .getPublicUrl(fileName);

      // 4. Insert into Database
      const { data: insertData, error: insertError } = await supabase
        .from('gallery')
        .insert([{ url: publicUrl, handle: handle }])
        .select();
        
      if (insertError) throw insertError;

      // 5. Update UI with real data
      if (insertData && insertData.length > 0) {
        onAddToGallery(insertData[0] as GalleryItem);
      } else {
        onAddToGallery({ url: publicUrl, handle: handle });
      }

      setIsPosted(true);

    } catch (error) {
      console.warn("Backend error or Demo Mode. Using local fallback.", error);
      
      // Fallback: Add to local gallery even if backend fails (Demo experience)
      onAddToGallery({
        url: resultImage, // Use the base64 string directly
        handle: handle,
        id: 'temp-' + Date.now()
      });
      
      setIsPosted(true);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <section id="santafy" className="px-4 relative z-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span className="text-white/70 font-bold tracking-[0.3em] text-xs uppercase mb-4 block">AI Powered Workshop</span>
          <h2 className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg">
            Santafy <span className="text-santa-gold italic">Yourself</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* UPLOAD CARD */}
          <div className="glass-card-dark p-8 md:p-12 transition-all hover:bg-black/50 relative z-20">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
               <span className="text-4xl font-serif text-white/20">01</span>
               <h3 className="text-xl font-bold text-white tracking-wide">Upload Photo</h3>
            </div>
            
            <div className="bg-white/5 rounded-lg border border-white/10 hover:border-white/30 transition-colors min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden group">
              {preview ? (
                <div className="relative w-full h-full p-4 flex items-center justify-center">
                  <img src={preview} alt="Original" className="max-h-[300px] w-auto object-contain rounded shadow-2xl" />
                  <button 
                    onClick={() => { setPreview(null); setStatus(GeneratorStatus.IDLE); }}
                    className="absolute top-4 right-4 bg-black/50 text-white rounded-full w-8 h-8 hover:bg-red-500 transition-colors flex items-center justify-center backdrop-blur-md z-30"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center p-10">
                  <i className="fa-solid fa-image text-4xl text-white/20 mb-4 group-hover:text-santa-gold transition-colors"></i>
                  <p className="text-lg font-medium text-white/60">Tap to Select Image</p>
                  
                  {/* RELIABLE MOBILE INPUT FIX: Transparent input covering the entire area */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                    title="Upload an image"
                  />
                </div>
              )}
            </div>

            {preview && status !== GeneratorStatus.SUCCESS && (
               <button 
                onClick={handleSantafy}
                disabled={status === GeneratorStatus.LOADING}
                className={`mt-8 w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all relative z-30 ${
                  status === GeneratorStatus.LOADING 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-santa-gold to-yellow-400 text-black hover:shadow-glow'
                }`}
              >
                {status === GeneratorStatus.LOADING ? 'Processing...' : 'Generate Magic'}
              </button>
            )}
          </div>

          {/* RESULT CARD */}
          <div className="glass-card-dark p-8 md:p-12 border-santa-gold/30 relative z-20">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
               <span className="text-4xl font-serif text-santa-gold/50">02</span>
               <h3 className="text-xl font-bold text-white tracking-wide">Your Result</h3>
            </div>

            <div className="bg-black/20 rounded-lg min-h-[350px] flex items-center justify-center relative overflow-hidden border border-white/5">
               {status === GeneratorStatus.IDLE && !resultImage && (
                  <p className="text-white/30 font-serif italic text-lg">Magic happens here...</p>
               )}

               {status === GeneratorStatus.LOADING && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-santa-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                  </div>
               )}

               {resultImage && (
                  <div className="w-full h-full p-2 animate-in fade-in duration-700">
                     <img src={resultImage} alt="Santafied" className="w-full h-full object-contain rounded shadow-2xl" />
                  </div>
               )}
            </div>

            {resultImage && (
               <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-30">
                 
                 <div className="space-y-2">
                    <label className="text-santa-gold text-xs font-bold uppercase tracking-widest ml-4 block opacity-80">
                      Claim your masterpiece
                    </label>
                    <div className="group relative bg-black/40 rounded-full flex items-center border border-white/10 focus-within:border-santa-gold transition-colors p-1">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-santa-gold group-focus-within:text-white transition-colors">
                          <i className="fa-brands fa-twitter text-xl"></i>
                        </div>
                        <input 
                            type="text" 
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value)}
                            placeholder="@username"
                            className="bg-transparent border-none outline-none text-white px-4 flex-1 placeholder-white/20 font-medium h-full"
                            disabled={isPosted || isPosting}
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handlePostToWall}
                      disabled={isPosted || isPosting}
                      className={`relative overflow-hidden py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                        isPosted 
                          ? 'bg-green-600 text-white shadow-none cursor-default border border-green-500' 
                          : isPosting 
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-white text-santa-dark hover:bg-gray-100 shadow-lg hover:shadow-glow'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isPosted ? (
                          <>
                            <i className="fa-solid fa-check-circle text-lg animate-bounce"></i>
                            <span>Posted!</span>
                          </>
                        ) : isPosting ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-share-nodes"></i>
                            <span>Share to Wall</span>
                          </>
                        )}
                      </div>
                    </button>

                    <a 
                      href={resultImage} 
                      download="santafied_meme.png"
                      className="flex items-center justify-center gap-2 py-4 rounded-full font-bold text-sm uppercase tracking-widest text-center border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      <i className="fa-solid fa-download"></i>
                      <span>Download</span>
                    </a>
                 </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Santafy;
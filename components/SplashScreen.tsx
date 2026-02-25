import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppScreen } from '../types';
import { Button } from './Button';
import { Icons } from './Icons';

interface SplashScreenProps {
  setScreen: (screen: AppScreen) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ setScreen }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Initializing creative engine...");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadingMessages = [
    "Summoning ancient Benin bronzes...",
    "Weaving Ndebele patterns...",
    "Sculpting Nok terracotta textures...",
    "Mixing ochre and indigo pigments...",
    "Polishing the 4K cinematic lighting...",
    "Adding the final amber glow...",
    "Rendering your masterpiece..."
  ];

  useEffect(() => {
    if (isGenerating) {
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMessage(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const generateVideo = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // 1. Check/Get API Key
      if (typeof window !== 'undefined' && (window as any).aistudio) {
          if (!await (window as any).aistudio.hasSelectedApiKey()) {
             await (window as any).aistudio.openSelectKey();
          }
      }
      
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
         throw new Error("API Key not found. Please select a paid API key.");
      }

      // Create new instance to ensure fresh key
      const ai = new GoogleGenAI({ apiKey });

      // 2. Fetch and encode logo
      const logoResponse = await fetch('/assets/logos/gogreen-white-logomark.png');
      if (!logoResponse.ok) throw new Error("Failed to load logo asset.");
      const logoBlob = await logoResponse.blob();
      const base64Logo = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); 
        };
        reader.readAsDataURL(logoBlob);
      });

      // 3. Call Veo
      const prompt = "A high-speed art speedrun of traditional African art—Benin bronzes, Nok terracotta, and Ndebele patterns—flickering rapidly in the background. Let the textures and vibrant ochre and indigo colors swirl together and morph into the provided logo at the center. Make the reveal cinematic with 4K lighting and organic motion. Add a subtle amber glow to the logo as it fully forms.";

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '9:16',
          lastFrame: {
            imageBytes: base64Logo,
            mimeType: 'image/png',
          }
        }
      });

      // 4. Poll
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
          throw new Error(operation.error.message);
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("No video URI returned.");

      // 5. Fetch video blob
      const videoResponse = await fetch(videoUri, {
        headers: {
            'x-goog-api-key': apiKey
        }
      });
      
      if (!videoResponse.ok) throw new Error("Failed to download video.");
      
      const videoBlob = await videoResponse.blob();
      const localUrl = URL.createObjectURL(videoBlob);
      
      setVideoUrl(localUrl);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate video.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoEnd = () => {
      setScreen(AppScreen.ONBOARDING_1);
  };

  return (
    <div className="flex-1 flex flex-col bg-black items-center justify-center relative overflow-hidden h-screen w-full">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#051a08] to-black" />

        <div className="z-10 w-full h-full flex flex-col items-center justify-center p-6">
            
            {videoUrl ? (
                <video 
                    ref={videoRef}
                    src={videoUrl} 
                    className="w-full h-full object-cover absolute inset-0" 
                    autoPlay 
                    muted 
                    playsInline
                    onEnded={handleVideoEnd}
                />
            ) : (
                <div className="flex flex-col items-center text-center space-y-8 max-w-md relative z-20">
                    <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-sm">
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="Logo" className="w-12 h-12 opacity-80" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            {isGenerating ? "Creating Magic..." : "Welcome to GoGreen"}
                        </h1>
                        <p className="text-white/40 font-medium">
                            {isGenerating ? loadingMessage : "Experience the future of crypto with a cinematic intro."}
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {!isGenerating && (
                        <div className="flex flex-col gap-3 w-full">
                            <Button onClick={generateVideo} className="w-full py-6 text-lg shadow-[0_0_30px_rgba(46,139,58,0.3)]">
                                <Icons.Sparkles className="mr-2 w-5 h-5" />
                                Generate Cinematic Intro
                            </Button>
                            <button 
                                onClick={() => setScreen(AppScreen.ONBOARDING_1)}
                                className="text-white/30 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors py-4"
                            >
                                Skip Intro
                            </button>
                        </div>
                    )}
                    
                    {isGenerating && (
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-progress-indeterminate" />
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

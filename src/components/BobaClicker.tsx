
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CupSoda } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BobaClickerProps {
  bobaPerClick: number;
  onBobaMade: (amount: number) => void;
}

const BobaClicker: React.FC<BobaClickerProps> = ({ bobaPerClick, onBobaMade }) => {
  const cupRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [clickScale, setClickScale] = useState(1);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Create bubbles when clicked
  const createBubble = (x: number, y: number) => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Randomize bubble properties
    const size = Math.random() * 10 + 5;
    const left = x - size/2;
    const duration = Math.random() * 2 + 1;
    const delay = Math.random() * 0.5;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}px`;
    bubble.style.bottom = `${y}px`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    
    if (cupRef.current) {
      cupRef.current.appendChild(bubble);
      setTimeout(() => {
        bubble.remove();
      }, (duration + delay) * 1000);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickScale(0.95);
    setTimeout(() => setClickScale(1), 150);
    
    onBobaMade(bobaPerClick);
    
    // Create multiple bubbles on click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.bottom - e.clientY;
    
    // Create 3-6 bubbles with each click
    const bubbleCount = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < bubbleCount; i++) {
      const offsetX = x + (Math.random() * 40 - 20);
      createBubble(offsetX, y);
    }
    
    // Show special toast for rapid clicking
    const now = Date.now();
    if (now - lastClickTime < 300) {
      // Random chance for encouraging toast on rapid clicks
      if (Math.random() < 0.1) {
        const messages = [
          "Tapping like a pro!",
          "You're on fire!",
          "Boba master!",
          "Keep it up!",
          "Brewing excellence!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        toast({
          title: randomMessage,
          duration: 1500,
        });
      }
    }
    setLastClickTime(now);
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel animate-slide-up rounded-3xl overflow-hidden">
      <CardContent className="p-0 relative">
        <div 
          ref={cupRef}
          onClick={handleClick}
          className="relative overflow-hidden h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 bg-gradient-to-b from-boba-milk to-boba-caramel/10"
          style={{ transform: `scale(${clickScale})` }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Particles are created dynamically on click */}
          </div>
          
          <div className="transition-transform hover:scale-105 duration-300 z-10">
            <CupSoda size={80} className="text-boba-brown mb-3 animate-float" />
          </div>
          
          <div className="bg-background/90 backdrop-blur-sm rounded-full px-5 py-2 text-lg font-medium flex items-center gap-1.5 z-10 shimmer-effect">
            <span className="text-boba-brown">+{bobaPerClick}</span>
            <CupSoda size={16} className="text-boba-caramel" />
          </div>
          
          <p className="absolute bottom-4 text-xs text-center text-boba-brown/70 px-8 font-medium">
            Tap to brew boba tea!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BobaClicker;

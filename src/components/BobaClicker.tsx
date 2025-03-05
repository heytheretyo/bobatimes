import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CupSoda } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BobaClickerProps {
  bobaPerClick: number;
  onBobaMade: (amount: number) => void;
}

const BobaClicker: React.FC<BobaClickerProps> = ({
  bobaPerClick,
  onBobaMade,
}) => {
  const cupRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [clickScale, setClickScale] = useState(1);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio("/sound/click.wav");
    clickSoundRef.current.load();

    return () => {
      // Clean up timeouts on unmount
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, []);

  const shakeScreen = (intensity = 1) => {
    if (!containerRef.current) return;

    containerRef.current.style.animation = "none";
    void containerRef.current.offsetHeight; // Trigger reflow
    containerRef.current.style.animation = `shake ${
      0.2 * intensity
    }s cubic-bezier(.36,.07,.19,.97) both`;
  };

  // Haptic feedback (if supported)
  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const createFloatingNumber = (x: number, y: number) => {
    if (!containerRef.current) return;

    const floater = document.createElement("div");
    floater.className =
      "absolute pointer-events-none text-boba-brown font-bold text-opacity-80 z-20";
    floater.textContent = `+${bobaPerClick.toFixed(1)}`;

    // Random position around click
    const offsetX = (Math.random() - 0.5) * 40;
    floater.style.left = `${x + offsetX}px`;
    floater.style.top = `${y - 10}px`;
    floater.style.transform = "translate(-50%, -50%)";

    // Add animation class
    floater.classList.add("animate-float-number");

    containerRef.current.appendChild(floater);
    setTimeout(() => {
      floater.remove();
    }, 1000);
  };

  // Create bubbles when clicked
  const createBubble = (x: number, y: number, isSplash = false) => {
    const bubble = document.createElement("div");

    // Different class for splash bubbles vs rising bubbles
    bubble.className = isSplash ? "splash-bubble" : "bubble";

    // Randomize bubble properties
    const size = isSplash
      ? Math.random() * 25 + 10 // Larger for splash
      : Math.random() * 15 + 5; // Normal for rising

    const duration = isSplash
      ? Math.random() * 0.8 + 0.4 // Faster for splash
      : Math.random() * 2 + 1; // Normal for rising

    const delay = isSplash
      ? Math.random() * 0.1 // Almost immediate for splash
      : Math.random() * 0.5; // Delayed for rising

    // Color variations - more vibrant for splash
    const hue = Math.floor(Math.random() * 30) + 20; // Brown-ish hues
    const saturation = isSplash ? "80%" : "70%";
    const lightness = isSplash ? "65%" : "60%";
    const opacity = isSplash ? 0.9 : 0.7;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x}px`;

    if (isSplash) {
      bubble.style.top = `${y}px`;

      // Random direction for splash
      const angle = Math.random() * Math.PI * 2; // 0 to 2π
      const distance = Math.random() * 80 + 20; // 20-100px

      // Set data attributes for animation
      bubble.dataset.angle = angle.toString();
      bubble.dataset.distance = distance.toString();
    } else {
      bubble.style.bottom = `${y}px`;
    }

    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.backgroundColor = `hsla(${hue}, ${saturation}, ${lightness}, ${opacity})`;

    if (isSplash) {
      // Get the angle and distance from data attributes
      const angle = Number.parseFloat(bubble.dataset.angle || "0");
      const distance = Number.parseFloat(bubble.dataset.distance || "0");

      // Calculate the target position
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      // Set CSS variables for the animation
      bubble.style.setProperty("--tx", `${tx}px`);
      bubble.style.setProperty("--ty", `${ty}px`);
    } else {
      // For regular bubbles, add random rotation
      const rotation = Math.random() * 360;
      bubble.style.setProperty("--rotate-deg", `${rotation}deg`);
    }

    if (cupRef.current) {
      cupRef.current.appendChild(bubble);
      setTimeout(() => {
        bubble.remove();
      }, (duration + delay) * 1000);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickScale(0.95);
    if (cupRef.current) {
      cupRef.current.classList.add("click-glow");
      setTimeout(() => {
        if (cupRef.current) {
          cupRef.current.classList.remove("click-glow");
        }
      }, 300);
    }

    setTimeout(() => setClickScale(1), 150);

    onBobaMade(bobaPerClick);

    // Play sound on every click without getting interrupted
    // Ignore autoplay restrictions

    // Create multiple bubbles on click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (clickSoundRef.current) {
      const clickSound = clickSoundRef.current.cloneNode() as HTMLAudioElement;
      clickSound.playbackRate = 0.9 + Math.random() * 0.4; // Random pitch between 0.9-1.1
      clickSound.volume = 0.6 + Math.random() * 0.3;
      clickSound.preservesPitch = false;
      clickSound.play().catch(() => {}); // Ignore autoplay restrictions
    }

    createFloatingNumber(x, y);

    const rectClick = e.currentTarget.getBoundingClientRect();
    const width = rectClick.width;
    const height = rectClick.height;

    // Create regular rising bubbles
    const bubbleCount = Math.floor(Math.random() * 8) + 7; // 7-14 bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const randomX = Math.random() * width;
      const randomY = height + Math.random() * 20; // Start slightly below the bottom
      createBubble(randomX, randomY, false);
    }

    triggerHapticFeedback();

    const now = Date.now();
    if (now - lastClickTime < 500) {
      // 500ms window for combos
      setComboCount((prev) => prev + 1);

      // Clear existing timeout
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }

      // If combo reaches threshold, trigger special effects
      if (comboCount >= 3) {
        // Play combo sound
        // if (comboSoundRef.current) {
        //   comboSoundRef.current.currentTime = 0;
        //   comboSoundRef.current.play().catch(() => {});
        // }

        // Stronger screen shake for combos
        shakeScreen(1.5);

        // Special toast for combos
        if (comboCount === 3 || comboCount % 5 === 0) {
          const comboMessages = [
            `${comboCount}x Combo!`,
            "Boba Frenzy!",
            "Tea-rrific!",
            "Bubble Master!",
            "Brewing Madness!",
          ];

          toast({
            title:
              comboMessages[Math.floor(Math.random() * comboMessages.length)],
            description: `${comboCount} clicks in rapid succession!`,
            duration: 2000,
          });
        }
      } else {
        // Light screen shake for normal clicks
        shakeScreen(0.8);
      }
    } else {
      // Reset combo if too slow
      setComboCount(1);
      shakeScreen(0.5);
    }

    // Set timeout to reset combo
    comboTimeoutRef.current = setTimeout(() => {
      setComboCount(0);
    }, 2100);

    setLastClickTime(now);
  };

  return (
    <Card className="w-full max-w-md mx-auto select-none glass-panel animate-slide-up rounded-3xl overflow-hidden">
      <CardContent className="p-0 relative">
        <div ref={containerRef} className="relative">
          <div
            ref={cupRef}
            onClick={handleClick}
            className="relative overflow-hidden h-64 flex flex-col items-center  rounded-md justify-center cursor-pointer transition-all duration-150 bg-gradient-to-b from-boba-milk to-boba-caramel/10"
            style={{ transform: `scale(${clickScale})` }}
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Particles are created dynamically on click */}
            </div>

            <div className="transition-transform hover:scale-105 duration-300 z-10">
              <CupSoda
                size={80}
                className="text-boba-brown mb-3 animate-float"
              />
            </div>

            <div
              className={`bg-background/90 backdrop-blur-sm rounded-full px-5 py-2 text-lg font-medium flex items-center gap-1.5 z-10 shimmer-effect ${
                comboCount >= 5 ? "animate-pulse" : ""
              }`}
            >
              <span className="text-boba-brown">
                +{bobaPerClick.toFixed(1)}
              </span>
              <CupSoda size={16} className="text-boba-caramel" />
              {comboCount >= 3 && (
                <span className="ml-1 text-sm text-boba-caramel font-bold animate-pulse">
                  {comboCount}x
                </span>
              )}
            </div>

            <p className="absolute bottom-4 text-xs text-center text-boba-brown/70 px-8 font-medium">
              Tap to brew boba tea!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BobaClicker;

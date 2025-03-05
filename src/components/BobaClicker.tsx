import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CupSoda } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BobaClickerProps {
  bobaPerClick: number;
  onBobaMade: (amount: number) => void;
}

const BobaClicker: React.FC<BobaClickerProps> = React.memo(
  ({ bobaPerClick, onBobaMade }) => {
    const cupRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [clickScale, setClickScale] = useState(1);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [comboCount, setComboCount] = useState(0);
    const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const clickSoundRef = useRef<HTMLAudioElement | null>(null);

    // Memoize combo messages to prevent recreation on each render
    const comboMessages = useMemo(
      () => [
        `{count}x Combo!`,
        "Boba Frenzy!",
        "Tea-rrific!",
        "Bubble Master!",
        "Brewing Madness!",
      ],
      []
    );

    useEffect(() => {
      // Lazy load audio to improve initial render performance
      const loadAudio = () => {
        if (!clickSoundRef.current) {
          clickSoundRef.current = new Audio("/sound/click.wav");
          clickSoundRef.current.load();
        }
      };

      // Use requestIdleCallback for non-critical audio loading
      const handle = window.requestIdleCallback(loadAudio);

      return () => {
        window.cancelIdleCallback(handle);
        if (comboTimeoutRef.current) {
          clearTimeout(comboTimeoutRef.current);
        }
      };
    }, []);

    // Memoize to prevent unnecessary recreations
    const shakeScreen = useCallback((intensity = 1) => {
      if (!containerRef.current) return;

      containerRef.current.style.animation = "none";
      void containerRef.current.offsetHeight; // Trigger reflow
      containerRef.current.style.animation = `shake ${
        0.2 * intensity
      }s cubic-bezier(.36,.07,.19,.97) both`;
    }, []);

    // Optimize haptic feedback
    const triggerHapticFeedback = useCallback(() => {
      navigator.vibrate?.(30);
    }, []);

    // Memoize bubble and floating number creation
    const createFloatingNumber = useCallback(
      (x: number, y: number) => {
        if (!containerRef.current) return;

        const floater = document.createElement("div");
        floater.className =
          "absolute pointer-events-none text-boba-brown font-bold text-opacity-80 z-20";
        floater.textContent = `+${bobaPerClick.toFixed(1)}`;

        const offsetX = (Math.random() - 0.5) * 40;
        floater.style.left = `${x + offsetX}px`;
        floater.style.top = `${y - 10}px`;
        floater.style.transform = "translate(-50%, -50%)";
        floater.classList.add("animate-float-number");

        containerRef.current.appendChild(floater);
        setTimeout(() => floater.remove(), 1000);
      },
      [bobaPerClick]
    );

    // Optimize bubble creation with reduced complexity
    const createBubble = useCallback(
      (x: number, y: number, isSplash = false) => {
        if (!cupRef.current) return;

        const bubble = document.createElement("div");
        bubble.className = isSplash ? "splash-bubble" : "bubble";

        const size = isSplash
          ? Math.random() * 25 + 10
          : Math.random() * 15 + 5;
        const duration = isSplash
          ? Math.random() * 0.8 + 0.4
          : Math.random() * 2 + 1;
        const delay = isSplash ? Math.random() * 0.1 : Math.random() * 0.5;

        const hue = Math.floor(Math.random() * 30) + 20;
        const saturation = isSplash ? "80%" : "70%";
        const lightness = isSplash ? "65%" : "60%";
        const opacity = isSplash ? 0.9 : 0.7;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${x}px`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;
        bubble.style.backgroundColor = `hsla(${hue}, ${saturation}, ${lightness}, ${opacity})`;

        if (isSplash) {
          bubble.style.top = `${y}px`;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80 + 20;

          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;

          bubble.style.setProperty("--tx", `${tx}px`);
          bubble.style.setProperty("--ty", `${ty}px`);
        } else {
          bubble.style.bottom = `${y}px`;
          const rotation = Math.random() * 360;
          bubble.style.setProperty("--rotate-deg", `${rotation}deg`);
        }

        cupRef.current.appendChild(bubble);
        setTimeout(() => bubble.remove(), (duration + delay) * 1000);
      },
      []
    );

    // Optimize click handler with useCallback
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        setClickScale(0.95);
        setTimeout(() => setClickScale(1), 150);

        onBobaMade(bobaPerClick);

        // Optimize sound playing
        if (clickSoundRef.current) {
          const clickSound =
            clickSoundRef.current.cloneNode() as HTMLAudioElement;
          clickSound.playbackRate = 0.9 + Math.random() * 0.4;
          clickSound.volume = 0.6 + Math.random() * 0.3;
          clickSound.preservesPitch = false;
          clickSound.play().catch(() => {});
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createFloatingNumber(x, y);

        const width = rect.width;
        const height = rect.height;

        // Reduce bubble creation overhead
        const bubbleCount = Math.floor(Math.random() * 8) + 7;
        for (let i = 0; i < bubbleCount; i++) {
          const randomX = Math.random() * width;
          const randomY = height + Math.random() * 20;
          createBubble(randomX, randomY, false);
        }

        triggerHapticFeedback();

        const now = Date.now();
        if (now - lastClickTime < 500) {
          setComboCount((prev) => {
            const newComboCount = prev + 1;

            if (comboTimeoutRef.current) {
              clearTimeout(comboTimeoutRef.current);
            }

            if (newComboCount >= 3) {
              shakeScreen(newComboCount >= 5 ? 1.5 : 1);

              if (newComboCount === 3 || newComboCount % 5 === 0) {
                toast({
                  title: comboMessages[
                    Math.floor(Math.random() * comboMessages.length)
                  ].replace("{count}", newComboCount.toString()),
                  description: `${newComboCount} clicks in rapid succession!`,
                  duration: 2000,
                });
              }
            } else {
              shakeScreen(0.8);
            }

            return newComboCount;
          });
        } else {
          setComboCount(1);
          shakeScreen(0.5);
        }

        comboTimeoutRef.current = setTimeout(() => {
          setComboCount(0);
        }, 2100);

        setLastClickTime(now);
      },
      [
        bobaPerClick,
        onBobaMade,
        lastClickTime,
        createFloatingNumber,
        createBubble,
        triggerHapticFeedback,
        shakeScreen,
        toast,
        comboMessages,
      ]
    );

    return (
      <Card className="w-full max-w-md mx-auto select-none glass-panel animate-slide-up rounded-3xl overflow-hidden">
        <CardContent className="p-0 relative">
          <div ref={containerRef} className="relative">
            <div
              ref={cupRef}
              onClick={handleClick}
              className="relative overflow-hidden h-64 flex flex-col items-center rounded-md justify-center cursor-pointer transition-all duration-150 bg-gradient-to-b from-boba-milk to-boba-caramel/10"
              style={{ transform: `scale(${clickScale})` }}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

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
  }
);

export default BobaClicker;

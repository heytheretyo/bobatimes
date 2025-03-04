import React, { useState, useEffect, useRef } from "react";
import {
  Coffee,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

type TimerMode = "focus" | "break";

interface BobaTimerProps {
  onTimerComplete: (mode: TimerMode) => void;
}

const BobaTimer: React.FC<BobaTimerProps> = ({ onTimerComplete }) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const timerRef = useRef<number | null>(null);
  const initialTimeRef = useRef(25 * 60);
  const completionSoundRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    completionSoundRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    const totalTime = initialTimeRef.current;
    const progressValue = (timeLeft / totalTime) * 100;
    setProgress(progressValue);
  }, [timeLeft]);

  const handleTimerComplete = () => {
    if (soundEnabled && completionSoundRef.current) {
      completionSoundRef.current
        .play()
        .catch((err) => console.error("Error playing sound:", err));
    }

    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      setMode("break");
      initialTimeRef.current = 5 * 60; // 5 minute break
      setTimeLeft(5 * 60);
      toast({
        title: "Focus session complete!",
        description: "Time for a short break.",
        duration: 3000,
      });
    } else {
      setMode("focus");
      initialTimeRef.current = 25 * 60; // Back to 25 minutes
      setTimeLeft(25 * 60);
      toast({
        title: "Break time over!",
        description: "Ready for another focus session?",
        duration: 3000,
      });
    }

    onTimerComplete(mode);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current!);
    setTimeLeft(initialTimeRef.current);
    setIsRunning(false);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden glass-panel animate-scale-up rounded-3xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div
              className={`p-2 rounded-full ${
                mode === "focus"
                  ? "bg-boba-brown/10 text-boba-brown"
                  : "bg-boba-caramel/10 text-boba-caramel"
              }`}
            >
              {mode === "focus" ? <Coffee size={20} /> : <Check size={20} />}
            </div>
            <h2 className="text-lg font-medium tracking-tight">
              {mode === "focus" ? "Focus Time" : "Break Time"}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSound}
                    className="rounded-full h-8 w-8"
                  >
                    {soundEnabled ? (
                      <Volume2 size={16} />
                    ) : (
                      <VolumeX size={16} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{soundEnabled ? "Mute" : "Unmute"} notification sound</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="bg-secondary/80 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {completedSessions} completed
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center py-8">
          <div className="timer-display mb-3 animate-fade-in">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="btn-boba-primary flex-1  "
          >
            {isRunning ? (
              <Pause size={18} className="mr-2" />
            ) : (
              <Play size={18} className="mr-2" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="btn-boba-secondary flex-1"
          >
            <RotateCcw size={18} className="mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BobaTimer;

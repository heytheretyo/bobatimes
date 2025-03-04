"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Coffee,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Check,
  CloudRain,
  Settings,
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
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TimerMode = "focus" | "break";

interface BobaTimerProps {
  onTimerComplete: (mode: TimerMode, reward: number) => void;
}

const BobaTimer: React.FC<BobaTimerProps> = ({ onTimerComplete }) => {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [rainSoundPlaying, setRainSoundPlaying] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const timerRef = useRef<number | null>(null);
  const initialTimeRef = useRef(25 * 60);
  const completionSoundRef = useRef<HTMLAudioElement | null>(null);
  const rainSoundRef = useRef<HTMLAudioElement | null>(null);
  const sessionStartTimeRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    completionSoundRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
    );
    rainSoundRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3"
    );
    if (rainSoundRef.current) {
      rainSoundRef.current.loop = true;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rainSoundRef.current) rainSoundRef.current.pause();
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      if (sessionStartTimeRef.current === null) {
        sessionStartTimeRef.current = Date.now();
      }
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

  const calculateReward = (sessionDurationMinutes: number): number => {
    // Base reward: 5 boba per minute
    const baseReward = 5 * sessionDurationMinutes;

    // Bonus for longer sessions: 1 extra boba per minute for sessions over 15 minutes
    const bonusReward =
      sessionDurationMinutes > 15 ? sessionDurationMinutes - 15 : 0;

    // Total reward
    return baseReward + bonusReward;
  };

  const handleTimerComplete = () => {
    if (soundEnabled && completionSoundRef.current) {
      completionSoundRef.current
        .play()
        .catch((err) => console.error("Error playing sound:", err));
    }

    const sessionEndTime = Date.now();
    const sessionDurationMinutes = sessionStartTimeRef.current
      ? Math.round((sessionEndTime - sessionStartTimeRef.current) / 60000)
      : 0;

    const reward = calculateReward(sessionDurationMinutes);

    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      setMode("break");
      initialTimeRef.current = breakDuration * 60;
      setTimeLeft(breakDuration * 60);
      toast({
        title: "Focus session complete!",
        description: `You've earned ${reward} boba! Time for a short break.`,
        duration: 3000,
      });
    } else {
      setMode("focus");
      initialTimeRef.current = focusDuration * 60;
      setTimeLeft(focusDuration * 60);
      toast({
        title: "Break time over!",
        description: "Ready for another focus session?",
        duration: 3000,
      });
    }

    onTimerComplete(mode, reward);
    sessionStartTimeRef.current = null;
  };

  const toggleTimer = () => {
    if (!isRunning && sessionStartTimeRef.current === null) {
      sessionStartTimeRef.current = Date.now();
    }
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current!);
    setTimeLeft(initialTimeRef.current);
    setIsRunning(false);
    sessionStartTimeRef.current = null;
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const toggleRainSound = () => {
    if (rainSoundRef.current) {
      if (rainSoundPlaying) {
        rainSoundRef.current.pause();
      } else {
        rainSoundRef.current
          .play()
          .catch((err) => console.error("Error playing rain sound:", err));
      }
      setRainSoundPlaying(!rainSoundPlaying);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleFocusDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setFocusDuration(newDuration);
    if (mode === "focus") {
      initialTimeRef.current = newDuration * 60;
      setTimeLeft(newDuration * 60);
    }
  };

  const handleBreakDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setBreakDuration(newDuration);
    if (mode === "break") {
      initialTimeRef.current = newDuration * 60;
      setTimeLeft(newDuration * 60);
    }
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleRainSound}
                    className={`rounded-full h-8 w-8 ${
                      rainSoundPlaying ? "bg-boba-brown/10" : ""
                    }`}
                  >
                    <CloudRain size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{rainSoundPlaying ? "Stop" : "Play"} rain sound</p>
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
            className="btn-boba-primary flex-1"
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

        <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Settings size={16} className="mr-2" />
                Change Timer Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Focus Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the duration for focus sessions (in minutes)
                  </p>
                </div>
                <Slider
                  value={[focusDuration]}
                  onValueChange={handleFocusDurationChange}
                  max={60}
                  min={1}
                  step={1}
                />
                <div>{focusDuration} minutes</div>
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Break Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the duration for break sessions (in minutes)
                  </p>
                </div>
                <Slider
                  value={[breakDuration]}
                  onValueChange={handleBreakDurationChange}
                  max={30}
                  min={1}
                  step={1}
                />
                <div>{breakDuration} minutes</div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default BobaTimer;

import React, { useState, useEffect, useRef } from "react";
import BobaTimer from "@/components/BobaTimer";
import BobaClicker from "@/components/BobaClicker";
import BobaShop from "@/components/BobaShop";
import StatisticsPanel from "@/components/StatisticsPanel";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ArrowBigRightDashIcon, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ChallengeList from "@/components/ChallengeList";
import { Challenge, initialChallenges } from "@/lib/challenges";

const Index = () => {
  const [bobaCount, setBobaCount] = useState(0);
  const [bobaPerClick, setBobaPerClick] = useState(1);
  const [passiveBobaRate, setPassiveBobaRate] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [challengesCompleted, setCompletedChallenges] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [bobaGoal, setBobaGoal] = useState(1000);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [totalBoba, setTotalBoba] = useState(0);
  const [upgrades, setUpgrades] = useState({
    tapioca: 1,
    staff: 0,
    marketing: 0,
  });
  const { toast } = useToast();
  const passiveTimerRef = useRef<number | null>(null);

  // Initialize passive income timer
  useEffect(() => {
    passiveTimerRef.current = window.setInterval(() => {
      if (passiveBobaRate > 0) {
        setBobaCount((prev) => {
          const newAmount = prev + passiveBobaRate / 10; // divide by 10 because we update 10 times per second
          return newAmount;
        });
        setTotalBoba((prev) => prev + passiveBobaRate / 10);
      }
    }, 100); // Update 10 times per second for smoother animation

    return () => {
      if (passiveTimerRef.current) {
        clearInterval(passiveTimerRef.current);
      }
    };
  }, [passiveBobaRate]);

  useEffect(() => {
    if (totalBoba >= bobaGoal) {
      toast({
        title: "Goal Achieved!",
        description: `Congratulations! You've reached your goal of ${bobaGoal} boba!`,
        duration: 5000,
      });
      // Set a new goal that's 5x the current goal
      setBobaGoal((prev) => prev * 5);
    }
  }, [totalBoba, bobaGoal, toast]);

  useEffect(() => {
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.completed) return challenge;

      let achieved = false;

      switch (challenge.type) {
        case "boba":
          achieved = totalBoba >= challenge.target;
          break;
        case "sessions":
          achieved = completedSessions >= challenge.target;
          break;
        case "clicks":
          achieved = totalClicks >= challenge.target;
          break;
        case "bps":
          achieved = passiveBobaRate >= challenge.target;
          break;
      }

      if (achieved && !challenge.completed) {
        // Award the boba for completing challenge
        setBobaCount((prev) => prev + challenge.reward);
        setTotalBoba((prev) => prev + challenge.reward);

        toast({
          title: `Challenge Completed: ${challenge.name}`,
          description: `Reward: ${challenge.reward} boba!`,
          duration: 5000,
        });

        setCompletedChallenges((prev) => prev + 1);

        return { ...challenge, completed: true };
      }

      return challenge;
    });

    setChallenges(updatedChallenges);
  }, [totalBoba, completedSessions, totalClicks, passiveBobaRate]);

  // Update derived stats when upgrades change
  useEffect(() => {
    // Boba per click = base (1) * tapioca level * marketing effect
    const marketingMultiplier = 1 + upgrades.marketing * 0.1;
    const newBobaPerClick = 1 * upgrades.tapioca * marketingMultiplier;

    // Passive rate = staff level * 0.5 * marketing effect
    const passiveRate = upgrades.staff * 0.5 * marketingMultiplier;

    setBobaPerClick(newBobaPerClick);
    setPassiveBobaRate(passiveRate);
  }, [upgrades]);

  const handleBobaMade = (amount: number) => {
    setBobaCount((prev) => prev + amount);
    setTotalBoba((prev) => prev + amount);
    setTotalClicks((prev) => prev + 1);
  };

  const handleTimerComplete = (mode: "focus" | "break", reward: number) => {
    if (mode === "focus") {
      // Reward player for completing a focus session
      const totalReward = reward * (1 + completedSessions * 0.1); // Increases slightly with more completed sessions
      setBobaCount((prev) => prev + totalReward);
      setTotalBoba((prev) => prev + totalReward);
      setCompletedSessions((prev) => prev + 1);

      toast({
        title: "Focus reward!",
        description: `You earned ${totalReward.toFixed(
          1
        )} boba for completing a focus session.`,
        duration: 3000,
      });
    }
  };

  const handlePurchase = (cost: number, upgradeId: string) => {
    setBobaCount((prev) => prev - cost);

    setUpgrades((prev) => ({
      ...prev,
      [upgradeId]: prev[upgradeId as keyof typeof prev] + 1,
    }));

    toast({
      title: "Upgrade purchased!",
      description: `Your boba business is growing!`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-boba-milk to-secondary">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-boba-brown mb-2">
            BobaTimes
          </h1>
          <p className="text-muted-foreground">
            Stay productive while growing your boba tea empire!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <BobaTimer onTimerComplete={handleTimerComplete} />

          <div className="flex flex-col gap-6">
            <StatisticsPanel
              totalBoba={totalBoba}
              completedSessions={completedSessions}
              bobaPerClick={bobaPerClick}
              passiveBobaRate={passiveBobaRate}
            />
            <BobaClicker
              bobaPerClick={bobaPerClick}
              onBobaMade={handleBobaMade}
            />
          </div>
        </div>

        <Separator className="my-8 bg-boba-brown/10" />

        <div className="md:col-span-8 transition-all duration-300 hover:scale-[1.01] mb-8">
          <BobaShop
            currency={bobaCount}
            onPurchase={handlePurchase}
            bobaPerClick={bobaPerClick}
            passiveBobaRate={passiveBobaRate}
          />
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 animate-fade-in mb-6">
          <h2 className="text-xl font-medium mb-4 text-boba-brown flex items-center gap-2">
            <Target size={18} className="text-boba-brown" />
            Boba Goal
          </h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm">
                Progress: {((totalBoba / bobaGoal) * 100).toFixed(1)}%
              </div>
              <span className="text-xs text-muted-foreground">
                {totalBoba.toFixed(0)} / {bobaGoal.toFixed(0)}
              </span>
            </div>
            <Progress value={(totalBoba / bobaGoal) * 100} className="h-3" />
          </div>
          <p className="text-sm text-muted-foreground">
            Reach {bobaGoal.toFixed(0)} boba to set a new milestone and unlock a
            surprise reward!
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 animate-fade-in mb-6">
          <h2 className="text-xl font-medium mb-4 text-boba-brown flex items-center gap-2">
            <ArrowBigRightDashIcon size={18} className="text-boba-brown" />
            Achivements
          </h2>
          <ChallengeList
            challenges={challenges}
            totalBoba={totalBoba}
            completedSessions={completedSessions}
            totalClicks={0}
            passiveBobaRate={passiveBobaRate}
          />
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:col-span-1 animate-fade-in">
          <h2 className="text-xl font-medium mb-4 text-boba-brown">
            How to Play
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-secondary rounded-full p-1 mt-0.5">1</span>
              <span>Use the Pomodoro timer for focused work sessions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-secondary rounded-full p-1 mt-0.5 ">2</div>
              <span>Tap the boba cup to brew tea during breaks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-secondary rounded-full p-1 mt-0.5">3</span>
              <span>Complete focus sessions to earn bonus boba</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-secondary rounded-full p-1 mt-0.5">4</span>
              <span>Spend your boba on upgrades in the shop</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-secondary rounded-full p-1 mt-0.5">5</span>
              <span>Hire staff to brew boba even while you focus</span>
            </li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground animate-fade-in">
          <p>BobaTimes — Productivity meets idle fun</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

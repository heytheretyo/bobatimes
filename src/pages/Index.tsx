/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useMemo } from "react";
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
import Instructions from "@/components/Instructions";
import Footer from "@/components/Footer";
import useDebouncedSave from "@/hooks/use-debounce-save";
import { playAchievementSound } from "@/lib/sound";
import AuthBanner from "@/components/AuthBanner";
import AuthModal from "@/components/AuthModal";
import AuthPopup from "@/components/AuthPopup";
import BuyMeCoffee from "@/components/BuyMeCoffee";
import {
  getDocumentCloudStorage,
  Save,
  saveToCloudStorage,
} from "@/lib/progress";
import useAuth from "@/hooks/use-auth";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/local-storage";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user } = useAuth();

  let userId = user?._id || null;

  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<any>(null);

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  //TODO: unneccesary state do later
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(
    "signup"
  );

  const [localData, setLocalData] = useState(() =>
    loadFromLocalStorage("localData", {})
  );

  const [bobaCount, setBobaCount] = useState<number>(0);
  const [totalBoba, setTotalBoba] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [challengesCompleted, setChallengesCompleted] = useState<string[]>([]);
  const [bobaGoal, setBobaGoal] = useState<number>(1000);
  const [bobaPerClick, setBobaPerClick] = useState<number>(1);
  const [passiveBobaRate, setPassiveBobaRate] = useState<number>(0);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  const [upgrades, setUpgrades] = useState<{
    tapioca: number;
    staff: number;
    marketing: number;
  }>({
    tapioca: localData.tapiocaUpgrades || 1,
    staff: localData.staffUpgrades || 0,
    marketing: localData.marketingUpgrades || 0,
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(null); // Track last updated time

  const handleManualSave = () => {
    const progress = generateProgress();

    if (userId) {
      saveToCloudStorage(
        userId,
        progress,
        lastSynced,
        setLastSynced,
        setLoading,
        setError
      );
    } else {
      saveToLocalStorage("localSave", progress);
    }
    setLastUpdated(new Date().toLocaleString());
  };

  const generateProgress = () => ({
    bobaCount,
    totalBoba,
    totalClicks,
    completedSessions,
    bobaGoal,
    bobaPerClick,
    passiveBobaRate,
    challengesCompleted,
    marketingUpgrades: upgrades.marketing,
    staffUpgrades: upgrades.staff,
    tapiocaUpgrades: upgrades.tapioca,
  });

  const { toast } = useToast();
  const passiveTimerRef = useRef<number | null>(null);
  const progressRef = useRef(null);

  const marketingMultiplier = useMemo(
    () => 1 + upgrades.marketing * 0.1,
    [upgrades.marketing]
  );
  // const newBobaPerClick = useMemo(
  //   () => 1 * upgrades.tapioca * marketingMultiplier,
  //   [upgrades.tapioca, marketingMultiplier]
  // );
  // const passiveRate = useMemo(
  //   () => upgrades.staff * 0.5 * marketingMultiplier,
  //   [upgrades.staff, marketingMultiplier]
  // );

  // TODO: automatic cloud save
  // useEffect(() => {
  //   const bobaProgress: Save = {
  //     bobaCount,
  //     totalBoba,
  //     totalClicks,
  //     completedSessions,
  //     bobaGoal,
  //     bobaPerClick,
  //     passiveBobaRate,
  //     challengesCompleted,
  //     marketingUpgrades: upgrades.marketing,
  //     staffUpgrades: upgrades.staff,
  //     tapiocaUpgrades: upgrades.tapioca,
  //   };

  //   if (userId && bobaProgress) {
  //     const interval = setInterval(() => {
  //       return autoSyncProgress(
  //         userId,
  //         bobaProgress,
  //         lastSynced,
  //         setLastSynced,
  //         setLoading,
  //         setError
  //       );
  //     }, 30000); // Sync every 30 seconds

  //     return () => clearInterval(interval);
  //   }
  // }, [userId, lastSynced]);

  // TODO: automatic loccal save
  // useEffect(() => {
  //   const saveDataInterval = setInterval(() => {
  //     const progress = generateProgress();
  //     console.log("Saving data:", progress);
  //     saveToLocalStorage("localSave", progress);
  //   }, 30000); // 1000 minutes in milliseconds (1000 * 60 * 1000)

  //   return () => clearInterval(saveDataInterval); // Cleanup interval on unmount
  // }, []);

  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // if (progressRef.current) {
      //   saveToLocalStorage("localSave", progressRef.current);

      //   if (userId) {
      //     const saveData = progressRef.current;

      //     const setLoading = () => {}; // You can implement this if you want to show a loading state
      //     const setError = (errorMessage: string | null) => {}; // You can implement this for error handling

      //     await saveToCloudStorage(
      //       userId,
      //       saveData,
      //       lastSynced,
      //       setLastSynced,
      //       setLoading,
      //       setError
      //     );
      //   }
      // }
      event.returnValue = ""; // Required for showing the confirmation dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    progressRef.current = generateProgress();
  }, [
    bobaCount,
    totalBoba,
    totalClicks,
    completedSessions,
    bobaGoal,
    bobaPerClick,
    passiveBobaRate,
    upgrades,
  ]);

  useEffect(() => {
    const loadSaveData = async () => {
      if (userId) {
        // Fetch save data from the cloud if authenticated
        try {
          const data = await getDocumentCloudStorage(userId);

          if (data) {
            setBobaCount(data.bobaCount || 0);
            setTotalBoba(data.totalBoba || 0);
            setTotalClicks(data.totalClicks || 0);
            setCompletedSessions(data.completedSessions || 0);

            setUpgrades({
              tapioca: data.tapiocaUpgrades || 1,
              staff: data.staffUpgrades || 0,
              marketing: data.marketingUpgrades || 0,
            });
            setBobaPerClick(data.bobaPerClick || 1);
            setPassiveBobaRate(data.passiveBobaRate || 0);
            setChallengesCompleted(data.challengesCompleted || []);
          }
        } catch (error) {
          console.error("Error fetching save data:", error);
        }
      } else {
        // Load save data from localStorage if not authenticated
        const savedData = localStorage.getItem("localSave");
        if (savedData) {
          const parsedData: Save = JSON.parse(savedData);
          setBobaCount(parsedData.bobaCount || 0);
          setTotalBoba(parsedData.totalBoba || 0);
          setTotalClicks(parsedData.totalClicks || 0);
          setCompletedSessions(parsedData.completedSessions || 0);

          setUpgrades({
            tapioca: parsedData.tapiocaUpgrades || 1,
            staff: parsedData.staffUpgrades || 0,
            marketing: parsedData.marketingUpgrades || 0,
          });
          setBobaPerClick(parsedData.bobaPerClick || 1);
          setPassiveBobaRate(parsedData.passiveBobaRate || 0);
          setChallengesCompleted(parsedData.challengesCompleted || []);
        }
      }
    };

    loadSaveData();
  }, [userId]); // Re-run when the userId changes (i.e., on login/logout)

  // Initialize passive income timer
  /// TODO: WEB WORKER
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

  // TODO: LISTEN TO WW
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
    const updatedChallenges = challenges.map((challenge, idx) => {
      if (challenge.completed || challengesCompleted.includes(challenge.id)) {
        challenge.completed = true;
        return challenge;
      }

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

      if (achieved) {
        setBobaCount((prev) => prev + challenge.reward);
        setTotalBoba((prev) => prev + challenge.reward);

        playAchievementSound();

        toast({
          title: `Challenge Completed: ${challenge.name}`,
          description: `Reward: ${challenge.reward} boba!`,
          duration: 5000,
        });

        setChallengesCompleted((prev) => [...prev, challenge.id]);

        // ...challenges
        //   .filter((challenge) => challenge.completed) // Only completed challenges
        //   .map((challenge) => challenge.name),

        return { ...challenge, completed: true };
      }

      return challenge;
    });

    setChallenges(updatedChallenges);
  }, [
    totalBoba,
    bobaCount,
    completedSessions,
    completedSessions,
    challengesCompleted,
    bobaGoal,
    upgrades,
    bobaPerClick,
    passiveBobaRate,
  ]);

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

    const marketingMultiplier = 1 + upgrades.marketing * 0.1;

    setBobaPerClick(1 * upgrades.tapioca * marketingMultiplier);
    setPassiveBobaRate(1 * upgrades.staff * 0.5 * marketingMultiplier);

    toast({
      title: "Upgrade purchased!",
      description: `Your boba business is growing!`,
      duration: 2000,
    });
  };

  const handleOpenAuthModal = (mode: "signin" | "signup") => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
    setShowAuthPopup(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-boba-milk to-secondary">
      <AuthBanner
        onSignIn={() => handleOpenAuthModal("signin")}
        onSignUp={() => handleOpenAuthModal("signup")}
        visible={true}
        onDismiss={() => {}}
        onLogout={() => {
          userId = null;
        }}
      />

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-4xl font-molle  tracking-tight  text-boba-brown mb-2">
            bobatimes
          </h1>
          <p className="text-muted-foreground">
            Stay productive while growing your boba tea empire!
          </p>
        </div>

        <div className="mb-4 text-xs flex items-center space-x-2">
          <p>{lastUpdated && ` Last updated: ${lastUpdated}`}</p>
          <Button
            variant="link"
            className="p-0 text-xs ml"
            onClick={handleManualSave}
          >
            Save now
          </Button>
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

        <Instructions />

        <Footer />
      </div>

      <AuthPopup
        isOpen={showAuthPopup}
        onOpenChange={setShowAuthPopup}
        onSignUp={() => handleOpenAuthModal("signup")}
        onSignIn={() => handleOpenAuthModal("signin")}
        onDismiss={() => setShowAuthPopup(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onOpenChange={setShowAuthModal}
        initialMode={authModalMode}
      />

      <BuyMeCoffee />
    </div>
  );
};

export default Index;

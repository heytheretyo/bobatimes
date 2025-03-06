import { saveToLocalStorage } from "@/lib/local-storage";
import { Save } from "@/lib/progress";
import { useState, useEffect, useRef } from "react";

const useDebouncedSave = (bobaProgress: Save) => {
  const timeoutRef = useRef(null); // Keeps track of the current timeout

  const {
    bobaCount,
    totalBoba,
    totalClicks,
    completedSessions,
    challengesCompleted,
    bobaGoal,
    marketingUpgrades,
    staffUpgrades,
    tapiocaUpgrades,
    bobaPerClick,
    passiveBobaRate,
  } = bobaProgress;

  useEffect(() => {
    // Clear previous timeout if there was one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      const progressData: Save = {
        bobaCount,
        totalBoba,
        totalClicks,
        completedSessions,
        challengesCompleted,
        bobaGoal,
        bobaPerClick,
        passiveBobaRate,
        marketingUpgrades,
        staffUpgrades,
        tapiocaUpgrades,
      };

      saveToLocalStorage("localSave", progressData);
    }, 2500); // 1-second debounce time

    return () => {
      // Cleanup timeout on component unmount or when dependencies change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

export default useDebouncedSave;

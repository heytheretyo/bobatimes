import { useState, useEffect, useRef } from "react";

const useDebouncedSave = (
  bobaCount,
  totalBoba,
  totalClicks,
  completedSessions,
  challengesCompleted,
  bobaGoal,
  upgrades,
  bobaPerClick,
  passiveBobaRate
) => {
  const timeoutRef = useRef(null); // Keeps track of the current timeout

  useEffect(() => {
    // Clear previous timeout if there was one
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      const progressData = {
        bobaCount,
        totalBoba,
        totalClicks,
        completedSessions,
        challengesCompleted,
        bobaGoal,
        upgrades,
        bobaPerClick,
        passiveBobaRate,
      };

      // Save data to localStorage
      localStorage.setItem("bobaProgress", JSON.stringify(progressData));
    }, 1000); // 1-second debounce time

    return () => {
      // Cleanup timeout on component unmount or when dependencies change
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    bobaCount,
    totalBoba,
    totalClicks,
    completedSessions,
    challengesCompleted,
    bobaGoal,
    upgrades,
    bobaPerClick,
    passiveBobaRate,
  ]);
};

export default useDebouncedSave;

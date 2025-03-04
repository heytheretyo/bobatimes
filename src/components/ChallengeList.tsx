"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Challenge } from "@/lib/challenges";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChallengeListProps {
  challenges: Challenge[];
  totalBoba: number;
  completedSessions: number;
  totalClicks: number;
  passiveBobaRate: number;
}

export default function ChallengeList({
  challenges,
  totalBoba,
  completedSessions,
  totalClicks,
  passiveBobaRate,
}: ChallengeListProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleChallenges = showAll ? challenges : challenges.slice(0, 3);

  return (
    <div className="space-y-3">
      {visibleChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className={`border rounded-lg p-3 transition-all ${
            challenge.completed
              ? "bg-green-50 border-green-200"
              : "bg-white/70 border-gray-200"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">{challenge.name}</h3>
              <p className="text-xs text-muted-foreground">
                {challenge.description}
              </p>
            </div>
            {challenge.completed ? (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Completed
              </div>
            ) : (
              <div className="bg-secondary text-xs px-2 py-1 rounded-full">
                +{challenge.reward} boba
              </div>
            )}
          </div>

          {!challenge.completed && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>
                  {challenge.type === "boba" &&
                    `${totalBoba.toFixed(0)}/${challenge.target}`}
                  {challenge.type === "sessions" &&
                    `${completedSessions}/${challenge.target}`}
                  {challenge.type === "clicks" &&
                    `${totalClicks}/${challenge.target}`}
                  {challenge.type === "bps" &&
                    `${passiveBobaRate.toFixed(1)}/${challenge.target}`}
                </span>
              </div>
              <Progress
                value={
                  challenge.type === "boba"
                    ? (totalBoba / challenge.target) * 100
                    : challenge.type === "sessions"
                    ? (completedSessions / challenge.target) * 100
                    : challenge.type === "clicks"
                    ? (totalClicks / challenge.target) * 100
                    : (passiveBobaRate / challenge.target) * 100
                }
                className="h-1"
              />
            </div>
          )}
        </div>
      ))}

      {challenges.length > 3 && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

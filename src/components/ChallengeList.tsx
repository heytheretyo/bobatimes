import { Progress } from "@/components/ui/progress";
import { Challenge } from "@/lib/challenges";

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
  return (
    <div className="space-y-3">
      {challenges.map((challenge) => (
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
    </div>
  );
}

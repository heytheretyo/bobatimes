import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Zap, Coffee, TrendingUp, MouseIcon } from "lucide-react";

interface StatisticsPanelProps {
  totalBoba: number;
  completedSessions: number;
  bobaPerClick: number;
  passiveBobaRate: number;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  totalBoba,
  completedSessions,
  bobaPerClick,
  passiveBobaRate,
}) => {
  return (
    <Card className="border-boba-brown/20 dark:border-slate-700 dark:bg-slate-800/80">
      <CardContent className="p-6">
        <h2 className="text-xl font-medium text-boba-brown dark:text-amber-300 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Statistics
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 flex flex-col">
            <div className="text-xs text-muted-foreground dark:text-slate-400 mb-1 flex items-center">
              <Coffee className="h-3 w-3 mr-1 text-boba-brown" />
              Current Boba
            </div>
            <div className="text-2xl font-bold text-boba-brown dark:text-amber-300">
              {Math.floor(totalBoba).toLocaleString()}
            </div>
          </div>

          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 flex flex-col">
            <div className="text-xs text-muted-foreground dark:text-slate-400 mb-1 flex items-center">
              <Trophy className="h-3 w-3 mr-1 text-boba-tapioca" />
              Sessions
            </div>
            <div className="text-2xl font-bold text-boba-brown dark:text-amber-300">
              {completedSessions}
            </div>
          </div>

          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 flex flex-col">
            <div className="text-xs text-muted-foreground dark:text-slate-400 mb-1 flex items-center">
              <MouseIcon className="h-3 w-3 mr-1" />
              Per Click
            </div>
            <div className="text-xl font-bold text-boba-brown dark:text-amber-300 flex items-center">
              {bobaPerClick.toFixed(1)}
              <span className="text-xs text-muted-foreground dark:text-slate-400 ml-1">
                boba
              </span>
            </div>
          </div>

          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 flex flex-col">
            <div className="text-xs text-muted-foreground dark:text-slate-400 mb-1 flex items-center">
              <Zap className="h-3 w-3 mr-1 text-boba-caramel" />
              Passive
            </div>
            <div className="text-xl font-bold text-boba-brown dark:text-amber-300 flex items-center">
              {passiveBobaRate.toFixed(1)}
              <span className="text-xs text-muted-foreground dark:text-slate-400 ml-1">
                per sec
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;

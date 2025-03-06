import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Coffee,
  Plus,
  Award,
  Sparkles,
  CupSoda,
  Music,
  Store,
  Flame,
  Star,
  Zap,
  Target,
  ShoppingBag,
  ShoppingCart,
  Moon,
  Sun,
  Timer,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { playPurchaseSound } from "@/lib/sound";
import { formatNumber } from "@/lib/format";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentLevel: number;
  effect: (level: number) => number;
  icon: React.ReactNode;
  category: "basic" | "passive" | "special" | "multiplier";
}

interface BobaShopProps {
  currency: number;
  onPurchase: (cost: number, upgradeId: string) => void;
  bobaPerClick: number;
  passiveBobaRate: number;
}

const BobaShop: React.FC<BobaShopProps> = ({
  currency,
  onPurchase,
  bobaPerClick,
  passiveBobaRate,
}) => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    // Basic upgrades
    {
      id: "tapioca",
      name: "Premium Tapioca",
      description: "Better tapioca pearls increase boba per click",
      baseCost: 100,
      currentLevel: 1,
      effect: (level) => level,
      icon: (
        <Coffee size={18} className="text-boba-brown dark:text-amber-300" />
      ),
      category: "basic",
    },
    {
      id: "staff",
      name: "Hire Staff",
      description: "Employees generate boba even when you're focusing",
      baseCost: 1200,
      currentLevel: 0,
      effect: (level) => level * 0.5,
      icon: (
        <CupSoda size={18} className="text-boba-brown dark:text-amber-300" />
      ),
      category: "passive",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Promote your shop for more customers",
      baseCost: 3000,
      currentLevel: 0,
      effect: (level) => level * 1.5,
      icon: <Sparkles size={18} className="text-yellow-500" />,
      category: "basic",
    },
    // Existing upgrades
    {
      id: "soundtrack",
      name: "Lofi Soundtrack",
      description: "Play relaxing lofi music to attract customers",
      baseCost: 100000,
      currentLevel: 0,
      effect: (level) => level * 0.8,
      icon: <Music size={18} className="text-purple-500" />,
      category: "special",
    },
    {
      id: "staff",
      name: "Boba Machine",
      description: "Automatic boba maker increases passive income",
      baseCost: 4400,
      currentLevel: 0,
      effect: (level) => level * 2,
      icon: <Zap size={18} className="text-blue-500" />,
      category: "passive",
    },
    {
      id: "staff",
      name: "Franchise",
      description: "Open additional boba shops around town",
      baseCost: 25000,
      currentLevel: 0,
      effect: (level) => level * 5,
      icon: <Store size={18} className="text-green-500" />,
      category: "passive",
    },
    {
      id: "tapioca",
      name: "Special Flavors",
      description: "Unique flavors that customers love",
      baseCost: 25000,
      currentLevel: 0,
      effect: (level) => level * 2,
      icon: <Flame size={18} className="text-orange-500" />,
      category: "basic",
    },
    {
      id: "rep",
      name: "Loyalty Program",
      description: "Reward returning customers",
      baseCost: 20000,
      currentLevel: 0,
      effect: (level) => level * 3,
      icon: <Star size={18} className="text-yellow-500" />,
      category: "special",
    },
    // New upgrades
    {
      id: "pomodoro-multiplier",
      name: "Pomodoro Multiplier",
      description: "Increase boba earned from completed focus sessions",
      baseCost: 2500,
      currentLevel: 0,
      effect: (level) => level * 0.5, // 50% boost per level
      icon: <Timer size={18} className="text-red-500" />,
      category: "multiplier",
    },
    {
      id: "tapioca",
      name: "Click Multiplier",
      description: "Multiply boba earned from each click",
      baseCost: 3500,
      currentLevel: 0,
      effect: (level) => level * 0.25, // 25% boost per level
      icon: <Plus size={18} className="text-blue-500" />,
      category: "multiplier",
    },
    {
      id: "nightshift",
      name: "Night Shift",
      description: "Earn more boba during nighttime hours",
      baseCost: 20000,
      currentLevel: 0,
      effect: (level) => level * 2,
      icon: <Moon size={18} className="text-indigo-500" />,
      category: "special",
    },
    {
      id: "staff",
      name: "Boba Delivery",
      description: "Deliver boba to customers for passive income",
      baseCost: 2200,
      currentLevel: 0,
      effect: (level) => level * 3,
      icon: <ShoppingBag size={18} className="text-green-500" />,
      category: "passive",
    },
    {
      id: "tapioca",
      name: "Wholesale Supplies",
      description: "Buy supplies in bulk to increase efficiency",
      baseCost: 5275,
      currentLevel: 0,
      effect: (level) => level * 0.3, // 30% efficiency boost
      icon: <ShoppingCart size={18} className="text-amber-500" />,
      category: "multiplier",
    },
    {
      id: "seasonal",
      name: "Seasonal Specials",
      description: "Offer seasonal boba flavors for premium prices",
      baseCost: 50000,
      currentLevel: 0,
      effect: (level) => level * 4,
      icon: <Sun size={18} className="text-yellow-500" />,
      category: "basic",
    },
  ]);

  const calculateCost = (baseCost: number, level: number): number => {
    return Math.floor(baseCost * Math.pow(1.5, level));
  };

  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId);
    if (upgradeIndex === -1) return;

    const upgrade = upgrades[upgradeIndex];
    const cost = calculateCost(upgrade.baseCost, upgrade.currentLevel);

    if (currency >= cost) {
      onPurchase(cost, upgradeId);

      playPurchaseSound();

      const updatedUpgrades = [...upgrades];
      updatedUpgrades[upgradeIndex] = {
        ...upgrade,
        currentLevel: upgrade.currentLevel + 1,
      };

      setUpgrades(updatedUpgrades);
    }
  };

  // Group upgrades by category
  const basicUpgrades = upgrades.filter((u) => u.category === "basic");
  const passiveUpgrades = upgrades.filter((u) => u.category === "passive");
  const specialUpgrades = upgrades.filter((u) => u.category === "special");
  const multiplierUpgrades = upgrades.filter(
    (u) => u.category === "multiplier"
  );

  const renderUpgradeCategory = (
    categoryName: string,
    categoryUpgrades: Upgrade[]
  ) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-muted-foreground dark:text-slate-400 mb-3">
        {categoryName}
      </h4>
      <div className="space-y-2">
        {categoryUpgrades.map((upgrade) => {
          const cost = calculateCost(upgrade.baseCost, upgrade.currentLevel);
          const canAfford = currency >= cost;

          return (
            <div
              key={upgrade.name}
              className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300
              ${
                canAfford
                  ? "bg-secondary/30 border-secondary dark:bg-slate-700/30 dark:border-slate-600 hover:bg-secondary/50 dark:hover:bg-slate-700/50"
                  : "bg-muted/30 border-muted dark:bg-slate-800/30 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    canAfford
                      ? "bg-background/80 dark:bg-slate-800/80"
                      : "bg-muted/50 dark:bg-slate-900/50"
                  }`}
                >
                  {upgrade.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm dark:text-slate-200">
                    {upgrade.name}
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    {upgrade.description}
                  </p>
                  <p className="text-xs font-medium text-boba-brown dark:text-amber-300 mt-1">
                    Level: {upgrade.currentLevel} | Effect:{" "}
                    {upgrade.effect(upgrade.currentLevel).toFixed(1)}
                  </p>
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={canAfford ? "default" : "outline"}
                      size="sm"
                      onClick={() => purchaseUpgrade(upgrade.id)}
                      disabled={!canAfford}
                      className={`rounded-lg min-w-[90px] ${
                        canAfford
                          ? "bg-boba-brown hover:bg-boba-brown/90 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-900"
                          : "border-boba-brown/30 text-boba-brown/50 dark:border-slate-700 dark:text-slate-500"
                      } ${!canAfford ? "opacity-60" : ""}`}
                    >
                      <span className="mr-1">{cost}</span>
                      <CupSoda size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current Level: {upgrade.currentLevel}</p>
                    <p>Next Level: {upgrade.currentLevel + 1}</p>
                    <p>
                      Effect:{" "}
                      {upgrade.effect(upgrade.currentLevel + 1).toFixed(1)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="w-full border-boba-brown/20 dark:border-slate-700 dark:bg-slate-800/80">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-medium text-boba-brown dark:text-amber-300 flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Boba Shop
          </span>
          <div className="flex items-center gap-2 bg-secondary/70 dark:bg-slate-700/70 px-3 py-1 rounded-full text-sm font-medium">
            <CupSoda
              size={18}
              className="text-boba-brown dark:text-amber-300"
            />
            <span className="font-mono text-boba-brown dark:text-amber-300">
              {Math.floor(currency).toLocaleString()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Per Click
            </p>
            <p className="text-xl font-medium text-boba-brown dark:text-amber-300">
              {formatNumber(bobaPerClick)}
            </p>
          </div>
          <div className="bg-secondary/50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground dark:text-slate-400">
              Per Second
            </p>
            <p className="text-xl font-medium text-boba-brown dark:text-amber-300">
              {formatNumber(passiveBobaRate)}
            </p>
          </div>
        </div>

        <ScrollArea className="space-y-4 max-h-[400px] pr-2 overflow-y-auto">
          {renderUpgradeCategory("Basic Upgrades", basicUpgrades)}
          {renderUpgradeCategory("Passive Income", passiveUpgrades)}
          {renderUpgradeCategory("Multipliers", multiplierUpgrades)}
          {renderUpgradeCategory("Special Upgrades", specialUpgrades)}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BobaShop;

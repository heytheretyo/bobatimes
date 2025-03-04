
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Coffee, 
  Plus, 
  Award,
  Sparkles,
  CupSoda
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  currentLevel: number;
  effect: (level: number) => number;
  icon: React.ReactNode;
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
  passiveBobaRate
}) => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'tapioca',
      name: 'Premium Tapioca',
      description: 'Better tapioca pearls increase boba per click',
      baseCost: 10,
      currentLevel: 1,
      effect: (level) => level,
      icon: <Coffee size={18} className="text-boba-brown" />
    },
    {
      id: 'staff',
      name: 'Hire Staff',
      description: 'Employees generate boba even when you\'re focusing',
      baseCost: 25,
      currentLevel: 0,
      effect: (level) => level * 0.5,
      icon: <CupSoda size={18} className="text-boba-caramel" />
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Promote your shop for more customers',
      baseCost: 50,
      currentLevel: 0,
      effect: (level) => level * 1.5,
      icon: <Sparkles size={18} className="text-yellow-500" />
    }
  ]);

  const calculateCost = (baseCost: number, level: number): number => {
    return Math.floor(baseCost * Math.pow(1.5, level));
  };

  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return;
    
    const upgrade = upgrades[upgradeIndex];
    const cost = calculateCost(upgrade.baseCost, upgrade.currentLevel);
    
    if (currency >= cost) {
      onPurchase(cost, upgradeId);
      
      const updatedUpgrades = [...upgrades];
      updatedUpgrades[upgradeIndex] = {
        ...upgrade,
        currentLevel: upgrade.currentLevel + 1
      };
      
      setUpgrades(updatedUpgrades);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass-panel animate-slide-up rounded-3xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="text-xl font-medium">Boba Shop</span>
          <div className="flex items-center gap-2">
            <CupSoda size={18} className="text-boba-caramel" />
            <span className="font-mono">{currency.toFixed(1)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Per Click</p>
            <p className="text-xl font-medium">{bobaPerClick.toFixed(1)}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-xs text-muted-foreground">Per Second</p>
            <p className="text-xl font-medium">{passiveBobaRate.toFixed(1)}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {upgrades.map((upgrade) => {
            const cost = calculateCost(upgrade.baseCost, upgrade.currentLevel);
            const canAfford = currency >= cost;
            
            return (
              <div 
                key={upgrade.id}
                className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300 
                ${canAfford ? 'bg-secondary/30 border-secondary hover:bg-secondary/50' : 'bg-muted/30 border-muted'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${canAfford ? 'bg-background/80' : 'bg-muted/50'}`}>
                    {upgrade.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{upgrade.name}</h3>
                    <p className="text-xs text-muted-foreground">{upgrade.description}</p>
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
                        className={`rounded-lg min-w-[90px] ${!canAfford ? 'opacity-60' : ''}`}
                      >
                        <span className="mr-1">{cost}</span>
                        <CupSoda size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Level: {upgrade.currentLevel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BobaShop;

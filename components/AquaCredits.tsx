"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { LayoutGrid, Plus, CreditCard } from "lucide-react";
import { useAquaCredits } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import PurchaseCredits from "./PurchaseCredits";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AquaCreditsProps {
  credits?: number;
  threshold?: string;
  className?: string;
}

const AquaCredits = ({ className = "" }: AquaCreditsProps) => {
  const { data, isLoading, error } = useAquaCredits();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const credits = data?.credits ?? 0;
  const isLowCredits = credits < 100;

  return (
    <Card className={`p-3 ${className}`}>
      {/* Header with icon and title */}
      <div className="flex items-center mb-3">
        <div className="bg-accent/10 p-1.5 rounded-md mr-2">
          <LayoutGrid size={14} className="text-accent" />
        </div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Credits</h3>
      </div>

      {/* Credits display */}
      <div className="mb-4">
        {isLoading ? (
          <div className="h-16 bg-muted/20 animate-pulse rounded" />
        ) : error ? (
          <div className="text-center py-4">
            <span className="text-muted-foreground">--</span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-muted/20 border border-border/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Balance
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              
              <span className={`text-lg font-bold ${
                // isLowCredits ? 'text-warning' : 'text-emerald-300'
                isLowCredits ? 'text-warning' : 'text-violet-400'
              }`}>
                {credits.toFixed(2)}
              </span>
              {isLowCredits && (
                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full border border-warning/20">
                  Low
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full text-xs h-8">
            {/* <Plus size={12} className="mr-1" /> */}
            Recharge
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Purchase Credits</DialogTitle>
          </DialogHeader>
          <PurchaseCredits onSuccess={() => setIsPurchaseModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AquaCredits;

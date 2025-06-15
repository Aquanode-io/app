import React from "react";
import { Skeleton } from "../../ui/skeleton";
import { StatsCard, Grid } from "../../ui/design-system";

interface DeploymentStatsProps {
  isLoading: boolean;
  activeInstances: number;
}

const DeploymentStats: React.FC<DeploymentStatsProps> = ({
  isLoading,
  activeInstances,
}) => {
  if (isLoading) {
    return (
      <div className="space-component">
        <StatsCard 
          title=""
          value=""
          loading={true}
        />
      </div>
    );
  }

  return (
    <div className="space-component">
      <StatsCard 
        title="Active Instances"
        value={activeInstances}
      />
    </div>
  );
};

export default DeploymentStats;

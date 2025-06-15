import React from "react";
import { Button } from "@/components/ui/button";
import { Deployment } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Card, Heading, Text } from "../../ui/design-system";
import DeploymentStats from "./DeploymentStats";

interface ServiceSidebarProps {
  deployments: Deployment[];
  onRefresh: () => void;
  isDeploymentActive: (createdAt: string, duration: string) => boolean;
  serviceName: string;
  isLoading: boolean;
  activeInstances: number;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  deployments,
  onRefresh,
  isDeploymentActive,
  isLoading,
  activeInstances,
  serviceName,  
}) => {
  return (
    <div className="space-y-4">
      {/* <Button
        onClick={onRefresh}
        className="btn-secondary btn-sm w-full"
        variant="outline"
      >
        Refresh Deployments
      </Button> */}

      <DeploymentStats
        isLoading={isLoading}
        activeInstances={activeInstances}
      />

      <Card variant="primary">
        <Heading level={5} className="mb-4">
          Recent Activity
        </Heading>
        {deployments.length === 0 ? (
          <Text variant="small" muted>No recent activity</Text>
        ) : (
          <div className="space-y-4">
            {deployments.slice(0, 3).map((deployment) => (
              <div
                key={deployment.deploymentId}
                className="border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <Text variant="small" className="font-medium">
                    {serviceName} {deployment.deploymentId}
                  </Text>
                  <span
                    className={`status-badge ${
                      isDeploymentActive(
                        deployment.createdAt,
                        deployment.duration
                      )
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {isDeploymentActive(
                      deployment.createdAt,
                      deployment.duration
                    )
                      ? "Active"
                      : "Expired"}
                  </span>
                </div>
                <Text variant="small" muted>
                  {formatDistanceToNow(new Date(deployment.createdAt))} ago
                </Text>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ServiceSidebar;

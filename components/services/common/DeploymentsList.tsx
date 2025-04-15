import React from "react";
import { Button } from "@/components/ui/button";
import { Deployment } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Skeleton from "./Skeleton";
import { useRouter } from "next/navigation";
import { isDeploymentActive } from "@/lib/deployment/utils";
interface DeploymentsListProps {
  isLoading: boolean;
  error: string | null;
  deployments: Deployment[];
  onDelete?: (deploymentId: string) => void;
  serviceName?: string;
}

const DeploymentsList: React.FC<DeploymentsListProps> = ({
  isLoading,
  error,
  deployments,
  onDelete,
  serviceName,
}) => {
  const router = useRouter();

  const renderSkeletonDeployments = () => (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-3 flex-grow">
            <Skeleton className="h-5 w-full max-w-[300px]" />
            <Skeleton className="h-5 w-full max-w-[250px]" />
            <Skeleton className="h-5 w-full max-w-[200px]" />
          </div>
          <div className="flex gap-3 self-end md:self-center">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return renderSkeletonDeployments();
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (deployments.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
        <p className="text-lg text-muted-foreground">No deployments found</p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Create a new instance to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 w-full">
      {deployments.map((deployment) => {
        const deploymentActive = isDeploymentActive(
          deployment.createdAt,
          deployment.duration
        );
        return (
          <div
            key={deployment.deploymentId}
            className="dashboard-card flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full overflow-hidden"
          >
            <div className="space-y-3 flex-grow min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">ID:</span>
                <Link
                  href={`/app/deployments/${deployment.deploymentId}`}
                  className="text-foreground hover:text-primary hover:underline font-medium truncate max-w-[180px] sm:max-w-[240px]"
                  title={deployment.deploymentId}
                >
                  {deployment.deploymentId}
                </Link>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    deploymentActive
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {deploymentActive ? "Active" : "Expired"}
                </span>
              </div>
              {deployment.appUrl && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground text-sm">URL:</span>
                  <a
                    href={deployment.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary hover:underline truncate max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-md"
                    title={deployment.appUrl}
                  >
                    {deployment.appUrl}
                  </a>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">Created:</span>
                <span className="text-muted-foreground/90">
                  {formatDistanceToNow(new Date(deployment.createdAt))} ago
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Resources:
                </span>
                <span className="text-muted-foreground/90 break-all sm:break-normal">
                  {deployment.cpu} CPU | {deployment.memory} RAM |{" "}
                  {deployment.storage} Storage
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 self-end md:self-center mt-2 md:mt-0">
              {deployment.appUrl && deploymentActive && (
                <a
                  href={
                    serviceName === "JUPYTER"
                      ? `${deployment.appUrl}?token=password`
                      : deployment.appUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="sm"
                    className="hover-effect px-5 w-full sm:w-auto"
                  >
                    Open {serviceName === "JUPYTER" ? "Notebook" : "App"}
                  </Button>
                </a>
              )}

              <Button
                variant="outline"
                size="sm"
                className="hover-effect px-5 w-full sm:w-auto"
                onClick={() => {
                  router.push(`/app/deployments/${deployment.deploymentId}`);
                }}
              >
                View
              </Button>
              {deploymentActive && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-effect text-destructive hover:text-destructive px-5 w-full sm:w-auto"
                  onClick={() => onDelete && onDelete(deployment.deploymentId)}
                >
                  Stop
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeploymentsList;

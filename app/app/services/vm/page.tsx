"use client";

import { Deployment, ServiceType } from "@/lib/types";
import { useAuth } from "@/hooks/auth/useAuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ServicePage from "@/components/services/common/ServicePage";
import {
  useDeployments,
  useCloseDeployment,
} from "@/hooks/deployments/useDeployments";

export default function CustomPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const envProvider = getProviderFromEnv();

  // tanstack to fetch deployments
  const {
    data: deployments = [],
    isLoading,
    error: queryError,
    refetch: fetchDeployments,
  } = useDeployments(user?.id || "", ServiceType.BACKEND, envProvider);

  // mutation for deleting deployments
  const { mutate: closeDeploymentMutation } = useCloseDeployment();

  // error message if any
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to fetch deployments"
    : null;

  const isDeploymentActive = (createdAt: string, duration: string): boolean => {
    const createdAtDate = new Date(createdAt);
    let durationSeconds = 0;

    if (duration.endsWith("h")) {
      durationSeconds = parseInt(duration) * 3600;
    } else if (duration.endsWith("m")) {
      durationSeconds = parseInt(duration) * 60;
    } else if (duration.endsWith("s")) {
      durationSeconds = parseInt(duration);
    } else {
      durationSeconds = parseInt(duration) || 0;
    }
    const endTime = new Date(createdAtDate.getTime() + durationSeconds * 1000);
    const now = new Date();
    return endTime.getTime() > now.getTime();
  };

  // Calculate stats for active deployments only
  const activeDeployments = Array.isArray(deployments)
    ? deployments.filter(
        (d) => d.appUrl !== null && isDeploymentActive(d.createdAt, d.duration)
      )
    : [];
  const activeInstances = activeDeployments.length;
  const totalDeployments = deployments.length;
  const currentCpuUsage = activeDeployments.reduce(
    (acc, curr) => acc + curr.cpu,
    0
  );

  const currentRamUsageInMi = activeDeployments.reduce((acc, curr) => {
    const memory = curr.memory;

    if (memory.includes("Mi")) {
      return acc + parseInt(memory.split("Mi")[0]);
    } else if (memory.includes("Gi")) {
      return acc + parseInt(memory.split("Gi")[0]) * 1024;
    } else {
      return acc + parseInt(memory);
    }
  }, 0);

  const currentRamUsage =
    currentRamUsageInMi > 1024
      ? (currentRamUsageInMi / 1024).toFixed(2) + " Gi"
      : currentRamUsageInMi + " Mi";

  const handleDelete = (deploymentId: string) => {
    closeDeploymentMutation(Number(deploymentId));
  };

  return (
    <ServicePage
      title="VM Instances"
      description="Deploy and manage your custom backend instances"
      deployPath="/app/services/vm/deploy"
      user={user}
      isLoading={isLoading}
      authLoading={authLoading}
      error={error}
      deployments={deployments}
      isDeploymentActive={isDeploymentActive}
      fetchDeployments={fetchDeployments}
      activeInstances={activeInstances}
      serviceName="VM"
      onDelete={handleDelete}
      router={router}
    />
  );
}

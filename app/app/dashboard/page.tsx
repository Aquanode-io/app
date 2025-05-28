"use client";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useDeployments, useCloseDeployment } from "@/hooks/deployments/useDeployments";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuthContext";
import { getProviderFromEnv } from "@/lib/utils";
import DeploymentsList from "@/components/services/common/DeploymentsList";
import { InfoIcon } from "lucide-react";


interface DeploymentTableProps {
  userId: string;
}

function DeploymentTable({ userId }: DeploymentTableProps) {
  const { toast } = useToast();

  // Get the provider from environment variable
  const envProvider = getProviderFromEnv();

  // Use the deployment hook instead of directly calling the API
  const { 
    data: deployments = [], 
    isLoading: loading, 
    error 
  } = useDeployments(userId, undefined, envProvider);

  // Hook for closing deployments
  const { mutate: closeDeploymentMutation } = useCloseDeployment();

  // Handler for deployment deletion/stopping
  const handleDeleteDeployment = (deploymentId: string) => {
    closeDeploymentMutation(Number(deploymentId));
  };

  // Format date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-hidden">
      <div className="flex items-center gap-2 py-2 px-3 mb-4 rounded-md bg-primary/5 border border-primary/10">
        <InfoIcon className="h-4 w-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Note: Deployments take a few minutes to become active
        </p>
      </div>
      {!loading && deployments.length === 0 ? (
        <div className="text-center py-12 sm:py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
          <p className="text-base sm:text-lg text-muted-foreground">
            {envProvider ? (
              <>
                {" "}
                No active deployments found for provider:{" "}
                <span className="capitalize">{envProvider}</span>
              </>
            ) : (
              "No active deployments found"
            )}
          </p>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground/70">
            Create a new deployment to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 w-full">
          <DeploymentsList
            isLoading={loading}
            error={error ? String(error) : null}
            deployments={deployments}
            onDelete={handleDeleteDeployment}
          />
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  return (
    <div className="container mx-auto px-0 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start ml-4 sm:items-center mb-6 sm:mb-12 gap-4 sm:gap-6">
        <div>
          <h1 className="section-title text-xl sm:text-2xl md:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your deployments and applications
          </p>
        </div>
        <Link href="/app/services" className="w-full sm:w-auto">
          <Button
            size="default"
            // className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-900/30 w-full sm:w-auto"
          >
            Deploy New Service
          </Button>
        </Link>
      </div>

      <div className="subtle-glow mb-6 sm:mb-8">
        <div className="dashboard-card">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">
            Your Deployments
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-8 sm:py-12 text-muted-foreground">
              <div className="animate-pulse text-sm sm:text-base">
                Loading authentication...
              </div>
            </div>
          ) : user?.id ? (
            <DeploymentTable userId={user.id} />
          ) : (
            <div className="text-center py-12 sm:py-20 bg-secondary/10 rounded-xl border border-border/40 backdrop-blur-sm">
              <p className="text-base sm:text-lg text-muted-foreground">
                Please sign in to view your deployments
              </p>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

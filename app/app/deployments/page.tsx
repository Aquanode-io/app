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
import { Container, Heading, Text, Card } from "@/components/ui/design-system";

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
      <Card variant="dense" className="border-primary/10 bg-primary/5">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-primary" />
          <Text variant="small" muted>
            Note: Deployments take a few minutes to become active
          </Text>
        </div>
      </Card>
      
      {!loading && deployments.length === 0 ? (
        <Card variant="elevated" className="text-center space-element">
          <Text variant="large" muted>
            {envProvider ? (
              <>
                No active deployments found for provider:{" "}
                <span className="capitalize">{envProvider}</span>
              </>
            ) : (
              "No active deployments found"
            )}
          </Text>
          <Text variant="small" muted className="opacity-70">
            Create a new deployment to get started
          </Text>
        </Card>
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
    <Container variant="wide" className="space-dashboard">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-element gap-4 sm:gap-6">
        <div>
          <Heading level={1} className="space-tight">
            Deployments
          </Heading>
          <Text variant="base" muted>
            Manage all your deployed apps and services at one place.
          </Text>
        </div>
        {/* <Link href="/app/services" className="w-full sm:w-auto">
          <Button size="default" className="w-full sm:w-auto">
            Deploy New Service
          </Button>
        </Link> */}
      </div>

      <Card variant="primary" className="space-component">
        {isLoading ? (
          <div className="flex justify-center items-center space-element text-muted-foreground">
            <div className="animate-pulse">
              <Text variant="base">Loading authentication...</Text>
            </div>
          </div>
        ) : user?.id ? (
          <DeploymentTable userId={user.id} />
        ) : (
          <Card variant="elevated" className="text-center space-element">
            <Text variant="large" muted>
              Please sign in to view your deployments
            </Text>
          </Card>
        )}
      </Card>
      <Toaster />
    </Container>
  );
}

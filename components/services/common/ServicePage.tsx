import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, InfoIcon, RefreshCw } from "lucide-react";
import { Deployment } from "@/lib/types";
import DeploymentsList from "./DeploymentsList";
import ServiceSidebar from "./ServiceSidebar";
import { Container, Heading, Text, Card } from "@/components/ui/design-system";

interface ServicePageProps {
  title: string;
  description: string;
  deployPath: string;
  user: any;
  isLoading: boolean;
  authLoading: boolean;
  error: string | null;
  deployments: Deployment[];
  isDeploymentActive: (createdAt: string, duration: string) => boolean;
  fetchDeployments: () => void;
  activeInstances: number;
  serviceName: string;
  onDelete?: (deploymentId: string) => void;
  router: any;
}

const ServicePage: React.FC<ServicePageProps> = ({
  title,
  description,
  deployPath,
  user,
  isLoading,
  authLoading,
  error,
  deployments,
  isDeploymentActive,
  fetchDeployments,
  activeInstances,
  serviceName,
  onDelete,
  router,
}) => {
  const renderAuthContent = (content: React.ReactNode) => {
    if (authLoading) {
      return (
        <Card variant="elevated" className="text-center space-element">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mb-4 text-primary mx-auto" />
          <Text variant="base" muted>
            Loading authentication...
          </Text>
        </Card>
      );
    }

    if (!user?.id) {
      return (
        <Card variant="elevated" className="text-center space-element">
          <Text variant="large" className="space-tight">
            Please sign in to view your deployments
          </Text>
          <Button variant="outline">Sign In</Button>
        </Card>
      );
    }

    return content;
  };

  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="wide">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-element gap-4 sm:gap-6">
          <div>
            <Heading level={1} className="space-tight">
              {title}
            </Heading>
            <Text variant="base" muted>
              {description}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="default"
              onClick={() => router.push(deployPath)}
              className="w-full sm:w-auto"
            >
              <span>Create Instance</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <Button variant="outline" onClick={fetchDeployments}>
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {renderAuthContent(
          <div className="w-full overflow-hidden space-component">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-4">
              {/* Mobile: Sidebar on top for small screens */}
              <div className="block md:hidden">
                <ServiceSidebar
                  deployments={deployments}
                  onRefresh={fetchDeployments}
                  isDeploymentActive={isDeploymentActive}
                  serviceName={serviceName}
                  isLoading={isLoading}
                  activeInstances={activeInstances}
                />
              </div>

              {/* Deployments List */}
              <div className="md:col-span-3 w-full overflow-x-auto">
                <Card variant="primary" className="space-element">
                  <Heading level={2} className="space-tight">
                    Your Deployments
                  </Heading>

                  <Card
                    variant="dense"
                    className="border-primary/10 bg-primary/5 space-tight"
                  >
                    <div className="flex items-center gap-2">
                      <InfoIcon className="h-4 w-4 text-primary" />
                      <Text variant="small" muted>
                        Note: Deployments take a few minutes to become active
                      </Text>
                    </div>
                  </Card>

                  <DeploymentsList
                    isLoading={isLoading}
                    error={error}
                    deployments={deployments}
                    onDelete={onDelete}
                    serviceName={serviceName}
                  />
                </Card>
              </div>

              {/* Desktop: Sidebar on right for larger screens */}
              <div className="hidden md:block md:col-span-1">
                <ServiceSidebar
                  deployments={deployments}
                  onRefresh={fetchDeployments}
                  isDeploymentActive={isDeploymentActive}
                  serviceName={serviceName}
                  isLoading={isLoading}
                  activeInstances={activeInstances}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default ServicePage;

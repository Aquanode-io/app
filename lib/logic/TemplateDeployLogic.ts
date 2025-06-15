import { useRouter } from "next/navigation";
import { getProviderFromEnv } from "@/lib/utils";
import { ServiceType } from "@/lib/types";
import { useCreateDeployment } from "@/hooks/deployments/useCreateDeployment";
import { toast } from "sonner";
import { VMTemplate, Template } from "@/lib/catalog";

export interface User {
  id: string;
}

interface UseTemplateDeployProps {
  template: Template | null;
  user: User | null;
  isAuthLoading: boolean;
}

interface UseVMTemplateDeployProps {
  template: VMTemplate | null;
  user: User | null;
  isAuthLoading: boolean;
}

export function useTemplateDeploy({
  template,
  user,
  isAuthLoading,
}: UseTemplateDeployProps) {
  const router = useRouter();

  const { mutate: createDeployment, isPending: isDeploying } =
    useCreateDeployment("/app/deployments");

  const handleDeploy = async () => {
    if (!user?.id) {
      toast.error(
        "Authentication Required. Please sign in to deploy a template."
      );
      return;
    }

    if (!template) {
      toast.error("Template not found.");
      return;
    }

    // For basic templates, we need different handling
    const config = {
      serviceType: ServiceType.BACKEND,
      image: template.repository || "", // fallback
      deploymentDuration: "1h",
      appPort: 22,
      appCpuUnits: 1,
      appMemorySize: "2Gi",
      appStorageSize: "10Gi",
      allowAutoscale: false,
      disablePull: false,
    };

    createDeployment(
      {
        service: "BACKEND",
        tier: "DEFAULT",
        provider: getProviderFromEnv(),
        config,
      },
      {
        onError: (error) => {
          console.error("Error deploying template:", error);
          toast.error("Failed to deploy template. Please try again.");
        },
        onSuccess: () => {
          toast.success("Template deployed successfully!");
          router.push("/app/deployments");
        },
      }
    );
  };

  return {
    isDeploying,
    handleDeploy,
    isButtonDisabled: isAuthLoading || !user?.id || isDeploying || !template,
  };
}

export function useVMTemplateDeploy({
  template,
  user,
  isAuthLoading,
}: UseVMTemplateDeployProps) {
  const router = useRouter();

  const { mutate: createDeployment, isPending: isDeploying } =
    useCreateDeployment("/app/deployments");

  const handleDeploy = async () => {
    if (!user?.id) {
      toast.error(
        "Authentication Required. Please sign in to deploy a template."
      );
      return;
    }

    if (!template) {
      toast.error("Template not found.");
      return;
    }

    const config = {
      serviceType: ServiceType.BACKEND,
      image: template.repository, // Use repository instead of image
      deploymentDuration: template.config.deploymentDuration,
      appPort: Number(template.config.appPort),
      appCpuUnits: Number(template.config.cpuUnits),
      appMemorySize: template.config.memorySize,
      appStorageSize: template.config.storageSize,
      allowAutoscale: false,
      disablePull: false,
    };

    createDeployment(
      {
        service: "BACKEND",
        tier: "DEFAULT",
        provider: getProviderFromEnv(),
        config,
      },
      {
        onError: (error) => {
          console.error("Error deploying template:", error);
          toast.error("Failed to deploy template. Please try again.");
        },
        onSuccess: () => {
          toast.success("Template deployed successfully!");
          router.push("/app/deployments");
        },
      }
    );
  };

  return {
    isDeploying,
    handleDeploy,
    isButtonDisabled: isAuthLoading || !user?.id || isDeploying || !template,
  };
}

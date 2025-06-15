"use client";

import { useState, useMemo } from "react";
import { DeploymentConfig, ProviderType, ServiceType } from "@/lib/types";
import { useAuth } from "@/hooks/auth/useAuthContext";
import { Database, Layers } from "lucide-react";
import {
  CPU_CONSTRAINTS,
  MEMORY_CONSTRAINTS,
  DURATION_CONSTRAINTS,
  ENVIRONMENT_VARS_DEFAULT,
} from "@/constants/constrains";
import { ResourceValueOptions } from "@/components/services/common/interfaces";
import ResourceSettingSection from "@/components/services/common/ResourceSettingSection";
import SourceControlSection from "@/components/services/hosting/SourceControlSection";
import EnviromentVariableSection from "@/components/services/hosting/EnviromentVariableSection";
import BuildSettings from "@/components/services/common/BuildSettings";
import { useCreateDeployment } from "@/hooks/deployments/useCreateDeployment";
import ServiceDeployPage from "@/components/services/common/ServiceDeployPage";
import DefaultResourceView from "@/components/services/common/DefaultResourceView";
import { Button } from "@/components/ui/button";
import { getProviderFromEnv } from "@/lib/utils";
import { toast } from "sonner";
import { Card, Text } from "@/components/ui/design-system";

export default function CustomServiceDeployment() {
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("main");
  const [portNumber, setPortNumber] = useState<number>(3000);
  const [envVarsJson, setEnvVarsJson] = useState<string>(
    ENVIRONMENT_VARS_DEFAULT
  );
  const [selectedProvider, setSelectedProvider] =
    useState<ProviderType>(getProviderFromEnv());
  
  // Build settings state
  const [buildCommand, setBuildCommand] = useState<string>("npm run build");
  const [runCommand, setRunCommand] = useState<string>("npm start");
  const [installCommand, setInstallCommand] = useState<string>("npm install");
  const [outputDirectory, setOutputDirectory] = useState<string>("dist");

  const [values, setValues] = useState<ResourceValueOptions>({
    appCpuUnits: String(CPU_CONSTRAINTS.DEFAULT),
    appMemorySize: MEMORY_CONSTRAINTS.DEFAULT_MI,
    memoryUnit: "Mi",
    appStorageSize: 1,
    storageUnit: "Gi",
    deploymentDuration: DURATION_CONSTRAINTS.DEFAULT_HOURS,
    runCommands: "",
    allowAutoscale: false,
    disablePull: false
  });

  const { mutate: createDeployment, isPending: isLoading } =
    useCreateDeployment("/app/services/hosting");

  // Add these new state variables after the existing ones:
  const [sourceType, setSourceType] = useState<"github" | "docker">("github");
  const [dockerImage, setDockerImage] = useState<string>("");
  const [dockerTag, setDockerTag] = useState<string>("latest");
  const [dockerUsername, setDockerUsername] = useState<string>("");
  const [dockerPassword, setDockerPassword] = useState<string>("");
  const [privateRegistry, setPrivateRegistry] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("nodejs");

  // Create deployment config object
  const createConfigObject = (customValues?: ResourceValueOptions) => {
    const vals = customValues || values;
    
    // Create a config object with all required properties
    return {
      appPort: portNumber,
      deploymentDuration: `${vals.deploymentDuration}h`,
      appCpuUnits: Number(vals.appCpuUnits),
      appMemorySize: `${vals.appMemorySize}${vals.memoryUnit}`,
      appStorageSize: `${vals.appStorageSize}${vals.storageUnit}`,
      image: "", // Empty string instead of null/undefined
      runCommands: runCommand || "", // Use runCommand from build settings
      allowAutoscale: vals.allowAutoscale ?? false,
      disablePull: vals.disablePull ?? false
    };
  };

  // Create environment variables object from JSON
  const parseEnvVars = () => {
    try {
      return JSON.parse(envVarsJson);
    } catch (e) {
      console.error("Error parsing environment variables:", e);
      return {};
    }
  };

  // Source control data is separate from config in the API
  const sourceControlConfig = useMemo(() => ({
    repoUrl,
    branchName
  }), [repoUrl, branchName]);

  // Build settings config
  const buildSettingsConfig = useMemo(() => ({
    buildCommand,
    runCommand,
    installCommand,
    outputDirectory,
  }), [buildCommand, runCommand, installCommand, outputDirectory]);

  if (!user?.id) {
    return (
      <Card variant="elevated" className="text-center space-element">
        <Text variant="large" className="space-tight">
          Please sign in to deploy custom services
        </Text>
        <Button variant="outline">
          Sign In
        </Button>
      </Card>
    );
  }

  const handleDefaultDeploy = (provider?: ProviderType, config?: any) => {
    if (provider) {
      setSelectedProvider(provider);

      // Get environment variables

      //This is hacky, but it works for now. When backend is updated, we should update this to use the new backend variables.
      const envVars = {
        ...parseEnvVars(),
        BUILD_COMMAND: buildSettingsConfig.buildCommand,
        INSTALL_COMMAND: buildSettingsConfig.installCommand,
        OUTPUT_DIRECTORY: buildSettingsConfig.outputDirectory,
      };

      // Create the complete payload for the API
      createDeployment({
        service: "BACKEND",
        tier: "DEFAULT",
        provider: provider,
        config: {
          ...createConfigObject(),
          repoUrl: sourceControlConfig.repoUrl,
          branchName: sourceControlConfig.branchName,
          envVars, // Use the combined envVars
          runCommands: buildSettingsConfig.runCommand,
        }
      });
    }
  };

  const handleCustomDeploy = (provider: ProviderType, config?: any) => {
    const configToPass: DeploymentConfig = {
      serviceType: ServiceType.BACKEND,
      ...createConfigObject(),
      // Include these fields in the config object instead
      repoUrl: sourceControlConfig.repoUrl,
      branchName: sourceControlConfig.branchName,
      env: parseEnvVars()
    };

     createDeployment({
        service: "BACKEND",
        tier: "CUSTOM",
        provider: provider,
        config: configToPass
      });


    console.log(configToPass);
    const customDeployButtonAction = () => {
      toast.message("Want to use custom deployment?", {
        description:
          "Contact us at contact@aquanode.io, or try our Standard deployment for free!",
      });
    };

    customDeployButtonAction();
  };

  const deploymentOptions = [
    {
      title: "Default Deployment",
      description: "Deploy instantly on shared infrastructure",
      resources: ["CPU: 1 unit", "Memory: 1Gi", "Storage: 1Gi", "Duration: 1h"],
      free: true,
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: "Custom Deployment",
      description: "Configure your own dedicated resources",
      resources: [
        "Customizable CPU",
        "Adjustable memory",
        "Configurable storage",
        "Flexible duration",
      ],
      free: false,
      icon: <Layers className="h-5 w-5" />,
    },
  ];

  const defaultResources = [
    { label: "CPU", value: "1 Unit" },
    { label: "Memory", value: "1 Gi" },
    { label: "Storage", value: "1 Gi" },
    { label: "Duration", value: "1 Hours" },
  ];

  return (
    <ServiceDeployPage
      title="Deployments Instance"
      description="Deploy a custom service with your preferred configuration"
      deploymentOptions={deploymentOptions}
      resourceSettingSection={
        <ResourceSettingSection values={values} setValues={setValues} />
      }
      handleDefaultDeploy={handleDefaultDeploy}
      handleCustomDeploy={handleCustomDeploy}
      isLoading={isLoading}
      defaultView={
        <DefaultResourceView 
          resources={defaultResources}
          allowAutoscale={values.allowAutoscale || false}
          autoRedeploy={!values.disablePull}
          onAllowAutoscaleChange={(value) => setValues({ ...values, allowAutoscale: value })}
          onAutoRedeployChange={(value) => setValues({ ...values, disablePull: !value })}
        />
      }
      sourceControlSection={
        <SourceControlSection
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          branchName={branchName}
          setBranchName={setBranchName}
          dockerImage={dockerImage}
          setDockerImage={setDockerImage}
          dockerTag={dockerTag}
          setDockerTag={setDockerTag}
          dockerUsername={dockerUsername}
          setDockerUsername={setDockerUsername}
          dockerPassword={dockerPassword}
          setDockerPassword={setDockerPassword}
          privateRegistry={privateRegistry}
          setPrivateRegistry={setPrivateRegistry}
          sourceType={sourceType}
          setSourceType={setSourceType}
        />
      }
      environmentVariablesSection={
        <EnviromentVariableSection
          envVarsJson={envVarsJson}
          setEnvVarsJson={setEnvVarsJson}
        />
      }
      buildSettingsSection={
        <BuildSettings
          runCommand={runCommand}
          setRunCommand={setRunCommand}
          installCommand={installCommand}
          setInstallCommand={setInstallCommand}
          outputDirectory={outputDirectory}
          setOutputDirectory={setOutputDirectory}
          portNumber={portNumber}
          setPortNumber={setPortNumber}
          language={language}
          setLanguage={setLanguage}
        />
      }
      serviceName="hosting"
      showSourceControlInDefault={true}
      showEnvironmentVarsInDefault={true}
      showBuildSettingsInDefault={true}
      sourceControlConfig={sourceControlConfig}
      environmentVarsConfig={{ envVarsJson }}
      buildSettingsConfig={buildSettingsConfig}
      resourceConfig={values}
    />
  );
}

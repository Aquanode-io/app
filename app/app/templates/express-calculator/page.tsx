"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuthContext";
import TemplateContainer from "@/components/templates/TemplateContainer";
import TemplateHeader from "@/components/templates/TemplateHeader";
import TemplateDetailsCard from "@/components/templates/TemplateDetailsCard";
import { useTemplateDeploy } from "@/components/templates/TemplateDeployLogic";

const ExpressCalculatorTemplate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/app/templates";
  const { user, isLoading } = useAuth();

  const handleBack = () => {
    router.push(from);
  };

  const templateDetails = {
    "Repository URL": "https://github.com/Aquanodeio/templates.git",
    "Branch Name": "main",
    "App Port": "3000",
    "Deployment Duration": "1h",
    "Run Commands": "cd javascript-calculator-server && npm install && npm start",
    "CPU Units": "0.5",
    "Memory Size": "1Gi",
    "Storage Size": "2Gi",
  };

  const { isDeploying, handleDeploy, isButtonDisabled } = useTemplateDeploy({
    templateDetails,
    user,
    isAuthLoading: isLoading,
  });

  return (
    <div>
      <TemplateContainer>
        <TemplateHeader
          title="Express.js Calculator Template"
          description="Express.js Server with HTML rendered frontend. Quickly deploy a simple web calculator application."
          onBackClick={handleBack}
        />

        <TemplateDetailsCard
          templateDetails={templateDetails}
          isDeploying={isDeploying}
          onDeploy={handleDeploy}
          disabled={isButtonDisabled}
        />
      </TemplateContainer>
    </div>
  );
};

export default ExpressCalculatorTemplate;

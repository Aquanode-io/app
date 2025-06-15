"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { FileText, Server, Grid, LayoutDashboard, CreditCard, Bot, ChevronDown, ChevronRight, Cpu, Database, Container, Wrench, type LucideIcon } from "lucide-react";
import Link from "next/link";
import AquaCredits from "@/components/AquaCredits";
import Image from "next/image";
import aquanodeLogo from "@/assets/aquanode-logo.png";

// Styling constants
const BUTTON_BASE_CLASSES = "w-full justify-start gap-2.5 py-3 rounded-lg group text-sm transition-all duration-300 flex items-center";
const ACTIVE_BUTTON_CLASSES = "text-accent bg-accent/10 border-accent/20";
const INACTIVE_BUTTON_CLASSES = "text-muted-foreground";
const CHEVRON_CLASSES = "text-muted-foreground transition-colors duration-300";
const ICON_CLASSES = "text-muted-foreground transition-colors duration-300";

interface SidebarProps {
  isMobileOpen?: boolean;
  credits?: number;
  threshold?: string;
}

export const Sidebar = ({ isMobileOpen, credits = 1250.75, threshold = "2/2" }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // State for collapsible sections
  const [isServicesExpanded, setIsServicesExpanded] = useState(true);
  const [isInferenceAPIManuallyExpanded, setIsInferenceAPIManuallyExpanded] = useState(false);
  const [isBackendAppsManuallyExpanded, setIsBackendAppsManuallyExpanded] = useState(false);
  const [isContainerVMsManuallyExpanded, setIsContainerVMsManuallyExpanded] = useState(false);

  // Helper function to check if a path is active
  const isPathActive = (path: string, exact = false): boolean => {
    if (!pathname) return false;
    return exact ? pathname === path : pathname.includes(path);
  };
  
  // Auto-expand sections based on current route OR manual toggle
  const isInferenceAPIExpanded = isPathActive("/app/services/inference") || isInferenceAPIManuallyExpanded;
  const isBackendAppsExpanded = isPathActive("/app/services/backend") || isBackendAppsManuallyExpanded;
  const isContainerVMsExpanded = isPathActive("/app/services/vm") || isContainerVMsManuallyExpanded;

  const NavButton = ({ 
    children, 
    onClick, 
    isActive, 
    className = "", 
    disabled = false,
    indent = 0 
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
    disabled?: boolean;
    indent?: number;
  }) => (
    <div
      className={`${BUTTON_BASE_CLASSES} ${
        isActive ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={{ paddingLeft: `${16 + (indent * 20)}px` }}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );

  const CollapsibleSection = ({ 
    title, 
    icon: Icon, 
    isExpanded, 
    onToggle, 
    onMainClick,
    children,
    indent = 0,
    isActive
  }: {
    title: string;
    icon: LucideIcon;
    isExpanded: boolean;
    onToggle: () => void;
    onMainClick: () => void;
    children: React.ReactNode;
    indent?: number;
    isActive?: boolean;
  }) => (
    <div>
      <div
        className={`${BUTTON_BASE_CLASSES} ${
          isActive ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
        } flex items-center cursor-pointer`}
        style={{ paddingLeft: `${16 + (indent * 20)}px` }}
      >
        {/* Arrow icon - separate clickable area */}
        <div 
          className="p-1 rounded transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isExpanded ? (
            <ChevronDown size={16} className={`${isActive ? "text-accent" : CHEVRON_CLASSES}`} />
          ) : (
            <ChevronRight size={16} className={`${isActive ? "text-accent" : CHEVRON_CLASSES}`} />
          )}
        </div>
        {/* Main button area */}
        <div 
          className="flex items-center gap-2.5 flex-1"
          onClick={onMainClick}
        >
          <Icon size={18} className={ICON_CLASSES} />
          <span>{title}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-72 bg-card/90 backdrop-blur-lg border-r border-border/60 flex flex-col p-3 overflow-y-auto z-[60] transition-transform duration-300 md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-2 p-4 border-b border-border/40 mb-4">
        <Link
          href="/"
          className="text-xl font-bold text-foreground transition-colors duration-300 flex items-center gap-2"
        >
          <Image src={aquanodeLogo} alt="Aquanode" width={32} height={32} />
          AQUANODE
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {/* Credit Section */}
        <AquaCredits credits={credits} threshold={threshold} />

        {/* Services Section */}
        <div>
          <div
            className={`${BUTTON_BASE_CLASSES} ${
              isPathActive("/app/services", true) ? ACTIVE_BUTTON_CLASSES : INACTIVE_BUTTON_CLASSES
            } cursor-pointer`}
            style={{ paddingLeft: `16px` }}
            onClick={() => router.push("/app/services")}
          >
            <Server size={18} className={ICON_CLASSES} />
            <span>Services</span>
          </div>
          <div className="ml-2 space-y-1">
              {/* Inference API */}
              <CollapsibleSection
                title="Inference API"
                icon={Cpu}
                isExpanded={isInferenceAPIExpanded}
                onToggle={() => setIsInferenceAPIManuallyExpanded(!isInferenceAPIManuallyExpanded)}
                onMainClick={() => router.push("/app/services/inference")}
                indent={1}
              >
                <NavButton
                  onClick={() => router.push("/app/services/inference")}
                  isActive={isPathActive("/app/services/inference", true)}
                  indent={2}
                >
                  <LayoutDashboard
                    size={18}
                    className={`${
                      isPathActive("/app/services/inference", true)
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>Overview</span>
                </NavButton>
                <NavButton
                  onClick={() => router.push("/app/services/inference/models-gallery")}
                  isActive={isPathActive("/app/services/inference/models-gallery")}
                  indent={2}
                >
                  <Grid
                    size={18}
                    className={`${
                      isPathActive("/app/services/inference/models-gallery")
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>Models Gallery</span>
                </NavButton>
              </CollapsibleSection>

              {/* Backend Apps */}
              <CollapsibleSection
                title="Backend Apps"
                icon={Database}
                isExpanded={isBackendAppsExpanded}
                onToggle={() => setIsBackendAppsManuallyExpanded(!isBackendAppsManuallyExpanded)}
                onMainClick={() => router.push("/app/services/backend")}
                indent={1}
              >
                <NavButton
                  onClick={() => router.push("/app/services/backend")}
                  isActive={isPathActive("/app/services/backend", true)}
                  indent={2}
                >
                  <LayoutDashboard
                    size={18}
                    className={`${
                      isPathActive("/app/services/backend", true)
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>Overview</span>
                </NavButton>
                <NavButton
                  onClick={() => router.push("/app/services/backend/one-click-apps")}
                  isActive={isPathActive("/app/services/backend/one-click-apps")}
                  indent={2}
                >
                  <FileText
                    size={18}
                    className={`${
                      isPathActive("/app/services/backend/one-click-apps")
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>One-Click Apps</span>
                </NavButton>
              </CollapsibleSection>

              {/* Container VMs */}
              <CollapsibleSection
                title="Container VMs"
                icon={Container}
                isExpanded={isContainerVMsExpanded}
                onToggle={() => setIsContainerVMsManuallyExpanded(!isContainerVMsManuallyExpanded)}
                onMainClick={() => router.push("/app/services/vm")}
                indent={1}
              >
                <NavButton
                  onClick={() => router.push("/app/services/vm")}
                  isActive={isPathActive("/app/services/vm", true)}
                  indent={2}
                >
                  <LayoutDashboard
                    size={18}
                    className={`${
                      isPathActive("/app/services/vm", true)
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>Overview</span>
                </NavButton>
                <NavButton
                  onClick={() => router.push("/app/services/vm/pre-configured")}
                  isActive={isPathActive("/app/services/vm/pre-configured")}
                  indent={2}
                >
                  <FileText
                    size={18}
                    className={`${
                      isPathActive("/app/services/vm/pre-configured")
                        ? "text-accent"
                        : ICON_CLASSES
                    }`}
                  />
                  <span>Pre-Configured VMs</span>
                </NavButton>
              </CollapsibleSection>
            </div>
        </div>

        {/* Service Composer */}
        <NavButton
          onClick={() => router.push("/app/service-composer")}
          isActive={isPathActive("/app/service-composer")}
        >
          <Wrench
            size={18}
            className={`${
              isPathActive("/app/service-composer")
                ? "text-accent"
                : ICON_CLASSES
            }`}
          />
          <span>Service Composer</span>
        </NavButton>

        {/* Agent Terminal */}
        <NavButton
          onClick={() => router.push("/app/chatbot")}
          isActive={isPathActive("/app/chatbot")}
        >
          <Bot
            size={18}
            className={`${
              isPathActive("/app/chatbot")
                ? "text-accent"
                : ICON_CLASSES
            }`}
          />
          <span>Agent Terminal</span>
        </NavButton>

        {/* Deployments */}
        <NavButton
          onClick={() => router.push("/app/deployments")}
          isActive={isPathActive("/app/deployments")}
        >
          <LayoutDashboard
            size={18}
            className={`${
              isPathActive("/app/deployments")
                ? "text-accent"
                : ICON_CLASSES
            }`}
          />
          <span>Deployments</span>
        </NavButton>

        {/* Payments */}
        <NavButton
          onClick={() => router.push("/app/payments")}
          isActive={isPathActive("/app/payments")}
        >
          <CreditCard
            size={18}
            className={ICON_CLASSES}
          />
          <span>Payments</span>
        </NavButton>
      </nav>

      <div className="pt-4 border-t border-border/40 text-muted-foreground text-sm flex items-center">
        <a
          href="https://github.com/Aquanodeio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 transition-colors duration-300 px-2.5 py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  );
};

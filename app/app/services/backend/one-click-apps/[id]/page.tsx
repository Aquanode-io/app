"use client";

import React, { use } from "react";
import Link from "next/link";
import { Container, Heading, Text, Card } from "@/components/ui/design-system";
import { Badge } from "@/components/ui/badge";
import appsData from "@/lib/launchables/apps.json";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

// Define the app type based on the JSON structure
type App = {
  name: string;
  description: string;
  category: string;
  slug: string;
  logos?: string[];
  project_site?: string;
  developer?: string;
  publisher?: string;
  repository?: string;
  technologies?: string[];
  official?: boolean;
  metadata?: Array<{
    name: string;
    value: string | number;
  }>;
  env?: Array<{
    name: string;
    value: string;
  }>;
  model_size?: string;
  model_min_vram_gb?: number;
  model_docker_image?: string;
  [key: string]: any;
};

type AppDetailPageProps = {
  params: Promise<{ id: string }>;
};

const AppDetailPage = ({ params }: AppDetailPageProps) => {
  const { id } = use(params);

  // Cast the imported JSON data to our App type
  const apps = appsData as App[];

  // Find the app by slug
  const app = apps.find((app) => app.slug === id);

  if (!app) {
    return (
      <section className="min-h-screen bg-background text-foreground space-dashboard">
        <Container variant="content">
          <div className="space-element">
            <Link
              href="/app/services/backend/one-click-apps"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to One-Click Apps
            </Link>
            <div className="text-center py-12">
              <Heading level={1} className="mb-4">
                App Not Found
              </Heading>
              <Text variant="base" muted>
                The application you're looking for could not be found.
              </Text>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="content">
        <div className="space-element">
          {/* Back Navigation */}
          <Link
            href="/app/services/backend/one-click-apps"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to One-Click Apps
          </Link>

          {/* App Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Left: App Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                {app.logos && app.logos.length > 0 && (
                  <div className="flex gap-2 flex-shrink-0">
                    {app.logos.slice(0, 2).map((logo, index) => (
                      <img
                        key={index}
                        src={logo}
                        alt={`${app.name} logo`}
                        className="h-14 w-14 rounded-lg bg-card p-2.5 border border-border/50"
                      />
                    ))}
                  </div>
                )}
                <div className="min-w-0 flex flex-1">
                  <div className="flex items-center gap-3 mt-3">
                    <Heading level={1} className="space-tight">
                      {app.name}
                    </Heading>
                    <Badge variant="secondary" className="text-xs">
                      {app.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <Text
                variant="large"
                className="text-muted-foreground leading-relaxed mb-4"
              >
                {app.description}
              </Text>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Deploy Now
                </button>

                {app.project_site && (
                  <Link
                    href={app.project_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-lg font-medium hover:bg-card/80 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Project Site
                  </Link>
                )}

                {app.repository && (
                  <Link
                    href={app.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-lg font-medium hover:bg-card/80 transition-colors text-sm"
                  >
                    <Github className="h-4 w-4" />
                    Repository
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Technologies */}
            {app.technologies && app.technologies.length > 0 && (
              <Card variant="primary">
                <div className="p-6">
                  <Heading level={3} className="mb-4">
                    Technologies
                  </Heading>
                  <div className="flex flex-wrap gap-2">
                    {app.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Technical Specifications */}
            {(app.metadata ||
              app.model_size ||
              app.model_min_vram_gb ||
              app.model_docker_image) && (
              <Card variant="primary">
                <div className="p-6">
                  <Heading level={3} className="mb-4">
                    Specifications
                  </Heading>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {app.metadata &&
                      app.metadata.map((meta, index) => (
                        <div key={index} className="flex flex-col gap-1">
                          <Text
                            variant="small"
                            className="font-medium text-muted-foreground"
                          >
                            {meta.name}
                          </Text>
                          <Text variant="small" className="font-medium">
                            {meta.value}
                          </Text>
                        </div>
                      ))}

                    {app.model_size && (
                      <div className="flex flex-col gap-1">
                        <Text
                          variant="small"
                          className="font-medium text-muted-foreground"
                        >
                          Model Size
                        </Text>
                        <Text variant="small" className="font-medium">
                          {app.model_size}
                        </Text>
                      </div>
                    )}

                    {app.model_min_vram_gb && (
                      <div className="flex flex-col gap-1">
                        <Text
                          variant="small"
                          className="font-medium text-muted-foreground"
                        >
                          Min VRAM Required
                        </Text>
                        <Text variant="small" className="font-medium">
                          {app.model_min_vram_gb} GB
                        </Text>
                      </div>
                    )}

                    {app.model_docker_image && (
                      <div className="md:col-span-2 lg:col-span-3 border-t border-border pt-4 mt-2">
                        <Text
                          variant="small"
                          className="font-medium text-muted-foreground mb-2"
                        >
                          Docker Image
                        </Text>
                        <Text
                          variant="small"
                          className="font-mono bg-muted/30 p-2 rounded text-xs break-all"
                        >
                          {app.model_docker_image}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Environment Variables */}
          {app.env && app.env.length > 0 && (
            <Card variant="primary" className="mt-6">
              <div className="p-6">
                <Heading level={3} className="mb-4">
                  Environment Variables
                </Heading>

                <div className="space-y-3">
                  {app.env.map((envVar, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-muted/20 rounded-lg"
                    >
                      <Text
                        variant="small"
                        className="font-mono font-medium min-w-0 flex-shrink-0"
                      >
                        {envVar.name}
                      </Text>
                      <Text
                        variant="small"
                        className="text-muted-foreground hidden sm:block"
                      >
                        =
                      </Text>
                      <Text
                        variant="small"
                        className="font-mono bg-background px-2 py-1 rounded border min-w-0 break-all flex-1"
                      >
                        {envVar.value}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </section>
  );
};

export default AppDetailPage;

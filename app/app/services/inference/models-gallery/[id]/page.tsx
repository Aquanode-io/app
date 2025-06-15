"use client";

import React, { use } from "react";
import Link from "next/link";
import { Container, Heading, Text, Card } from "@/components/ui/design-system";
import { Badge } from "@/components/ui/badge";
import modelsData from "@/lib/launchables/models.json";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

// Define the model type based on the JSON structure
type Model = {
  name: string;
  description: string;
  category: string;
  slug: string;
  repository?: string;
  [key: string]: any;
};

type ModelDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ModelDetailPage = ({ params }: ModelDetailPageProps) => {
  const { id } = use(params);

  // Cast the imported JSON data to our Model type
  const models = modelsData as Model[];

  // Find the model by slug
  const model = models.find((model) => model.slug === id);

  if (!model) {
    return (
      <section className="min-h-screen bg-background text-foreground space-dashboard">
        <Container variant="content">
          <div className="space-element">
            <Link
              href="/app/services/inference/models-gallery"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Models Gallery
            </Link>
            <div className="text-center py-12">
              <Heading level={1} className="mb-4">
                Model Not Found
              </Heading>
              <Text variant="base" muted>
                The model you're looking for could not be found.
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
            href="/app/services/inference/models-gallery"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Models Gallery
          </Link>

          {/* Model Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Left: Model Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="min-w-0 flex flex-1">
                  <div className="flex items-center gap-3 mt-3">
                    <Heading level={1} className="space-tight">
                      {model.name}
                    </Heading>
                  </div>
                </div>
              </div>
              <Text
                variant="large"
                className="text-muted-foreground leading-relaxed mb-4"
              >
                {model.description}
              </Text>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Deploy Now
                </button>

                {model.repository && (
                  <Link
                    href={model.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-lg font-medium hover:bg-card/80 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Repository
                  </Link>
                )}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default ModelDetailPage; 
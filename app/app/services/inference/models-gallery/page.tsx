"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container, Heading, Text, Card, Grid } from "@/components/ui/design-system";
import modelsData from "@/lib/launchables/models.json";

// Define the model type based on the JSON structure
type Model = {
  name: string;
  description: string;
  category: string;
  slug: string;
  repository?: string;
  [key: string]: any; // for other properties
};

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cast the imported JSON data to our Model type
  const models = modelsData as Model[];

  // Generate unique categories from the models array
  const categories = useMemo(() => {
    const uniqueCategories = new Set(models.map(model => model.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [models]);

  // Generate URL for each model
  const generateModelUrl = (slug: string) => {
    return `/app/services/inference/models-gallery/${slug}`;
  };

  // Get filtered models based on selected category
  const filteredModels = useMemo(() => {
    if (selectedCategory === "All") {
      return models;
    }
    return models.filter(model => model.category === selectedCategory);
  }, [models, selectedCategory]);

  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="wide">
        <div className="space-element">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Heading level={1} className="space-tight">
                Models Gallery
              </Heading>
              <Text variant="base" muted className="max-w-3xl">
                Browse ready-to-use AI models and launch in seconds, no setup needed.
              </Text>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Text variant="small" muted>
                Filter by:
              </Text>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <Grid variant="responsive-3" className="space-component">
          {filteredModels.map((model, index) => (
            <Link href={generateModelUrl(model.slug)} className="block group" key={model.slug || index}>
              <Card variant="compact" interactive className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Heading level={5} className="space-tight transition-colors duration-300 flex-1">
                      {model.name}
                    </Heading>
                    <span className="px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded-md whitespace-nowrap shrink-0 border border-border/50">
                      {model.category}
                    </span>
                  </div>
                  <Text variant="small" muted className="flex-grow">
                    {model.description}
                  </Text>
                  <div className="mt-3 text-right">
                    <Text 
                      as="span" 
                      variant="small" 
                      className="text-white font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300"
                    >
                      Use model →
                    </Text>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </Grid>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <Text variant="base" muted>
              No models found in the "{selectedCategory}" category.
            </Text>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Templates;
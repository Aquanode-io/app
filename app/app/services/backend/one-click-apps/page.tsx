"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container, Heading, Text, Card, Grid } from "@/components/ui/design-system";
import appsData from "@/lib/launchables/apps.json";

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
  [key: string]: any; // for other properties
};

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cast the imported JSON data to our App type
  const apps = appsData as App[];

  // Generate unique categories from the apps array
  const categories = useMemo(() => {
    const uniqueCategories = new Set(apps.map(app => app.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, [apps]);

  // Generate URL for each app (you may need to adjust this based on your routing structure)
  const generateAppUrl = (slug: string) => {
    return `/app/services/backend/one-click-apps/${slug}`;
  };

  // Get filtered apps based on selected category
  const filteredApps = useMemo(() => {
    if (selectedCategory === "All") {
      return apps;
    }
    return apps.filter(app => app.category === selectedCategory);
  }, [apps, selectedCategory]);

  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="wide">
        <div className="space-element">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Heading level={1} className="space-tight">
                One-Click Apps
              </Heading>
              <Text variant="base" muted className="max-w-3xl">
                Browse ready-to-use templates and launch in seconds, no setup needed.
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
          {filteredApps.map((app, index) => (
            <Link href={generateAppUrl(app.slug)} className="block group" key={app.slug || index}>
              <Card variant="compact" interactive className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Heading level={5} className="space-tight transition-colors duration-300 flex-1">
                      {app.name}
                    </Heading>
                    <span className="px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded-md whitespace-nowrap shrink-0 border border-border/50">
                      {app.category}
                    </span>
                  </div>
                  <Text variant="small" muted className="flex-grow">
                    {app.description}
                  </Text>
                  <div className="mt-3 text-right">
                    <Text 
                      as="span" 
                      variant="small" 
                      className="text-white font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300"
                    >
                      Use template →
                    </Text>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </Grid>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <Text variant="base" muted>
              No templates found in the "{selectedCategory}" category.
            </Text>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Templates;
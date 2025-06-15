"use client";

import React, { useState } from "react";
import { templates, templateCategories, VMTemplate } from "@/lib/catalog";
import Link from "next/link";
import { Container, Heading, Text, Card, Grid } from "@/components/ui/design-system";

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get all templates or filtered by category
  const getFilteredTemplates = (): (VMTemplate & { category: string })[] => {
    if (selectedCategory === "All") {
      // Flatten all templates from all categories
      return Object.entries(templates).flatMap(([category, categoryTemplates]) =>
        categoryTemplates.map((template: VMTemplate) => ({ ...template, category }))
      );
    } else {
      // Get templates from specific category
      return (templates[selectedCategory as keyof typeof templates] || []).map((template: VMTemplate) => ({
        ...template,
        category: selectedCategory
      }));
    }
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="wide">
        <div className="space-element">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Heading level={1} className="space-tight">
                Deployment Templates
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
                {templateCategories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <Grid variant="responsive-3" className="space-component">
          {filteredTemplates.map((template: VMTemplate & { category: string }, index: number) => (
            <Link href={template.url(template.id)} className="block group" key={index}>
              <Card variant="compact" interactive className="h-full">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Heading level={5} className="space-tight transition-colors duration-300 flex-1">
                      {template.name}
                    </Heading>
                    <span className="px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded-md whitespace-nowrap shrink-0 border border-border/50">
                      {template.category}
                    </span>
                  </div>
                  <Text variant="small" muted className="flex-grow">
                    {template.description}
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

        {filteredTemplates.length === 0 && (
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
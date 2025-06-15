import React from "react";
import Link from "next/link";
import { FileText, Server, Database, Cpu } from "lucide-react";
import {
  Container,
  Heading,
  Text,
  Card,
  Grid,
  StatusBadge,
} from "@/components/ui/design-system";

const serviceCategories = [
  {
    title: "AI Services",
    services: [
      {
        name: "Inference API",
        description:
          "Deploy state-of-the-art ML models like LLaMA or Whisper with a single click.",
        url: "https://forms.gle/CAovZoBDG7rgMUuK6",
        comingSoon: false,
        buttonText: "Launch →",
        icon: <Cpu className="w-6 h-6 text-foreground/70" />,
      },
    ],
  },
  {
    title: "Compute Services",
    services: [
      {
        name: "Backend Apps",
        description:
          "Instantly deploy backend services using Node.js, Flask, or Go.",
        url: "/app/services/backend",
        comingSoon: false,
        buttonText: "Launch →",
        icon: <Server className="w-6 h-6 text-foreground/70" />,
      },
      {
        name: "Container VMs",
        description: "Book an orchestrated VM with GPU for advanced compute.",
        url: "https://forms.gle/CAovZoBDG7rgMUuK6",
        comingSoon: false,
        buttonText: "Launch →",
        icon: <Database className="w-6 h-6 text-foreground/70" />,
      },
    ],
  },
];

const ServicesPage = () => {
  return (
    <section className="min-h-screen bg-background text-foreground space-dashboard">
      <Container variant="wide">
        <div className="space-element">
          <Heading level={1} className="space-tight text-foreground/95">
            Explore Services
          </Heading>
          <Text variant="base" muted className="max-w-3xl">
            Deploy inference APIs, notebooks, and compute apps with zero DevOps.
          </Text>
        </div>

        <div className="space-component">
          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <Heading
                level={3}
                className="space-element mb-6 text-muted-foreground/80 font-medium"
              >
                {category.title}
              </Heading>

              {category.title === "AI Services" ? (
                // AI Services - Full Width Card
                <Card
                  variant="primary"
                  interactive
                  className="h-full group border-border/60 hover:border-border/80 transition-all duration-300"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 space-tight">
                      <div className="rounded-lg p-2 bg-muted/30 group-hover:bg-accent/10 transition-colors duration-300">
                        {category.services[0].icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Heading
                            level={4}
                            className="space-tight text-foreground/95"
                          >
                            {category.services[0].name}
                          </Heading>
                          {category.services[0].comingSoon && (
                            <StatusBadge variant="pending">
                              Coming Soon
                            </StatusBadge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Text
                      variant="base"
                      muted
                      className="flex-grow mb-4 leading-relaxed"
                    >
                      {category.services[0].description}
                    </Text>
                    <div className="flex justify-end">
                      <Link
                        href={category.services[0].url}
                        target={
                          category.services[0].comingSoon ? "_blank" : undefined
                        }
                        rel={
                          category.services[0].comingSoon
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-accent font-medium group-hover:text-accent/80 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
                      >
                        {category.services[0].buttonText}
                      </Link>
                    </div>
                  </div>
                </Card>
              ) : (
                // Compute Services - 2 Column Grid
                <Grid variant="responsive-2">
                  {category.services.map((service, serviceIndex) => (
                    <Card
                      key={serviceIndex}
                      variant="primary"
                      interactive
                      className="h-full group border-border/60 hover:border-border/80 transition-all duration-300"
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start gap-4 space-tight">
                          <div className="rounded-lg p-2 bg-muted/30 group-hover:bg-accent/10 transition-colors duration-300">
                            {service.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Heading
                                level={4}
                                className="space-tight text-foreground/95"
                              >
                                {service.name}
                              </Heading>
                              {service.comingSoon && (
                                <StatusBadge variant="pending">
                                  Coming Soon
                                </StatusBadge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Text
                          variant="base"
                          muted
                          className="flex-grow mb-4 leading-relaxed"
                        >
                          {service.description}
                        </Text>
                        <div className="flex justify-end">
                          <Link
                            href={service.url}
                            target={service.comingSoon ? "_blank" : undefined}
                            rel={
                              service.comingSoon
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-accent font-medium group-hover:text-accent/80 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
                          >
                            {service.buttonText}
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Grid>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="space-component mt-12">
          <Heading level={2} className="space-element text-foreground/90 mb-8">
            Check these out
          </Heading>
          <Grid variant="responsive-3">
            <Card
              variant="compact"
              className="border-border/60 hover:border-border/80 transition-all duration-300"
            >
              <Heading
                level={5}
                className="space-tight text-foreground/95 mb-3"
              >
                Model Gallery
              </Heading>
              <Text variant="small" muted className="leading-relaxed">
                Browse our collection of pre-trained models and deploy them with
                a single click.
              </Text>
            </Card>
            <Card
              variant="compact"
              className="border-border/60 hover:border-border/80 transition-all duration-300"
            >
              <Heading
                level={5}
                className="space-tight text-foreground/95 mb-3"
              >
                One-Click Apps
              </Heading>
              <Text variant="small" muted className="leading-relaxed">
                Deploy backend services, runtimes, tools, and more with a single
                click.
              </Text>
            </Card>
            <Card
              variant="compact"
              className="border-border/60 hover:border-border/80 transition-all duration-300"
            >
              <Heading
                level={5}
                className="space-tight text-foreground/95 mb-3"
              >
                Pre-Configured Templates
              </Heading>
              <Text variant="small" muted className="leading-relaxed">
                Browse our collection of pre-configured templates and deploy
                them with a single click.
              </Text>
            </Card>
          </Grid>
        </div>
      </Container>
    </section>
  );
};

export default ServicesPage;

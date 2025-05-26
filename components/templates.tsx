import React from "react";
import Link from "next/link";

// Template definition
export interface Template {
  name: string;
  description: string;
  url: string;
  details?: {
    repoUrl: string;
    branchName: string;
    appPort: string;
    runCommands?: string;
    memorySize?: string;
    cpuUnits?: string;
    storageSize?: string;
  };
}

// Template list
export const templates: Template[] = [
  {
    name: "Express Javascript Server",
    description:
      "Express.js Server with HTML rendered frontend. A simple web server with a calculator interface rendered directly from the backend.",
    url: "/app/templates/express-calculator?from=/app/templates",
    details: {
      repoUrl: "https://github.com/Aquanodeio/templates.git",
      runCommands: "cd javascript-calculator-server && npm install && npm start",
      branchName: "main",
      appPort: "3000",
      memorySize: "1Gi",
      cpuUnits: "0.5",
      storageSize: "2Gi",
    }
  },
  {
    name: "Streamlit Python Calculator",
    description:
      "Streamlit Python calculator example. Interactive calculator built with Python and Streamlit for a modern data-focused web interface.",
    url: "/app/templates/streamlit-calculator?from=/app/templates",
    details: {
      repoUrl: "https://github.com/Aquanodeio/templates.git",
      branchName: "main",
      runCommands: "cd python-calculator-server && pip3 install -r requirements.txt && streamlit run main.py",
      appPort: "8501",
      memorySize: "1Gi",
      cpuUnits: "0.5",
      storageSize: "3Gi",
    }
  }
];

// Template Card Component
export const TemplateCard: React.FC<{ template: Template }> = ({ template }) => {
  return (
    <Link href={template.url} className="block group">
      <div className="dashboard-card subtle-glow">
        <div className="flex flex-col h-full">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
            {template.name}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {template.description}
          </p>
          <div className="mt-4 text-right">
            <span className="text-sm text-white font-medium group-hover:translate-x-1 inline-flex transition-transform duration-300">
              Use template →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Template Grid Component
export const TemplateGrid: React.FC<{ templates: Template[] }> = ({ templates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <TemplateCard key={index} template={template} />
      ))}
    </div>
  );
};

export default TemplateGrid;

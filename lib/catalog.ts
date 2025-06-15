import vmTemplatesData from './launchables/vms.json';

export interface Template {
  slug: string;
  name: string;
  description: string;
  repository: string;
  category: string;
}

export interface VMTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  repository: string;
  category: string;
  url: (id: string) => string;
  config: {
    appPort: string;
    deploymentDuration: string;
    memorySize: string;
    cpuUnits: string;
    storageSize: string;
  };
}

export interface Example {
  id: string;
  name: string;
  description: string;
  url: (slug: string) => string;
  config: {
    repoUrl: string;
    branchName: string;
    appPort: string;
    runCommands: string;
    memorySize: string;
    cpuUnits : string;
    storageSize: string;
    deploymentDuration: string;
  };
}

// Transform VM templates from JSON data
const transformVMTemplates = (): VMTemplate[] => {
  return vmTemplatesData
    .filter((template): template is typeof template & { slug: string } => 
      typeof template.slug === 'string' && template.slug.trim() !== ''
    )
    .map((template) => ({
      id: template.slug,
      slug: template.slug,
      name: template.name,
      description: template.description,
      repository: template.repository,
      category: template.category,
      url: (id: string) => `/app/services/vm/pre-configured/${id}?from=/app/services/vm/pre-configured`,
      config: {
        appPort: "22", // Default SSH port for VMs
        deploymentDuration: "1h",
        memorySize: "2Gi",
        cpuUnits: "1",
        storageSize: "10Gi",
      },
    }));
};

// VM Templates organized by category
export const vmTemplates = transformVMTemplates();

// Group templates by category
export const templates: Record<string, VMTemplate[]> = vmTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, VMTemplate[]>);

// Template categories for filtering
export const templateCategories = [
  "All",
  ...Array.from(new Set(vmTemplatesData.map(template => template.category)))
];

// config: {
//   deploymentDuration: "1h",
//   memorySize: "1Gi",
//   cpuUnits: "0.5",
//   storageSize: "2Gi",
//   appPort: "22",
// },

// url: (slug: string) => `/app/services/vm/pre-configured/${slug}?from=/app/services/vm/pre-configured`,


// Examples list
export const examples: Example[] = [
  {
    id: "express-calculator",
    name: "Express Javascript Server",
    description:
      "Express.js Server with HTML rendered frontend. A simple web server with a calculator interface rendered directly from the backend.",
    url: (slug) => `/app/examples/${slug}?from=/app/deployments`,
    config: {
      repoUrl: "https://github.com/Aquanodeio/examples-deploy.git",
      runCommands:
        "cd javascript-calculator-server && npm install && npm start",
      branchName: "main",
      appPort: "3000",
      memorySize: "1Gi",
      cpuUnits: "0.5",
      storageSize: "2Gi",
      deploymentDuration: "1h",
    },
  },
  {
    id: "streamlit-calculator",
    name: "Streamlit Python Calculator",
    description:
      "Streamlit Python calculator example. Interactive calculator built with Python and Streamlit for a modern data-focused web interface.",
    url: (slug) => `/app/examples/${slug}?from=/app/deployments`,
    config: {
      repoUrl: "https://github.com/Aquanodeio/examples-deploy.git",
      branchName: "main",
      runCommands:
        "cd python-calculator-server && pip3 install -r requirements.txt && streamlit run main.py",
      appPort: "8501",
      memorySize: "1Gi",
      cpuUnits: "0.5",
      storageSize: "3Gi",
      deploymentDuration: "1h",
    },
  },
];

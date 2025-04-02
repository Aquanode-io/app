import { useState, useEffect } from 'react';
import { createDeployment, DeploymentConfig, EnvironmentVars } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface DeploymentFormProps {
  userId: number;
}

export function DeploymentForm({ userId }: DeploymentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    appPort: string;
    deploymentDuration: string;
    appCpuUnits: string;
    appMemorySize: string;
    appStorageSize: string;
    repoUrl: string;
    branchName: string;
    runCommands: string;
    env: string;
  }>({
    appPort: '3000',
    deploymentDuration: '1h',
    appCpuUnits: '0.5',
    appMemorySize: '0.5Gi',
    appStorageSize: '0.5Gi',
    repoUrl: '',
    branchName: 'main',
    runCommands: '',
    env: '{}',
  });

  // Load pre-filled data from localStorage if available
  useEffect(() => {
    console.log('DeploymentForm initialized with userId:', userId);
    
    // Check if we have template pre-fill data in localStorage
    if (typeof window !== 'undefined') {
      const templateData = localStorage.getItem('templatePreFill');
      if (templateData) {
        try {
          const parsedData = JSON.parse(templateData);
          setFormData(prevData => ({
            ...prevData,
            appPort: parsedData.appPort || prevData.appPort,
            deploymentDuration: parsedData.deploymentDuration || prevData.deploymentDuration,
            appCpuUnits: parsedData.appCpuUnits || prevData.appCpuUnits,
            appMemorySize: parsedData.appMemorySize || prevData.appMemorySize,
            appStorageSize: parsedData.appStorageSize || prevData.appStorageSize,
            repoUrl: parsedData.repoUrl || prevData.repoUrl,
            branchName: parsedData.branchName || prevData.branchName,
            runCommands: parsedData.runCommands || prevData.runCommands,
          }));
          
          // Clear the template data from localStorage after using it
          localStorage.removeItem('templatePreFill');
          
          toast({
            title: "Template Data Loaded",
            description: "The form has been pre-filled with template data.",
            duration: 3000,
          });
        } catch (error) {
          console.error('Error parsing template data:', error);
        }
      }
    }
  }, [userId, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(`Creating deployment for user ID: ${userId}`);
      
      const config: DeploymentConfig = {
        appPort: parseInt(formData.appPort),
        deploymentDuration: formData.deploymentDuration,
        appCpuUnits: parseFloat(formData.appCpuUnits),
        appMemorySize: formData.appMemorySize,
        appStorageSize: formData.appStorageSize,
        runCommands: formData.runCommands,
      };

      let env: EnvironmentVars = {};
      try {
        env = JSON.parse(formData.env);
      } catch (error) {
        toast({
          title: 'Warning',
          description: 'Environment variables are not valid JSON. Using empty object.',
          variant: 'destructive',
        });
      }

      const response = await createDeployment(
        userId,
        formData.repoUrl,
        formData.branchName,
        config,
        env
      );
      
      toast({
        title: '🎉 Deployment Successful!',
        description: (
          <div className="mt-2 space-y-2">
            <p className="font-medium">Your deployment has been created successfully!</p>
            {response.appUrl && (
              <p className="text-sm">
                🌐 App URL: <a href={response.appUrl} target="_blank" rel="noopener noreferrer" className="underline">{response.appUrl}</a>
              </p>
            )}
            {
              response.deploymentId && (
                <p className="text-sm">
                  🔑 Lease ID: {response.deploymentId}
                </p>
              )
            }
          </div>
        ),
        className: "bg-green-500/90 text-white border-green-600",
        duration: 5000,
      });

      // Reset form
      setFormData({
        appPort: '3000',
        deploymentDuration: '1h',
        appCpuUnits: '0.5',
        appMemorySize: '0.5Gi',
        appStorageSize: '0.5Gi',
        repoUrl: '',
        branchName: 'main',
        runCommands: '',
        env: '{}',
      });
    } catch (error) {
      console.error('Error creating deployment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create deployment. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            value={formData.repoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, repoUrl: e.target.value }))
            }
            placeholder="Enter repository URL"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            value={formData.branchName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, branchName: e.target.value }))
            }
            placeholder="Enter branch name"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="appPort">App Port</Label>
          <Input
            id="appPort"
            type="number"
            value={formData.appPort}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, appPort: e.target.value }))
            }
            placeholder="Enter app port"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="deploymentDuration">Deployment Duration</Label>
          <Input
            id="deploymentDuration"
            value={formData.deploymentDuration}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, deploymentDuration: e.target.value }))
            }
            placeholder="e.g., 1h, 2h, 3d"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="appCpuUnits">CPU Units</Label>
          <Input
            id="appCpuUnits"
            type="number"
            step="0.1"
            value={formData.appCpuUnits}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, appCpuUnits: e.target.value }))
            }
            placeholder="e.g., 0.5, 1, 2"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="appMemorySize">Memory Size</Label>
          <Input
            id="appMemorySize"
            value={formData.appMemorySize}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, appMemorySize: e.target.value }))
            }
            placeholder="e.g., 0.5Gi, 1Gi, 2Gi"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="appStorageSize">Storage Size</Label>
          <Input
            id="appStorageSize"
            value={formData.appStorageSize}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, appStorageSize: e.target.value }))
            }
            placeholder="e.g., 0.5Gi, 1Gi, 2Gi"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="env">Environment Variables (JSON)</Label>
          <Input
            id="env"
            value={formData.env}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, env: e.target.value }))
            }
            placeholder='{"KEY": "VALUE"}'
            className="mt-1"
          />
        </div>
      </div>
      <div>
          <Label htmlFor="runCommands">Run Commands (optional)</Label>
          <Input
            id="runCommands"
            value={formData.runCommands}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, runCommands: e.target.value }))
            }
            placeholder="Optional for JS apps, otherwise e.g., pip install -r requirements.txt && python app.py"
            className="my-1"
          />
        </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Deployment...' : 'Create Deployment'}
      </Button>
    </form>
  );
} 
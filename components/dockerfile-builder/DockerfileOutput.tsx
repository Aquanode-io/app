import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Text, Heading } from '@/components/ui/design-system'

type Props = {
  dockerfile: string
}

export default function DockerfileOutput({ dockerfile }: Props) {
  const download = () => {
    const blob = new Blob([dockerfile], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'Dockerfile'
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading level={3} className="space-tight">
          Generated Dockerfile
        </Heading>
        <Button onClick={download} type="button" variant="secondary" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      
      <Card className="bg-muted/20 border border-border/40 font-mono text-sm overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <pre className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {dockerfile || (
              <Text variant="small" muted className="font-mono">
                # Your Dockerfile will appear here as you configure stages above
              </Text>
            )}
          </pre>
        </div>
      </Card>
    </div>
  )
}
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/design-system'

type Props = {
  commands: string[]
  onChange: (updated: string[]) => void
}

export default function RunList({ commands, onChange }: Props) {
  const update = (i: number, val: string) => {
    const updated = [...commands]
    updated[i] = val
    onChange(updated)
  }

  const add = () => onChange([...commands, ''])

  return (
    <div className="space-y-2">
      <Label>RUN Commands</Label>
      <div className="space-y-2">
        {commands.map((cmd, i) => (
          <Input
            key={i}
            placeholder="e.g. apt-get install -y curl"
            value={cmd}
            onChange={e => update(i, e.target.value)}
          />
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={add} className="w-full justify-center">
        + Add RUN Command
      </Button>
      <Text variant="small" muted>
        Commands to execute during build
      </Text>
    </div>
  )
}
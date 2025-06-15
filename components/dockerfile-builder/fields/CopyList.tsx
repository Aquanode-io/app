import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Text } from '@/components/ui/design-system'
import { CopyEntry } from '../DockerfileBuilderPage'

type Props = {
  entries: CopyEntry[]
  onChange: (updated: CopyEntry[]) => void
  availableAliases: string[] // passed from parent to populate --from dropdown
}

export default function CopyList({ entries, onChange, availableAliases }: Props) {
  const update = (i: number, key: keyof CopyEntry, val: string) => {
    const updated = [...entries]
    updated[i][key] = val
    onChange(updated)
  }

  const add = () => onChange([...entries, { src: '', dest: '', from: '' }])

  return (
    <div className="space-y-2">
      <Label>COPY Files</Label>
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-1 gap-2">
            <Input
              placeholder="source path"
              value={entry.src}
              onChange={e => update(i, 'src', e.target.value)}
            />
            <Input
              placeholder="destination path"
              value={entry.dest}
              onChange={e => update(i, 'dest', e.target.value)}
            />
            <select
              className="rounded-md border border-border/60 bg-background px-3 py-2 pr-10 text-sm hover:border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none'
              }}
              value={entry.from || ''}
              onChange={e => update(i, 'from', e.target.value)}
            >
              <option value="">— current stage —</option>
              {availableAliases.map(alias => (
                <option key={alias} value={alias}>{alias}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={add} className="w-full justify-center">
        + Add COPY Entry
      </Button>
      <Text variant="small" muted>
        Copy files from host or other stages
      </Text>
    </div>
  )
}

'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/design-system'
import { Button } from '@/components/ui/button'
import { Truck, Trash2 } from 'lucide-react'

import KeyValueList from './fields/KeyValueList'
import RunList from './fields/RunList'
import CopyList from './fields/CopyList'

import type { DockerStage } from './DockerfileBuilderPage'

type Props = {
  stage: DockerStage
  stages: DockerStage[]
  onChange: (updated: DockerStage) => void
  onRemove?: () => void
  index: number
}

const baseImageOptions = [
  'ubuntu:22.04',
  'node:18-alpine',
  'python:3.11-slim',
  'golang:1.21-alpine',
  'rust:slim',
  'alpine:3.18',
  'debian:bookworm',
  'custom'
]

export default function SingleStageForm({ stage, stages, onChange, onRemove, index }: Props) {
  const update = <K extends keyof DockerStage>(key: K, value: DockerStage[K]) =>
    onChange({ ...stage, [key]: value })

  const isCustom = !baseImageOptions.includes(stage.baseImage)
  const availableAliases = stages
    .filter((s, i) => i !== index && s.alias)
    .map(s => s.alias!) // non-null assert since we filtered

  return (
    <Card className="p-6 space-y-6 border-0">
      {/* Base Image */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-base">
          <Truck className="w-4 h-4 text-muted-foreground" />
          Stage {index + 1} Base Image
        </Label>
        <select
          className="w-full rounded-md border border-border/60 bg-background px-3 py-2 pr-10 text-sm hover:border-border/80 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none'
          }}
          value={isCustom ? 'custom' : stage.baseImage}
          onChange={(e) => {
            const val = e.target.value
            update('baseImage', val === 'custom' ? '' : val)
          }}
        >
          {baseImageOptions.map((img) => (
            <option key={img} value={img}>
              {img === 'custom' ? 'Custom...' : img}
            </option>
          ))}
        </select>

        {isCustom && (
          <Input
            className="mt-2"
            placeholder="Enter custom base image"
            value={stage.baseImage}
            onChange={e => update('baseImage', e.target.value)}
          />
        )}

        <Text variant="small" muted>
          FROM image used in this build stage.
        </Text>
      </div>

      {/* Optional Alias */}
      <div className="space-y-2">
        <Label>Stage Alias (optional)</Label>
        <Input
          placeholder="e.g. builder"
          value={stage.alias ?? ''}
          onChange={e => update('alias', e.target.value)}
        />
        <Text variant="small" muted>
          Used as: <code className="px-1 py-0.5 bg-muted/50 rounded text-xs">FROM {stage.baseImage} AS {stage.alias || '<alias>'}</code>
        </Text>
      </div>

      {/* LABEL / ARG / ENV */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KeyValueList
          label="Labels"
          items={stage.labels}
          onChange={val => update('labels', val)}
          helper="LABEL <key>=<value> metadata"
        />
        <KeyValueList
          label="Build Args"
          items={stage.args}
          onChange={val => update('args', val)}
          helper="ARG <key>=<value> (build-time)"
        />
        <KeyValueList
          label="Environment Variables"
          items={stage.envs}
          onChange={val => update('envs', val)}
          helper="ENV <key>=<value>"
        />
      </div>

      {/* RUN + COPY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RunList
          commands={stage.runs}
          onChange={val => update('runs', val)}
        />
        <CopyList
          entries={stage.copies}
          onChange={val => update('copies', val)}
          availableAliases={availableAliases}
        />
      </div>

      {/* WORKDIR / USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>WORKDIR</Label>
          <Input
            placeholder="/app"
            value={stage.workdir}
            onChange={e => update('workdir', e.target.value)}
          />
          <Text variant="small" muted>
            Working directory for RUN/CMD/ENTRYPOINT
          </Text>
        </div>

        <div className="space-y-2">
          <Label>USER</Label>
          <Input
            placeholder="node"
            value={stage.user}
            onChange={e => update('user', e.target.value)}
          />
          <Text variant="small" muted>
            Switch user before commands
          </Text>
        </div>
      </div>

      {/* Remove Stage */}
      {onRemove && (
        <div className="pt-4 flex justify-end border-t border-border/30">
          <Button
            variant="ghost"
            type="button"
            onClick={onRemove}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive/80 hover:bg-destructive/5"
          >
            <Trash2 className="w-4 h-4" />
            Remove Stage
          </Button>
        </div>
      )}
    </Card>
  )
}
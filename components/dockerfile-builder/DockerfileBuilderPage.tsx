'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container, Heading, Text } from '@/components/ui/design-system'
import SingleStageForm from './SingleStageForm'
import DockerfileOutput from './DockerfileOutput'

export type KeyValue = {
  key: string
  value: string
}

export type CopyEntry = {
  src: string
  dest: string
  from?: string
}

export type DockerStage = {
  baseImage: string
  alias?: string
  labels: KeyValue[]
  args: KeyValue[]
  envs: KeyValue[]
  runs: string[]
  copies: CopyEntry[]
  workdir: string
  user: string
}

const defaultStage = (): DockerStage => ({
  baseImage: 'ubuntu:22.04',
  labels: [],
  args: [],
  envs: [],
  runs: [],
  copies: [],
  workdir: '',
  user: '',
})

export default function DockerfileBuilderPage() {
  const [stages, setStages] = useState<DockerStage[]>([defaultStage()])

  const updateStage = (i: number, updated: DockerStage) => {
    const newStages = [...stages]
    newStages[i] = updated
    setStages(newStages)
  }

  const addStage = () => {
    setStages([...stages, defaultStage()])
  }

  const removeStage = (i: number) => {
    if (stages.length === 1) return // prevent deleting the last stage
    const newStages = stages.filter((_, idx) => idx !== i)
    setStages(newStages)
  }

  const generateDockerfile = () => {
    const lines: string[] = []

    stages.forEach((stage, idx) => {
      const fromLine = `FROM ${stage.baseImage}${stage.alias ? ` AS ${stage.alias}` : ''}`
      lines.push(fromLine)

      stage.labels?.filter(l => l.key).forEach(({ key, value }) => lines.push(`LABEL ${key}="${value}"`))
      stage.args?.filter(a => a.key).forEach(({ key, value }) => lines.push(`ARG ${key}=${value}`))
      stage.envs?.filter(e => e.key).forEach(({ key, value }) => lines.push(`ENV ${key}=${value}`))
      if (stage.workdir) lines.push(`WORKDIR ${stage.workdir}`)
      stage.copies?.forEach(({ src, dest, from }) => {
        if (src && dest) {
          const fromClause = from ? `--from=${from} ` : ''
          lines.push(`COPY ${fromClause}${src} ${dest}`)
        }
      })
      stage.runs?.forEach(cmd => cmd && lines.push(`RUN ${cmd}`))
      if (stage.user) lines.push(`USER ${stage.user}`)

      lines.push('')
    })

    return lines.join('\n').trim()
  }

  return (
    <Container variant="wide" className="space-dashboard">
      <div className="space-element">
        <Heading level={1} className="space-tight">
          Service Composer
        </Heading>
        <Text variant="base" muted>
          Build multi-stage Dockerfiles with our visual interface
        </Text>
      </div>

      <div className="space-component">
        {stages.map((stage, idx) => (
          <details key={idx} className="border border-border/40 rounded-lg overflow-hidden mb-4 bg-card/60 backdrop-blur-sm">
            <summary className="cursor-pointer select-none px-4 py-3 font-medium border-b border-border/30 hover:bg-muted/20 transition-colors duration-200">
                Stage {idx + 1}: {stage.baseImage || 'Unnamed'}
            </summary>
            <div className="p-4 bg-card/80">
              <SingleStageForm
                key={idx}
                index={idx}
                stage={stage}
                stages={stages}
                onChange={updated => updateStage(idx, updated)}
                onRemove={stages.length > 1 ? () => removeStage(idx) : undefined}
              />
            </div>
          </details>
        ))}

        <Button type="button" variant="secondary" onClick={addStage} className="mb-6">
          + Add Build Stage
        </Button>

        <DockerfileOutput dockerfile={generateDockerfile()} />
      </div>
    </Container>
  )
}

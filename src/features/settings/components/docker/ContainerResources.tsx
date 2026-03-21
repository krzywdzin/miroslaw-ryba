import type { DockerContainer } from '../../types/docker.types'
import { formatBytes } from '../../types/docker.types'
import { useContainerStats } from '../../hooks/useDockerStatus'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface ContainerResourcesProps {
  containers: DockerContainer[]
}

export function ContainerResources({ containers }: ContainerResourcesProps) {
  const runningContainers = containers.filter((c) => c.State === 'running')

  if (runningContainers.length === 0) {
    return (
      <p className="py-8 text-center text-[15px] text-muted-foreground">
        Brak uruchomionych kontenerow
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {runningContainers.map((container) => (
        <ResourceCard key={container.Id} container={container} />
      ))}
    </div>
  )
}

function ResourceCard({ container }: { container: DockerContainer }) {
  const name =
    container.Names[0]?.replace(/^\//, '') ?? container.Id.slice(0, 12)
  const { cpuPercent, memoryUsage, memoryLimit, isLoading } =
    useContainerStats(container.Id, true)

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-md border p-4">
        <p className="font-mono text-[13px] font-semibold">{name}</p>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
    )
  }

  const memPercent = memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0

  return (
    <div className="space-y-3 rounded-md border p-4">
      <p className="font-mono text-[13px] font-semibold">{name}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">CPU</span>
          <span className="font-semibold">{cpuPercent.toFixed(1)}%</span>
        </div>
        <Progress value={cpuPercent} className="h-2" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">Pamiec</span>
          <span className="font-semibold">
            {formatBytes(memoryUsage)}/{formatBytes(memoryLimit)}
          </span>
        </div>
        <Progress value={memPercent} className="h-2" />
      </div>
    </div>
  )
}

export interface DockerContainer {
  Id: string
  Names: string[]
  Image: string
  State: 'running' | 'exited' | 'paused' | 'restarting' | 'dead'
  Status: string
}

export interface DockerStats {
  cpu_stats: {
    cpu_usage: { total_usage: number }
    system_cpu_usage: number
  }
  precpu_stats: {
    cpu_usage: { total_usage: number }
    system_cpu_usage: number
  }
  memory_stats: {
    usage: number
    limit: number
  }
}

export type ContainerAction = 'start' | 'stop' | 'restart'

export function calculateCpuPercent(stats: DockerStats): number {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
  if (systemDelta <= 0 || cpuDelta < 0) return 0
  return Math.min(100, (cpuDelta / systemDelta) * 100)
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0B'
  const gb = bytes / (1024 * 1024 * 1024)
  if (gb >= 1) return `${gb.toFixed(1)}GB`
  const mb = bytes / (1024 * 1024)
  return `${Math.round(mb)}MB`
}

export function stripDockerLogHeader(line: string): string {
  // Docker multiplexed stream: first 8 bytes are header (stream type + size)
  // The header bytes are non-printable, so we strip them
  if (line.length > 8) {
    const charCode = line.charCodeAt(0)
    // Stream type byte is 0 (stdin), 1 (stdout), or 2 (stderr)
    if (charCode <= 2) {
      return line.slice(8)
    }
  }
  return line
}

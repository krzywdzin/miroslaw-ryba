import { describe, it, expect } from 'vitest'
import {
  calculateCpuPercent,
  formatBytes,
  stripDockerLogHeader,
} from '@/features/settings/types/docker.types'
import type {
  DockerContainer,
  DockerStats,
} from '@/features/settings/types/docker.types'

describe('Docker types and helpers', () => {
  describe('DockerContainer type parsing', () => {
    it('should accept valid container JSON shape', () => {
      const container: DockerContainer = {
        Id: 'abc123def456',
        Names: ['/mirofish-api'],
        Image: 'mirofish:v1',
        State: 'running',
        Status: 'Up 2 hours',
      }
      expect(container.State).toBe('running')
      expect(container.Names[0]).toBe('/mirofish-api')
    })

    it('should accept all valid states', () => {
      const states = ['running', 'exited', 'paused', 'restarting', 'dead'] as const
      states.forEach((state) => {
        const container: DockerContainer = {
          Id: 'test',
          Names: ['/test'],
          Image: 'test:latest',
          State: state,
          Status: 'test',
        }
        expect(container.State).toBe(state)
      })
    })
  })

  describe('calculateCpuPercent', () => {
    it('should calculate CPU percentage from delta values', () => {
      const stats: DockerStats = {
        cpu_stats: {
          cpu_usage: { total_usage: 200_000_000 },
          system_cpu_usage: 1_000_000_000,
        },
        precpu_stats: {
          cpu_usage: { total_usage: 100_000_000 },
          system_cpu_usage: 500_000_000,
        },
        memory_stats: { usage: 0, limit: 0 },
      }
      // cpuDelta = 100_000_000, systemDelta = 500_000_000
      // percent = 100_000_000 / 500_000_000 * 100 = 20%
      expect(calculateCpuPercent(stats)).toBeCloseTo(20, 1)
    })

    it('should return 0 when system delta is zero', () => {
      const stats: DockerStats = {
        cpu_stats: {
          cpu_usage: { total_usage: 100 },
          system_cpu_usage: 500,
        },
        precpu_stats: {
          cpu_usage: { total_usage: 50 },
          system_cpu_usage: 500,
        },
        memory_stats: { usage: 0, limit: 0 },
      }
      expect(calculateCpuPercent(stats)).toBe(0)
    })

    it('should cap at 100%', () => {
      const stats: DockerStats = {
        cpu_stats: {
          cpu_usage: { total_usage: 1000 },
          system_cpu_usage: 200,
        },
        precpu_stats: {
          cpu_usage: { total_usage: 0 },
          system_cpu_usage: 100,
        },
        memory_stats: { usage: 0, limit: 0 },
      }
      expect(calculateCpuPercent(stats)).toBe(100)
    })
  })

  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0B')
    })

    it('should format megabytes', () => {
      expect(formatBytes(512 * 1024 * 1024)).toBe('512MB')
    })

    it('should format gigabytes', () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe('1.0GB')
    })

    it('should format fractional gigabytes', () => {
      expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe('1.5GB')
    })

    it('should round megabytes to integer', () => {
      expect(formatBytes(256.7 * 1024 * 1024)).toBe('257MB')
    })
  })

  describe('stripDockerLogHeader', () => {
    it('should strip 8-byte header from stdout lines', () => {
      // Build a string with stdout header (byte 1) + 7 more bytes + actual message
      const header = String.fromCharCode(1, 0, 0, 0, 0, 0, 0, 12)
      const line = header + 'Hello World!'
      expect(stripDockerLogHeader(line)).toBe('Hello World!')
    })

    it('should strip 8-byte header from stderr lines', () => {
      const header = String.fromCharCode(2, 0, 0, 0, 0, 0, 0, 5)
      const line = header + 'Error'
      expect(stripDockerLogHeader(line)).toBe('Error')
    })

    it('should not strip regular text lines', () => {
      const line = 'Regular log line without header'
      expect(stripDockerLogHeader(line)).toBe(line)
    })

    it('should handle empty string', () => {
      expect(stripDockerLogHeader('')).toBe('')
    })
  })
})

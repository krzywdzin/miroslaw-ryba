import { describe, it, expect } from 'vitest'
import {
  ProjectSchema,
  TaskSchema,
  GraphNodeSchema,
} from '../../src/api/schemas/graph'
import { SimulationStateSchema, EntitySchema } from '../../src/api/schemas/simulation'
import { ReportSchema } from '../../src/api/schemas/report'

describe('Graph schemas', () => {
  it('ProjectSchema.parse succeeds with valid data', () => {
    const result = ProjectSchema.parse({ project_id: '123' })
    expect(result.project_id).toBe('123')
  })

  it('ProjectSchema.parse throws on missing project_id', () => {
    expect(() => ProjectSchema.parse({})).toThrow()
  })

  it('ProjectSchema accepts optional fields', () => {
    const result = ProjectSchema.parse({
      project_id: 'p1',
      project_name: 'Test',
      simulation_requirement: 'req',
    })
    expect(result.project_name).toBe('Test')
  })

  it('TaskSchema.parse succeeds with valid data', () => {
    const result = TaskSchema.parse({ task_id: 't1', status: 'running' })
    expect(result.task_id).toBe('t1')
    expect(result.status).toBe('running')
  })

  it('GraphNodeSchema.parse succeeds with valid data', () => {
    const result = GraphNodeSchema.parse({ id: 'n1', name: 'Node 1' })
    expect(result.id).toBe('n1')
    expect(result.name).toBe('Node 1')
  })
})

describe('Simulation schemas', () => {
  it('SimulationStateSchema.parse succeeds with required fields', () => {
    const result = SimulationStateSchema.parse({
      simulation_id: 'sim1',
      project_id: 'proj1',
      status: 'created',
    })
    expect(result.simulation_id).toBe('sim1')
    expect(result.status).toBe('created')
  })

  it('EntitySchema.parse succeeds with valid data', () => {
    const result = EntitySchema.parse({
      uuid: 'e1',
      name: 'Entity',
      type: 'person',
    })
    expect(result.uuid).toBe('e1')
    expect(result.type).toBe('person')
  })
})

describe('Report schemas', () => {
  it('ReportSchema.parse succeeds with report_id only', () => {
    const result = ReportSchema.parse({ report_id: 'r1' })
    expect(result.report_id).toBe('r1')
  })

  it('ReportSchema accepts optional fields', () => {
    const result = ReportSchema.parse({
      report_id: 'r1',
      simulation_id: 's1',
      status: 'complete',
    })
    expect(result.simulation_id).toBe('s1')
  })
})

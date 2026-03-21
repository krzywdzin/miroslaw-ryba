export const ENTITY_COLORS: Record<string, string> = {
  person: '#3b82f6',
  organization: '#8b5cf6',
  location: '#22c55e',
  event: '#f59e0b',
  default: '#6b7280',
}

export const ENTITY_TYPES = ['person', 'organization', 'location', 'event'] as const

export const ENTITY_TYPE_LABELS_PL: Record<string, string> = {
  person: 'Osoby',
  organization: 'Organizacje',
  location: 'Miejsca',
  event: 'Wydarzenia',
}

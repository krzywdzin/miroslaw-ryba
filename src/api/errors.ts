const CHINESE_ERROR_MAP: Record<string, { pl: string; en: string }> = {
  'Internal Server Error': {
    pl: 'Wewnetrzny blad serwera',
    en: 'Internal server error',
  },
  '项目不存在': {
    pl: 'Projekt nie istnieje',
    en: 'Project does not exist',
  },
  '任务不存在': {
    pl: 'Zadanie nie istnieje',
    en: 'Task does not exist',
  },
  '文件上传失败': {
    pl: 'Przesylanie pliku nie powiodlo sie',
    en: 'File upload failed',
  },
  '参数错误': {
    pl: 'Blad parametrow',
    en: 'Invalid parameters',
  },
  '模拟不存在': {
    pl: 'Symulacja nie istnieje',
    en: 'Simulation does not exist',
  },
  '报告不存在': {
    pl: 'Raport nie istnieje',
    en: 'Report does not exist',
  },
}

export function mapChineseError(
  message: string,
  locale: 'pl' | 'en' = 'pl',
): string {
  const mapping = CHINESE_ERROR_MAP[message]
  if (!mapping) return message
  return mapping[locale]
}

export class ApiError extends Error {
  readonly status: number
  readonly rawMessage?: string

  constructor(message: string, status: number, rawMessage?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.rawMessage = rawMessage
  }
}

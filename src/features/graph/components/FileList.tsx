import { FileText, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface FileListProps {
  files: File[]
  onRemove: (index: number) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileList({ files, onRemove }: FileListProps) {
  const { t } = useTranslation('graph')

  if (files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{t('upload.files.empty')}</p>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{t('upload.files.title')}</h3>
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li
            key={`${file.name}-${index}`}
            className="flex items-center gap-2 rounded-md border px-3 py-2"
          >
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm truncate flex-1">{file.name}</span>
            <Badge variant="secondary">{formatFileSize(file.size)}</Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => onRemove(index)}
              aria-label={t('upload.files.remove')}
            >
              <X className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

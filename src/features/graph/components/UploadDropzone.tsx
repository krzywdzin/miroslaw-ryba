import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface UploadDropzoneProps {
  onFilesAdded: (files: File[]) => void
}

export function UploadDropzone({ onFilesAdded }: UploadDropzoneProps) {
  const { t } = useTranslation('graph')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'rounded-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-accent bg-accent/5'
          : 'border-muted-foreground/25 hover:border-accent/50',
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">{t('upload.dropzone.title')}</p>
      <p className="text-sm text-muted-foreground mt-1">
        {t('upload.dropzone.subtitle')}
      </p>
    </div>
  )
}

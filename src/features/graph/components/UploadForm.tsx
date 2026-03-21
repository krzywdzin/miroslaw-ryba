import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { graphApi } from '@/api/graph'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { useGraphStore } from '../hooks/useGraphStore'
import { UploadDropzone } from './UploadDropzone'
import { FileList } from './FileList'
import { PredictionInput } from './PredictionInput'

export function UploadForm() {
  const { t } = useTranslation('graph')
  const navigate = useNavigate()
  const { predictionGoal, setPredictionGoal, setProjectId, setTaskId, setStep } =
    useGraphStore()

  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0 || !predictionGoal.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      for (const file of files) {
        formData.append('file', file)
      }
      formData.append('simulation_requirement', predictionGoal)

      const ontologyResult = await graphApi.generateOntology(formData)
      const projectId = ontologyResult.data.project_id
      setProjectId(projectId)

      const buildResult = await graphApi.buildGraph(projectId)
      setTaskId(buildResult.data.task_id)
      setStep('building')

      navigate('/graph/view')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('build.error'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDisabled = files.length === 0 || !predictionGoal.trim() || isSubmitting

  return (
    <div className="space-y-6">
      <UploadDropzone onFilesAdded={handleFilesAdded} />
      <FileList files={files} onRemove={handleRemoveFile} />
      <PredictionInput value={predictionGoal} onChange={setPredictionGoal} />

      {error && (
        <ErrorAlert message={error} onRetry={() => setError(null)} />
      )}

      <Button
        onClick={handleSubmit}
        disabled={isDisabled}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('upload.submitting')}
          </>
        ) : (
          t('upload.submit')
        )}
      </Button>
    </div>
  )
}

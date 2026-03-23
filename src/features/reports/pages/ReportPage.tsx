import { useParams, Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { useReportGeneration } from '../hooks/useReportGeneration'
import { ReportProgress } from '../components/ReportProgress'
import { ReportArticle } from '../components/ReportArticle'
import { ReportSidebar } from '../components/ReportSidebar'
import { ReportToolbar } from '../components/ReportToolbar'

export function ReportPage() {
  const { simulationId } = useParams<{ simulationId: string }>()

  if (!simulationId) {
    return <Navigate to="/" replace />
  }

  return <ReportPageContent simulationId={simulationId} />
}

function ReportPageContent({ simulationId }: { simulationId: string }) {
  const { t } = useTranslation('reports')
  const { state, progress, report, retry } =
    useReportGeneration(simulationId)

  // Checking state
  if (state === 'checking') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Loader className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {t('generation.checking')}
        </p>
      </div>
    )
  }

  // Generating state
  if (state === 'generating') {
    return (
      <ReportProgress
        progress={progress?.progress ?? 0}
        currentSection={progress?.current_section ?? undefined}
        completedSections={progress?.completed_sections ?? undefined}
      />
    )
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-[22px] font-semibold leading-[1.2]">
          {t('empty.reportHeading')}
        </h2>
        <p className="max-w-md text-center text-muted-foreground">
          {t('error.generationFailed')}
        </p>
        <Button onClick={retry}>{t('error.retry')}</Button>
      </div>
    )
  }

  // Viewing state
  const markdownContent = report.data?.data?.markdown_content

  if (report.isLoading || !markdownContent) {
    return (
      <div className="flex-1 p-8">
        <LoadingSkeleton variant="text" lines={3} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <ReportToolbar content={markdownContent} simulationId={simulationId} />
      <div className="flex flex-1 gap-6 p-6">
        <div className="min-w-0 flex-1" style={{ maxWidth: '720px' }}>
          <ReportArticle content={markdownContent} />
        </div>
        <ReportSidebar content={markdownContent} />
      </div>
    </div>
  )
}

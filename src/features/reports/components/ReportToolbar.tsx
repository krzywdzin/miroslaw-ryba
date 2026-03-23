import { useTranslation } from 'react-i18next'
import { Printer, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReportExport } from '../hooks/useReportExport'

interface ReportToolbarProps {
  content: string
  simulationId: string
}

export function ReportToolbar({ content, simulationId }: ReportToolbarProps) {
  const { t } = useTranslation('reports')
  const { exportPdf, downloadMarkdown } = useReportExport()

  return (
    <div className="report-toolbar no-print flex h-12 items-center gap-3 border-b px-6">
      <Button
        variant="outline"
        onClick={exportPdf}
      >
        <Printer className="mr-2 h-4 w-4" />
        {t('toolbar.exportPdf')}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadMarkdown(content, `report-${simulationId}.md`)
        }
      >
        <Download className="mr-2 h-4 w-4" />
        {t('toolbar.downloadMarkdown')}
      </Button>
    </div>
  )
}

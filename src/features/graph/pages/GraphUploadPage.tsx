import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGraphStore } from '../hooks/useGraphStore'
import { UploadForm } from '../components/UploadForm'

export function GraphUploadPage() {
  const { t } = useTranslation('graph')
  const navigate = useNavigate()
  const step = useGraphStore((s) => s.step)

  useEffect(() => {
    if (step === 'building' || step === 'done') {
      navigate('/graph/view')
    }
  }, [step, navigate])

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t('upload.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  )
}

import { useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Cloud, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { zepSchema, type ZepFormValues } from '../schemas/config.schema'
import { useConfigStore } from '../hooks/useConfigStore'
import { useConnectionTest } from '../hooks/useConnectionTest'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ZepTestResult {
  sessionCount: number
}

export function ZepSection() {
  const { t } = useTranslation('settings')
  const config = useConfigStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<ZepFormValues>({
    resolver: zodResolver(zepSchema),
    defaultValues: {
      zepApiKey: config.zepApiKey,
      zepCloudUrl: config.zepCloudUrl,
    },
    mode: 'onBlur',
  })

  const watchedValues = form.watch()

  // Auto-save on valid changes (debounced 500ms)
  const saveConfig = useCallback(
    (values: ZepFormValues) => {
      config.setConfig(values)
      toast.success(t('feedback.saved'), { duration: 1500 })
    },
    [config, t]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (form.formState.isValid && form.formState.isDirty) {
        saveConfig(watchedValues)
      }
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [watchedValues, form.formState.isValid, form.formState.isDirty, saveConfig])

  // Connection test
  const connectionTest = useConnectionTest<ZepTestResult>(async () => {
    const values = form.getValues()
    const url = values.zepCloudUrl || 'https://api.getzep.com'
    const response = await fetch(`${url}/api/v2/sessions`, {
      headers: {
        Authorization: `Api-Key ${values.zepApiKey}`,
      },
    })
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('auth')
      }
      throw new Error('network')
    }
    const data = await response.json()
    const sessionCount = Array.isArray(data) ? data.length : 0
    return { sessionCount }
  })

  // Reset test result when inputs change
  useEffect(() => {
    if (connectionTest.isSuccess || connectionTest.isError) {
      connectionTest.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.zepApiKey, watchedValues.zepCloudUrl])

  return (
    <section id="zep-cloud">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-[22px] font-semibold">
              {t('sections.zep.heading')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="zepApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sections.zep.apiKey')}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          className="font-mono text-[13px]"
                          placeholder="z_..."
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => connectionTest.test()}
                        disabled={
                          connectionTest.isPending ||
                          !form.getValues('zepApiKey')
                        }
                      >
                        {connectionTest.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t('actions.testConnection')
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                    {connectionTest.isSuccess && connectionTest.data && (
                      <div className="mt-2 rounded-md border-l-[3px] border-[hsl(142_71%_45%)] bg-background p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-1.5 text-[13px] text-[hsl(142_71%_45%)]">
                          <CheckCircle className="h-4 w-4" />
                          {t('connectionTest.zepSuccess')}
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          {t('connectionTest.zepSuccessDetail', {
                            count: connectionTest.data.sessionCount,
                          })}
                        </p>
                      </div>
                    )}
                    {connectionTest.isError && (
                      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                        <XCircle className="h-4 w-4" />
                        {connectionTest.error?.message === 'auth'
                          ? t('connectionTest.zepFailAuth')
                          : t('connectionTest.zepFailNetwork')}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zepCloudUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sections.zep.cloudUrl')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://api.getzep.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}

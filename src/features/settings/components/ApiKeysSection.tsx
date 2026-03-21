import { useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Key, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { apiKeysSchema, type ApiKeysFormValues } from '../schemas/config.schema'
import { useConfigStore } from '../hooks/useConfigStore'
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

export function ApiKeysSection() {
  const { t } = useTranslation('settings')
  const config = useConfigStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      llmApiKey: config.llmApiKey,
      llmBaseUrl: config.llmBaseUrl,
    },
    mode: 'onBlur',
  })

  // Auto-save on valid changes (debounced 500ms)
  const watchedValues = form.watch()
  const saveConfig = useCallback(
    (values: ApiKeysFormValues) => {
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

  // Connection test mutation
  const connectionTest = useMutation({
    mutationFn: async () => {
      const values = form.getValues()
      const response = await fetch(`${values.llmBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${values.llmApiKey}`,
        },
        body: JSON.stringify({
          model: config.llmModel,
          messages: [{ role: 'user', content: 'Say "ok"' }],
          max_tokens: 5,
        }),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text)
      }
      return response.json()
    },
  })

  // Reset test result when inputs change
  useEffect(() => {
    if (connectionTest.isSuccess || connectionTest.isError) {
      connectionTest.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.llmApiKey, watchedValues.llmBaseUrl])

  return (
    <section id="api-keys">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-[22px] font-semibold">
              {t('sections.apiKeys.heading')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="llmApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sections.apiKeys.llmApiKey')}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          className="font-mono text-[13px]"
                          placeholder="sk-..."
                        />
                      </FormControl>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => connectionTest.mutate()}
                        disabled={
                          connectionTest.isPending ||
                          !form.getValues('llmApiKey')
                        }
                      >
                        {connectionTest.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t('actions.test')
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                    {connectionTest.isSuccess && (
                      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-[hsl(142_71%_45%)] animate-in fade-in slide-in-from-top-1 duration-200">
                        <CheckCircle className="h-4 w-4" />
                        {t('connectionTest.llmSuccess')}
                      </div>
                    )}
                    {connectionTest.isError && (
                      <div className="mt-2 flex items-center gap-1.5 text-[13px] text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
                        <XCircle className="h-4 w-4" />
                        {t('errors.llmTestFailed')}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="llmBaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('sections.apiKeys.llmBaseUrl')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://..."
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

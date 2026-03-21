import { useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Bot } from 'lucide-react'
import { toast } from 'sonner'

import { modelSchema, type ModelFormValues } from '../schemas/config.schema'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const MODEL_PRESETS = ['qwen-plus', 'gpt-4'] as const
const CUSTOM_VALUE = '__custom__'

export function ModelSection() {
  const { t } = useTranslation('settings')
  const config = useConfigStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isCustomModel = !MODEL_PRESETS.includes(
    config.llmModel as (typeof MODEL_PRESETS)[number]
  )

  const form = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      llmModel: config.llmModel,
      boostLlmApiKey: config.boostLlmApiKey,
      boostLlmBaseUrl: config.boostLlmBaseUrl,
      boostLlmModel: config.boostLlmModel,
    },
    mode: 'onBlur',
  })

  const watchedValues = form.watch()
  const saveConfig = useCallback(
    (values: ModelFormValues) => {
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

  // Track select vs custom state
  const currentModel = form.watch('llmModel')
  const showCustomInput =
    !MODEL_PRESETS.includes(currentModel as (typeof MODEL_PRESETS)[number]) &&
    currentModel !== ''

  function handleSelectChange(value: string) {
    if (value === CUSTOM_VALUE) {
      form.setValue('llmModel', '', { shouldDirty: true })
    } else {
      form.setValue('llmModel', value, { shouldDirty: true, shouldValidate: true })
    }
  }

  const selectValue = MODEL_PRESETS.includes(
    currentModel as (typeof MODEL_PRESETS)[number]
  )
    ? currentModel
    : currentModel === ''
      ? CUSTOM_VALUE
      : CUSTOM_VALUE

  return (
    <section id="model-selection">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-[22px] font-semibold">
              {t('sections.model.heading')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="llmModel"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('sections.model.model')}</FormLabel>
                    <Select
                      value={selectValue}
                      onValueChange={handleSelectChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MODEL_PRESETS.map((preset) => (
                          <SelectItem key={preset} value={preset}>
                            {preset}
                          </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM_VALUE}>
                          {t('sections.model.customOption')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(showCustomInput || isCustomModel) && (
                <FormField
                  control={form.control}
                  name="llmModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('sections.model.customModelName')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('sections.model.customModelPlaceholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <h3 className="text-[15px] font-semibold">
                    {t('sections.model.boostHeading')}
                  </h3>
                  <p className="text-[13px] text-muted-foreground">
                    {t('sections.model.boostDescription')}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="boostLlmApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sections.model.boostApiKey')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          className="font-mono text-[13px]"
                          placeholder="sk-..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="boostLlmBaseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sections.model.boostBaseUrl')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          type="url"
                          placeholder="https://..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="boostLlmModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('sections.model.boostModel')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder={t('sections.model.customModelPlaceholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}
